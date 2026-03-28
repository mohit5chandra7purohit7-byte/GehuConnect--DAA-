from flask import Flask, jsonify, request, send_from_directory, redirect, session
from flask_cors import CORS
import sqlite3
import subprocess
import os
import json
import tempfile

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "Frontend", "HTML")
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
app.secret_key = "gehuconnect_super_secret_key"
CORS(app)

@app.before_request
def security_check():
    if request.path == "/admin.html" and not session.get("admin_logged_in"):
        return redirect("/admin_login.html")


DB_PATH = os.path.join(os.path.dirname(__file__), "gehuconnect.db")
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "Backend")


def init_db():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.executescript("""
        CREATE TABLE IF NOT EXISTS students (
            id      TEXT PRIMARY KEY,
            name    TEXT,
            branch  TEXT,
            cgpa    REAL,
            hostel  TEXT,
            room    TEXT,
            phone   TEXT
        );

        CREATE TABLE IF NOT EXISTS attendance (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            subject    TEXT,
            percentage REAL
        );

        CREATE TABLE IF NOT EXISTS notices (
            id       INTEGER PRIMARY KEY,
            title    TEXT,
            category TEXT,
            date     TEXT,
            urgency  TEXT
        );

        CREATE TABLE IF NOT EXISTS assignments (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT,
            subject    TEXT,
            title      TEXT,
            due_date   TEXT
        );

        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
    """)

    if cur.execute("SELECT COUNT(*) FROM students").fetchone()[0] == 0:
        cur.executemany("INSERT INTO students VALUES (?,?,?,?,?,?,?)", [
            ("2419260", "Mohit Purohit",  "CSE", 8.2, "Block C", "214", "9876543210"),
            ("2418628", "Maitri Goyal",   "CSE", 8.0, "Block A", "105", "9876543211"),
            ("2419475", "Manisha Bisht",  "CSE", 7.8, "Block B", "302", "9876543212"),
            ("2418996", "Shyamali Bisht", "CSE", 7.5, "Block D", "410", "9876543213"),
        ])

    if cur.execute("SELECT COUNT(*) FROM attendance").fetchone()[0] == 0:
        cur.executemany("INSERT INTO attendance(student_id,subject,percentage) VALUES (?,?,?)", [
            ("2419260", "Maths",     78),
            ("2419260", "Physics",   45),
            ("2419260", "Chemistry", 62),
            ("2419260", "DSA",       85),
            ("2419260", "English",   71),
            ("2418628", "Maths",     80),
            ("2418628", "Physics",   74),
            ("2418628", "Chemistry", 55),
            ("2419475", "Maths",     90),
            ("2419475", "DSA",       88),
            ("2418996", "Maths",     65),
            ("2418996", "Physics",   72),
        ])

    if cur.execute("SELECT COUNT(*) FROM notices").fetchone()[0] == 0:
        cur.executemany("INSERT INTO notices VALUES (?,?,?,?,?)", [
            (1, "Fee submission last date extended", "Fee",      "2026-03-20", "urgent"),
            (2, "Workshop on AI this Friday",        "Event",    "2026-03-18", "normal"),
            (3, "Exam schedule released",            "Exam",     "2026-03-15", "urgent"),
            (4, "Library closed tomorrow",           "Academic", "2026-03-14", "normal"),
        ])

    if cur.execute("SELECT COUNT(*) FROM assignments").fetchone()[0] == 0:
        cur.executemany("INSERT INTO assignments(student_id,subject,title,due_date) VALUES (?,?,?,?)", [
            ("2419260", "Maths",   "Integration assignment", "2026-03-25"),
            ("2419260", "DSA",     "Graph problems",         "2026-03-22"),
            ("2419260", "Physics", "Optics lab report",      "2026-03-28"),
            ("2418628", "Maths",   "Calculus sheet",         "2026-03-23"),
            ("2419475", "DSA",     "Sorting algorithms",     "2026-03-24"),
        ])
        
    if cur.execute("SELECT COUNT(*) FROM admins").fetchone()[0] == 0:
        cur.execute("INSERT INTO admins (username, password) VALUES (?, ?)", ("admin", "admin123"))

    con.commit()
    con.close()


def run_cpp(cpp_file, input_data):
    exe = cpp_file.replace(".cpp", ".exe")
    if not os.path.exists(exe) or os.path.getmtime(cpp_file) > os.path.getmtime(exe):
        result = subprocess.run(
            ["g++", cpp_file, "-o", exe],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            return {"error": "compile failed", "detail": result.stderr}

    fd, temp_path = tempfile.mkstemp(suffix=".txt", dir=BACKEND_DIR, text=True)
    with os.fdopen(fd, 'w') as f:
        f.write(input_data)

    result = subprocess.run([exe, temp_path], capture_output=True, text=True, cwd=BACKEND_DIR)
    
    try:
        os.remove(temp_path)
    except Exception:
        pass

    if result.returncode != 0:
        return {"error": "runtime error", "detail": result.stderr}

    try:
        return json.loads(result.stdout)
    except Exception:
        return {"error": "bad JSON output", "raw": result.stdout}


@app.route("/login")
def login():
    student_id = request.args.get("id", "")
    con = sqlite3.connect(DB_PATH)
    rows = con.execute("SELECT id,name,branch,cgpa,hostel,room,phone FROM students").fetchall()
    con.close()

    if not any(r[0] == student_id for r in rows):
        return jsonify({"error": "Student not found"}), 404

    input_data = student_id + "\n"
    input_data += "\n".join(f"{r[0]},{r[1]},{r[2]},{r[3]},{r[4]},{r[5]},{r[6]}" for r in rows) + "\n"
    cpp_path = os.path.join(BACKEND_DIR, "login.cpp")
    result = run_cpp(cpp_path, input_data)
    return jsonify(result)


@app.route("/attendance")
def attendance():
    student_id = request.args.get("id", "")
    con = sqlite3.connect(DB_PATH)
    rows = con.execute(
        "SELECT subject,percentage FROM attendance WHERE student_id=?",
        (student_id,)
    ).fetchall()
    con.close()

    if not rows:
        return jsonify({"error": "No attendance data"}), 404

    input_data = "\n".join(f"{r[0]},{r[1]}" for r in rows) + "\n"
    cpp_path = os.path.join(BACKEND_DIR, "attendance.cpp")
    result = run_cpp(cpp_path, input_data)
    return jsonify(result)


@app.route("/notices")
def notices():
    category = request.args.get("category", "all")
    con = sqlite3.connect(DB_PATH)
    rows = con.execute("SELECT id,title,category,date,urgency FROM notices").fetchall()
    con.close()

    input_data = category + "\n"
    input_data += "\n".join(f"{r[0]},{r[1]},{r[2]},{r[3]},{r[4]}" for r in rows) + "\n"
    cpp_path = os.path.join(BACKEND_DIR, "notices.cpp")
    result = run_cpp(cpp_path, input_data)
    return jsonify(result)


@app.route("/assignments")
def assignments():
    student_id = request.args.get("id", "")
    con = sqlite3.connect(DB_PATH)
    rows = con.execute(
        "SELECT subject,title,due_date FROM assignments WHERE student_id=?",
        (student_id,)
    ).fetchall()
    con.close()

    if not rows:
        return jsonify({"error": "No assignments"}), 404

    input_data = "\n".join(f"{r[0]},{r[1]},{r[2]}" for r in rows) + "\n"
    cpp_path = os.path.join(BACKEND_DIR, "assignments.cpp")
    result = run_cpp(cpp_path, input_data)
    return jsonify(result)


@app.route("/api/admin_login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    con = sqlite3.connect(DB_PATH)
    admin = con.execute("SELECT * FROM admins WHERE username=? AND password=?", (username, password)).fetchone()
    con.close()
    
    if admin:
        session["admin_logged_in"] = True
        return jsonify({"success": True})
    return jsonify({"error": "Invalid username or password"}), 401

@app.route("/api/admin_logout", methods=["POST"])
def admin_logout():
    session.pop("admin_logged_in", None)
    return jsonify({"success": True})

@app.route("/add_student", methods=["POST"])
def add_student():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("INSERT INTO students (id, name, branch, cgpa, hostel, room, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (data['id'], data['name'], data['branch'], data['cgpa'], data['hostel'], data['room'], data['phone']))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Student added successfully!"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Student ID already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_attendance", methods=["POST"])
def add_attendance():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("INSERT INTO attendance (student_id, subject, percentage) VALUES (?, ?, ?)",
                    (data['student_id'], data['subject'], data['percentage']))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Attendance recorded successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_notice", methods=["POST"])
def add_notice():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("INSERT INTO notices (title, category, date, urgency) VALUES (?, ?, ?, ?)",
                    (data['title'], data['category'], data['date'], data['urgency']))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Notice published successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_assignment", methods=["POST"])
def add_assignment():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("INSERT INTO assignments (student_id, subject, title, due_date) VALUES (?, ?, ?, ?)",
                    (data['student_id'], data['subject'], data['title'], data['due_date']))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Assignment created successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/get_student_full", methods=["GET"])
def get_student_full():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    
    student_id = request.args.get("id")
    if not student_id: return jsonify({"error": "Missing student ID"}), 400
        
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    
    student = cur.execute("SELECT * FROM students WHERE id=?", (student_id,)).fetchone()
    if not student:
        con.close()
        return jsonify({"error": "Student not found"}), 404
        
    attendance = cur.execute("SELECT id, subject, percentage FROM attendance WHERE student_id=?", (student_id,)).fetchall()
    assignments = cur.execute("SELECT id, subject, title, due_date FROM assignments WHERE student_id=?", (student_id,)).fetchall()
    con.close()
    
    return jsonify({
        "student": dict(student),
        "attendance": [dict(a) for a in attendance],
        "assignments": [dict(a) for a in assignments]
    })

@app.route("/api/update_student", methods=["POST"])
def update_student():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("""
            UPDATE students 
            SET name=?, branch=?, cgpa=?, hostel=?, room=?, phone=? 
            WHERE id=?
        """, (data['name'], data['branch'], data['cgpa'], data['hostel'], data['room'], data['phone'], data['id']))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Student profile updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/delete_record", methods=["POST"])
def delete_record():
    if not session.get("admin_logged_in"): return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    table = data.get('table')
    record_id = data.get('id')
    
    if table not in ['attendance', 'assignments']: return jsonify({"error": "Invalid table"}), 400
        
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute(f"DELETE FROM {table} WHERE id=?", (record_id,))
        con.commit()
        con.close()
        return jsonify({"success": True, "message": "Record deleted!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return redirect("/index.html")

@app.route("/admin")
def admin_redirect():
    return redirect("/admin.html")

@app.route("/<path:filename>")
def serve_static(filename):
    if filename == "admin.html" and not session.get("admin_logged_in"):
        return redirect("/admin_login.html")
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)

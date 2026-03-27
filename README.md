# GehuConnect — DAA Project (Phase 2)

> A student portal for **Graphic Era Hill University (GEHU)** that demonstrates core **Data Structures & Algorithms** concepts through real-world academic modules.

---

## 👥 Team Members

| Member | Roll No | Module | DSA Concept |
|---|---|---|---|
| Maitri Goyal *(Lead)* | 2418628 | Login & Authentication | HashMap (`unordered_map`) |
| Mohit Chandra Purohit | 2419260 | Attendance Tracker | Merge Sort |
| Manisha Bisht | 2419475 | Assignments | Min Heap |
| Shyamali Bisht | 2418996 | Notices | Trie |

---

## 🗂️ Project Structure

```
GehuConnect--DAA-/
├── app.py                          # Flask server (SQLite + C++ integration)
├── gehuconnect.db                  # SQLite database (auto-created on first run)
├── .gitignore
├── Frontend/
│   └── HTML/
│       ├── index.html              # Login page
│       ├── student_dashboard.html  # Main dashboard
│       ├── attendance.html         # Attendance tracker
│       ├── assignments.html        # Assignments viewer
│       └── notices.html            # Notices board
└── Backend/                        # C++ modules (DSA logic)
    ├── login.cpp
    ├── attendance.cpp
    ├── assignments.cpp
    └── notices.cpp
```

---

## ✅ Phase 2 Deliverables

### 🔧 Backend — Flask + SQLite
- **`app.py`** — Minimal Flask server with 4 REST API routes
- **SQLite database** (`gehuconnect.db`) auto-created on startup with seeded data
- Each route queries SQLite → writes to `input.txt` → compiles & runs the `.cpp` via `g++` → captures JSON stdout → returns to frontend
- Routes:
  - `GET /login?id=STUDENTID`
  - `GET /attendance?id=STUDENTID`
  - `GET /notices?category=all`
  - `GET /assignments?id=STUDENTID`

### 🖥️ Frontend — 5 HTML Pages
| Page | What it shows |
|---|---|
| `index.html` | Student ID login form |
| `student_dashboard.html` | Name, ID, Branch, CGPA, Hostel, Room, Phone |
| `attendance.html` | Subject-wise attendance % with ⚠ WARNING if < 75% |
| `notices.html` | Notice board with category dropdown filter |
| `assignments.html` | Assignments sorted by nearest due date, first row highlighted |

### ⚙️ C++ Backend Modules (DSA)
| File | Member | DSA | Working Part |
|---|---|---|---|
| `login.cpp` | Maitri | HashMap (`unordered_map`) | O(1) lookup — reads input, prints student JSON |
| `attendance.cpp` | Mohit | Merge Sort | Bubble sort works; `mergeSort()` structure present |
| `notices.cpp` | Shyamali | Trie | Linear filter works; `insert()` complete |
| `assignments.cpp` | Manisha | Min Heap | Date sort works; `heapify()` complete |

---

## 🔲 Phase 3 Pending

### DSA Completions
| File | Pending |
|---|---|
| `login.cpp` | `validateSession()` — session/token logic |
| `attendance.cpp` | `mergeSort()` — recursive calls + `merge()` connection missing; `predictClasses()` return statement missing |
| `notices.cpp` | `Trie::search()` — only 2 lines written, full traversal missing |
| `assignments.cpp` | `MinHeap::insert()` — bubble-up loop missing |

### Feature Additions
- Replace `inputed.txt` pipeline with direct C++ ↔ Python integration (or full Python backend)
- User authentication with session tokens
- Add/Edit student records from the dashboard
- Club module (`clubs.html`) integration
- Mobile-responsive UI

---

## 🚀 How to Run

### Prerequisites
- Python 3.x
- `g++` compiler
- `pip install flask flask-cors`

### Start the Server
```bash
cd GehuConnect--DAA-
python app.py
```
Then open: **http://localhost:5000**

### Demo Login IDs
| Name | Roll No (= Password) |
|---|---|
| Mohit Purohit | `2419260` |
| Maitri Goyal | `2418628` |
| Manisha Bisht | `2419475` |
| Shyamali Bisht | `2418996` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Backend API | Python 3 — Flask, Flask-CORS |
| Database | SQLite (`sqlite3` built-in, auto-created) |
| DSA Logic | C++17 (STL) — compiled at runtime via `g++` |

---

## 📌 Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Done | Project structure, Login UI, basic routing |
| Phase 2 | ✅ Done | Flask + SQLite backend, 4 CPP DSA modules, 5 live HTML pages |
| Phase 3 | 🔲 Planned | Complete DSA stubs, session auth, dynamic data, clubs module |

---

## 📄 License

This project is developed for academic purposes under the Design & Analysis of Algorithms (DAA) course at **Graphic Era Hill University, Dehradun**.

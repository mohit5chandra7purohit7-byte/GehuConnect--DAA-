# GehuConnect — DAA Project (Phase 2)

> A student portal for **Graphic Era Hill University (GEHU)** that demonstrates core **Data Structures & Algorithms** concepts through real-world academic modules.

---

## 👥 Team Members

| Member | Roll No | Module | DSA Concept |
|---|---|---|---|
| Maitri Goyal *(Lead)* | 2418628 | Login & Authentication | HashMap (`unordered_map`) |
| Mohit Chandra Purohit | 2419260 | Attendance Tracker | Merge Sort |
| Manisha Bisht | 2419475 | Assignments & Exams | Min Heap + Linked List |
| Shyamali Bisht | 2418996 | Notices | Trie + Stack (LIFO) |

---

## 🗂️ Project Structure

```
GehuConnect--DAA-/
├── Frontend/
│   ├── HTML/
│   │   ├── index.html              # Login page
│   │   ├── student_dashboard.html  # Main dashboard
│   │   ├── attendance.html
│   │   ├── assignments.html
│   │   ├── notices.html
│   │   └── clubs.html
│   ├── CSS/
│   │   ├── Style.css               # Login styles
│   │   ├── dashboard.css
│   │   ├── attendance.css
│   │   ├── assignments.css
│   │   └── notices.css
│   └── JavaScript/
│       ├── Script.js               # Login logic
│       ├── dashboard.js
│       ├── attendance.js
│       ├── assignments.js
│       ├── notices.js
│       └── clubs.js
├── Backend/                        # C++ console demos (DSA concepts)
│   ├── login.cpp / login.exe
│   ├── attendance.cpp / attendance.exe
│   ├── assignments.cpp / assignments.exe
│   └── notices.cpp / notices.exe
└── Data/
    └── attendance.txt              # Sample attendance data
```

---

## 📦 Modules & DSA Concepts

### 🔐 Login — Maitri Goyal
- **DSA:** `HashMap` (`unordered_map<rollNo, Student>`)
- **O(1)** average-case lookup by Roll Number
- Stores complete student profile; supports File I/O (saves session to `.txt`)
- **C++ Concepts:** Class, Constructor/Destructor, File I/O

### 📊 Attendance — Mohit Chandra Purohit
- **DSA:** `Merge Sort` — sorts subjects by attendance percentage
- Low-attendance subjects (< 75%) flagged with ⚠ warning
- Built-in **Recovery Predictor** — calculates how many consecutive classes are needed to reach 75%
- **C++ Concepts:** Struct, Operator Overloading, Vectors, Functions

### 📋 Assignments & Exams — Manisha Bisht
- **DSA 1:** `Min Heap` — pending assignments sorted by nearest deadline (`O(log n)` insert/extract)
- **DSA 2:** `Singly Linked List` — submission history (`O(1)` prepend, newest first)
- **C++ Concepts:** Inheritance (`AcademicItem` → `Assignment`, `Exam`), Virtual Functions, Templates, Polymorphism

### 📢 Notices — Shyamali Bisht
- **DSA 1:** `Trie` — prefix-based full-text search over notice titles, categories, and content (`O(L)`)
- **DSA 2:** `Stack (LIFO)` — tracks up to 5 recently viewed notices
- **C++ Concepts:** Struct/Class, String tokenization, `unordered_map` for Trie children

---

## 🚀 Getting Started

### Frontend (Browser)
Just open any HTML file directly in a browser — no server required.

```bash
# Start from the login page
Frontend/HTML/index.html
```

### Backend (C++ Console Demos)

**Prerequisites:** A C++ compiler (`g++`)

```bash
# Compile any module
g++ Backend/login.cpp       -o Backend/login
g++ Backend/attendance.cpp  -o Backend/attendance
g++ Backend/assignments.cpp -o Backend/assignments
g++ Backend/notices.cpp     -o Backend/notices

# Run (Linux / Git Bash)
./Backend/login
./Backend/attendance
./Backend/assignments
./Backend/notices

# Run (Windows CMD)
Backend\login.exe
Backend\attendance.exe
Backend\assignments.exe
Backend\notices.exe
```

---

## 🔑 Demo Credentials

| Roll No | Password |
|---------|----------|
| 2418628 | 2418628  |
| 2419260 | 2419260  |
| 2419475 | 2419475  |
| 2418996 | 2418996  |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend (DSA Demo) | C++17 (STL) |
| Data | Flat text files (`.txt`) |

---

## 📌 Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Done | Project structure, Login UI, basic routing |
| Phase 2 | ✅ Done | All student modules with hardcoded data + DSA backends |
| Phase 3 | 🔲 Planned | Database integration, dynamic data, backend API |

---

## 📄 License

This project is developed for academic purposes under the Design & Analysis of Algorithms (DAA) course at **Graphic Era Hill University, Dehradun**.

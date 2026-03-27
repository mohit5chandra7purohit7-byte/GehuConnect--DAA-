// ============================================================
//  assignments.cpp  — Manisha's Module (Phase 2)
//  DSA Concepts:
//    • Min Heap     — nearest deadline always on top  O(log n)
//    • Linked List  — submission history, prepend O(1)
//  C++ Concepts:
//    • Inheritance  — AcademicItem (base) → Assignment, Exam
//    • Virtual Functions / Operator Overloading
//
//  HOW TO RUN:
//    g++ assignments.cpp -o assignments
//    ./assignments          (Linux / Git-Bash)
//    assignments.exe        (Windows CMD)
// ============================================================

#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;

// ============================================================
//  BASE CLASS — AcademicItem (Abstract)
//  Both Assignment and Exam inherit from this
// ============================================================
class AcademicItem {
public:
    string code;
    string subject;
    string dueDate;    // YYYY-MM-DD (used for comparison in Min Heap)
    string title;

    AcademicItem() {}
    AcademicItem(string c, string subj, string date, string t)
        : code(c), subject(subj), dueDate(date), title(t) {}

    virtual ~AcademicItem() {}

    // Pure virtual — subclasses define their own display format
    virtual void display() const = 0;

    // For Min Heap: compare by dueDate string (YYYY-MM-DD sorts lexicographically)
    bool operator>(const AcademicItem& other) const {
        return dueDate > other.dueDate;
    }
    bool operator<(const AcademicItem& other) const {
        return dueDate < other.dueDate;
    }
};

// ============================================================
//  SUBCLASS — Assignment  (inherits AcademicItem)
// ============================================================
class Assignment : public AcademicItem {
public:
    int    marks;
    string status;    // "pending" | "submitted"

    Assignment() {}
    Assignment(string code, string subj, string date, string title,
               int marks, string status)
        : AcademicItem(code, subj, date, title),
          marks(marks), status(status) {}

    // Override virtual display
    void display() const override {
        string icon = (status == "submitted") ? "[SUBMITTED]" : "[PENDING  ]";
        cout << "  " << left
             << setw(13) << icon
             << setw(9)  << code
             << setw(36) << title
             << "Due: " << dueDate
             << "   Marks: " << marks << "\n";
    }
};

// ============================================================
//  SUBCLASS — Exam  (inherits AcademicItem)
// ============================================================
class Exam : public AcademicItem {
public:
    string time;
    string room;
    string type;

    Exam() {}
    Exam(string code, string subj, string date,
         string time, string room, string type)
        : AcademicItem(code, subj, date, "[EXAM] " + subj),
          time(time), room(room), type(type) {}

    // Override virtual display
    void display() const override {
        cout << "  " << left
             << setw(13) << "[EXAM     ]"
             << setw(9)  << code
             << setw(36) << subject
             << "Date: " << dueDate
             << "   " << time
             << "   Room: " << room << "\n";
    }
};

// ============================================================
//  MIN HEAP — Template, sorts AcademicItem* by dueDate ASC
//  Nearest deadline = top of heap = index 0
// ============================================================
template <typename T>
class MinHeap {
private:
    vector<T*> heap;

    int parent(int i) { return (i - 1) / 2; }
    int left(int i)   { return 2 * i + 1; }
    int right(int i)  { return 2 * i + 2; }

    void heapifyUp(int i) {
        while (i > 0 && heap[i]->dueDate < heap[parent(i)]->dueDate) {
            swap(heap[i], heap[parent(i)]);
            i = parent(i);
        }
    }

    void heapifyDown(int i) {
        int n = heap.size();
        int smallest = i;
        if (left(i)  < n && heap[left(i)]->dueDate  < heap[smallest]->dueDate) smallest = left(i);
        if (right(i) < n && heap[right(i)]->dueDate < heap[smallest]->dueDate) smallest = right(i);
        if (smallest != i) {
            swap(heap[i], heap[smallest]);
            heapifyDown(smallest);
        }
    }

public:
    MinHeap() {}

    // Insert: O(log n)
    void insert(T* item) {
        heap.push_back(item);
        heapifyUp(heap.size() - 1);
    }

    // Extract minimum (nearest deadline): O(log n)
    T* extractMin() {
        if (heap.empty()) return nullptr;
        T* min_item = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) heapifyDown(0);
        return min_item;
    }

    T* peekMin() const { return heap.empty() ? nullptr : heap[0]; }

    bool empty() const { return heap.empty(); }
    int  size()  const { return (int)heap.size(); }

    // Display heap array structure (for demo)
    void printHeapArray() const {
        cout << "  Heap array (index 0 = min): [";
        for (int i = 0; i < (int)heap.size(); i++) {
            if (i) cout << ", ";
            cout << heap[i]->dueDate.substr(5);  // print MM-DD only
        }
        cout << "]\n";
    }
};

// ============================================================
//  LINKED LIST — Singly Linked, Submission History
//  prepend() = O(1), newest submission at head
// ============================================================
struct ListNode {
    string title;
    string code;
    string submittedOn;
    string grade;
    ListNode* next;

    ListNode(string t, string c, string d, string g)
        : title(t), code(c), submittedOn(d), grade(g), next(nullptr) {}
};

class SubmissionList {
private:
    ListNode* head;
    int count;

public:
    SubmissionList() : head(nullptr), count(0) {}

    ~SubmissionList() {
        ListNode* curr = head;
        while (curr) {
            ListNode* tmp = curr->next;
            delete curr;
            curr = tmp;
        }
    }

    // Prepend — O(1) insert at head (most recent first)
    void prepend(string title, string code, string date, string grade) {
        ListNode* node = new ListNode(title, code, date, grade);
        node->next = head;   // new node points to old head
        head = node;         // head now = new node
        count++;
    }

    // Traverse and print — O(n)
    void display() const {
        cout << "\n  [Linked List — Submission History]\n";
        cout << "  head → ";
        ListNode* curr = head;
        int i = 1;
        while (curr) {
            string grade_col = (curr->grade == "Pending") ? "(Pending)" : "Grade: " + curr->grade;
            cout << "\n  [" << i++ << "] "
                 << left << setw(9)  << curr->code
                 << setw(32) << curr->title
                 << curr->submittedOn
                 << "  " << grade_col;
            if (curr->next) cout << "\n       ↓";
            curr = curr->next;
        }
        cout << "\n  └─ null\n";
        cout << "  Total: " << count << " submissions\n";
    }
};

// ============================================================
//  HARDCODED DATA — same as assignments.js
// ============================================================
int main() {
    cout << "========================================\n";
    cout << "   GEHU Connect — Assignments Module    \n";
    cout << "   Member  : Manisha Bisht              \n";
    cout << "   DSA     : Min Heap + Linked List     \n";
    cout << "   C++     : Inheritance + Virtual Fn   \n";
    cout << "========================================\n\n";

    // ---- HARDCODED ASSIGNMENTS ----
    vector<Assignment*> raw = {
        new Assignment("CSE401", "DAA",  "2026-03-28", "Merge Sort Visualizer",      20, "pending"),
        new Assignment("CSE402", "OS",   "2026-03-30", "Round Robin Scheduler",       15, "submitted"),
        new Assignment("CSE403", "DBMS", "2026-04-01", "Hospital ER Diagram",         20, "pending"),
        new Assignment("CSE404", "CN",   "2026-04-03", "IP Subnetting Worksheet",     10, "pending"),
        new Assignment("CSE405", "SE",   "2026-04-05", "Use Case Diagram",            20, "pending"),
        new Assignment("CSE406", "Web",  "2026-04-07", "Responsive Portfolio",        25, "submitted"),
    };

    // ---- HARDCODED EXAMS ----
    vector<Exam*> exams = {
        new Exam("CSE401", "Design & Analysis of Algorithms", "2026-04-05", "10:00 AM", "LT-101",  "Mid Semester"),
        new Exam("CSE402", "Operating Systems",               "2026-04-07", "10:00 AM", "LT-102",  "Mid Semester"),
        new Exam("CSE403", "Database Management Systems",     "2026-04-09", "02:00 PM", "LT-103",  "Mid Semester"),
        new Exam("CSE404", "Computer Networks",               "2026-04-11", "10:00 AM", "LT-101",  "Mid Semester"),
        new Exam("CSE405", "Software Engineering",            "2026-04-13", "02:00 PM", "LT-104",  "Mid Semester"),
        new Exam("CSE406", "Web Technology Lab",              "2026-04-15", "10:00 AM", "Lab-201", "Practical"),
    };

    // ---- BUILD MIN HEAP for pending assignments ----
    MinHeap<Assignment> heap;
    for (Assignment* a : raw)
        if (a->status == "pending") heap.insert(a);

    cout << "📋  PENDING ASSIGNMENTS — Min Heap (nearest deadline first)\n";
    cout << string(68, '-') << "\n";
    cout << left
         << setw(13) << "Status"
         << setw(9)  << "Code"
         << setw(36) << "Title"
         << "Due Date   Marks\n";
    cout << string(68, '-') << "\n";

    heap.printHeapArray();
    cout << "\n";

    // Extract all in sorted (deadline) order
    MinHeap<Assignment> copy = heap;  // make a copy to preserve original
    while (!copy.empty())
        copy.extractMin()->display();

    // Show submitted at end
    for (Assignment* a : raw)
        if (a->status == "submitted") a->display();

    // ---- BUILD MIN HEAP for exams ----
    cout << "\n📅  EXAM SCHEDULE — Min Heap (nearest exam first)\n";
    cout << string(68, '-') << "\n";

    MinHeap<Exam> examHeap;
    for (Exam* e : exams) examHeap.insert(e);

    examHeap.printHeapArray();
    cout << "\n";
    while (!examHeap.empty())
        examHeap.extractMin()->display();

    // ---- LINKED LIST — Submission History ----
    SubmissionList history;
    // Prepend old → new, so newest lands at head
    history.prepend("Binary Search Tree Implementation", "CSE301", "2026-03-10", "A");
    history.prepend("SQL Query Practice Sheet",          "CSE303", "2026-03-15", "A+");
    history.prepend("Responsive Portfolio",              "CSE406", "2026-03-22", "A");
    history.prepend("Round Robin Scheduler",             "CSE402", "2026-03-25", "Pending");

    history.display();

    // ---- Inheritance demo: treat both via base pointer ----
    cout << "\n-- Polymorphism demo (AcademicItem* base pointer) --\n";
    vector<AcademicItem*> all;
    all.push_back(raw[0]);   // Assignment (pending)
    all.push_back(exams[0]); // Exam
    for (AcademicItem* item : all)
        item->display();   // virtual dispatch

    // Cleanup
    for (auto p : raw)   delete p;
    for (auto p : exams) delete p;

    return 0;
}

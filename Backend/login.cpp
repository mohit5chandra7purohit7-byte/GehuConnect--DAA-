// ============================================================
//  login.cpp  — Maitri's Module (Phase 2)
//  DSA Concept : HashMap (unordered_map)
//               student Roll No → Student object, O(1) lookup
//  C++ Concepts: Class, Constructor, Destructor, File I/O
//
//  HOW TO RUN:
//    g++ login.cpp -o login
//    ./login          (Linux / Git-Bash)
//    login.exe        (Windows CMD)
// ============================================================

#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
#include <iomanip>
#include <fstream>
using namespace std;

// ============================================================
//  CLASS — Student  (encapsulates one student's data)
// ============================================================
class Student {
public:
    string rollNo;
    string fullName;
    string email;
    string password;
    int    semester;
    string section;
    string enrollNo;
    string fatherName;
    string motherName;
    string dob;

    // Default constructor
    Student() : semester(0) {}

    // Parameterized constructor
    Student(string roll, string name, string mail, string pwd,
            int sem, string sec, string enroll,
            string father, string mother, string dateOfBirth)
        : rollNo(roll), fullName(name), email(mail), password(pwd),
          semester(sem), section(sec), enrollNo(enroll),
          fatherName(father), motherName(mother), dob(dateOfBirth) {
        // Constructor called when a student is created
    }

    // Destructor
    ~Student() {
        // Destructor — would free dynamic memory in a larger system
    }

    // Display student profile card
    void display() const {
        cout << "\n  +------------------------------------------+\n";
        cout << "  |           STUDENT PROFILE               |\n";
        cout << "  +------------------------------------------+\n";
        cout << left;
        cout << "  " << setw(18) << "Name:"       << fullName   << "\n";
        cout << "  " << setw(18) << "Roll No:"    << rollNo     << "\n";
        cout << "  " << setw(18) << "Email:"      << email      << "\n";
        cout << "  " << setw(18) << "Semester:"   << semester   << "\n";
        cout << "  " << setw(18) << "Section:"    << section    << "\n";
        cout << "  " << setw(18) << "Enroll No:"  << enrollNo   << "\n";
        cout << "  " << setw(18) << "Father:"     << fatherName << "\n";
        cout << "  " << setw(18) << "Mother:"     << motherName << "\n";
        cout << "  " << setw(18) << "DOB:"        << dob        << "\n";
        cout << "  +------------------------------------------+\n";
    }

    // Save profile to a text file (File I/O demo)
    void saveToFile(const string& filename) const {
        ofstream file(filename);
        if (!file.is_open()) {
            cerr << "  [Error] Could not open file: " << filename << "\n";
            return;
        }
        file << "ROLL="    << rollNo     << "\n";
        file << "NAME="    << fullName   << "\n";
        file << "EMAIL="   << email      << "\n";
        file << "SEM="     << semester   << "\n";
        file << "SECTION=" << section    << "\n";
        file << "ENROLL="  << enrollNo   << "\n";
        file << "FATHER="  << fatherName << "\n";
        file << "MOTHER="  << motherName << "\n";
        file << "DOB="     << dob        << "\n";
        file.close();
        cout << "  [File I/O] Profile saved → " << filename << "\n";
    }
};

// ============================================================
//  StudentDB — wraps unordered_map<rollNo, Student>
//  unordered_map = HashMap in C++ STL
//  Average O(1) for insert and find
// ============================================================
class StudentDB {
private:
    unordered_map<string, Student> table;   // THE HASHMAP

public:
    // Constructor — loads all students into the HashMap
    StudentDB() {
        load();
        cout << "[HashMap] " << table.size() << " students loaded.\n";
    }

    // Load hardcoded data into HashMap
    // Phase 3: replace with DB read
    void load() {
        Student students[] = {
            {"2419260", "MOHIT CHANDRA PUROHIT", "2419260@gehu.ac.in", "2419260",
             4, "CS1", "PV-24190260", "BUDHI PRASAD PUROHIT", "LAXMI DEVI", "21/12/2006"},
            {"2418628", "MAITRI GOYAL",           "2418628@gehu.ac.in", "2418628",
             4, "CS1", "PV-24186280", "RAMESH GOYAL",         "SUNITA GOYAL",  "15/08/2006"},
            {"2419475", "MANISHA BISHT",           "2419475@gehu.ac.in", "2419475",
             4, "CS1", "PV-24194750", "MAHESH BISHT",         "GEETA BISHT",   "03/04/2006"},
            {"2418996", "SHYAMALI BISHT",          "2418996@gehu.ac.in", "2418996",
             4, "CS1", "PV-24189960", "MOHAN BISHT",          "KAMLA BISHT",   "11/11/2006"}
        };
        for (auto& s : students)
            table[s.rollNo] = s;   // HashMap insert: O(1)
    }

    // login() — O(1) average HashMap lookup
    bool login(const string& roll, const string& pwd, Student& out) {
        auto it = table.find(roll);   // O(1) hash lookup — the DSA concept
        if (it == table.end()) return false;
        if (it->second.password != pwd) return false;
        out = it->second;
        return true;
    }

    // Print all entries in the HashMap
    void printMap() const {
        cout << "\n  HashMap contents (" << table.size() << " buckets active):\n";
        cout << "  " << string(50, '-') << "\n";
        cout << "  " << left << setw(12) << "Key (Roll)" << " → " << "Value (Name)\n";
        cout << "  " << string(50, '-') << "\n";
        for (auto it = table.begin(); it != table.end(); ++it)
            cout << "  " << setw(12) << it->first << " → " << it->second.fullName << "\n";
        cout << "  " << string(50, '-') << "\n";
    }

    ~StudentDB() {
        // unordered_map auto-destructs its elements
    }
};

// ============================================================
//  MAIN — Demo login, HashMap display, File I/O
// ============================================================
int main() {
    cout << "========================================\n";
    cout << "   GEHU Connect — Login Module          \n";
    cout << "   Member  : Maitri Goyal (Lead)        \n";
    cout << "   DSA     : HashMap (unordered_map)    \n";
    cout << "   Lookup  : O(1) average               \n";
    cout << "========================================\n\n";

    StudentDB db;

    // Display HashMap
    db.printMap();

    // Test cases
    struct Test { string roll, pwd; };
    vector<Test> tests = {
        {"2418628", "2418628"},   // Maitri  — correct
        {"2419260", "2419260"},   // Mohit   — correct
        {"2419475", "2419475"},   // Manisha — correct
        {"2418996", "2418996"},   // Shyamali — correct
        {"2419260", "wrongpass"}, // Wrong password
        {"9999999", "9999999"},   // Not in HashMap
    };

    cout << "\n--- LOGIN DEMO (O(1) HashMap lookup) ---\n";
    for (const Test& t : tests) {
        cout << "\nRoll: " << t.roll << "  |  Password: " << t.pwd << "\n";
        Student s;
        if (db.login(t.roll, t.pwd, s)) {
            cout << "  ✅  LOGIN SUCCESS\n";
            s.display();
            // Demonstrate File I/O
            s.saveToFile("Data/session_" + s.rollNo + ".txt");
        } else {
            cout << "  ❌  LOGIN FAILED — Invalid roll number or password\n";
        }
    }

    return 0;
}

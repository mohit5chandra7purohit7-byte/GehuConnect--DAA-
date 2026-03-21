// ============================================================
//  attendance.cpp  — Mohit's Module (Phase 2)
//  DSA Concept  : Merge Sort (sort subjects by attendance %)
//  C++ Concepts : Vectors, Structs, Functions, Operator Overload
//
//  HOW TO RUN:
//    g++ attendance.cpp -o attendance
//    ./attendance          (Linux / Git-Bash)
//    attendance.exe        (Windows CMD)
// ============================================================

#include <iostream>
#include <vector>
#include <string>
#include <iomanip>   // for setw / setprecision

using namespace std;

// ============================================================
//  STRUCT  — Holds one subject's attendance data
// ============================================================
struct Subject {
    string name;       // Subject name
    string code;       // Subject code  e.g. CSE401
    int    total;      // Total classes held
    int    attended;   // Classes the student attended
    double percentage; // Attendance percentage (calculated)

    // Calculate percentage — called once after data is loaded
    void calcPercentage() {
        percentage = (total > 0)
                     ? (static_cast<double>(attended) / total) * 100.0
                     : 0.0;
    }

    // Operator overload: < lets us compare two subjects by percentage
    // (This is the C++ Operator Overloading concept from the project table)
    bool operator<(const Subject& other) const {
        return this->percentage < other.percentage;
    }
};

// ============================================================
//  MERGE SORT — merge two sorted halves back together
// ============================================================
void merge(vector<Subject>& arr, int left, int mid, int right) {
    // Sizes of the two sub-arrays
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Temporary vectors
    vector<Subject> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;

    // Merge: pick the smaller element (lowest attendance first)
    while (i < n1 && j < n2) {
        if (L[i] < R[j]) {   // uses our overloaded operator
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }

    // Copy remaining elements
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

// ============================================================
//  MERGE SORT — recursively split, then merge
// ============================================================
void mergeSort(vector<Subject>& arr, int left, int right) {
    if (left >= right) return;          // Base case: single element

    int mid = left + (right - left) / 2;

    mergeSort(arr, left, mid);          // Sort left half
    mergeSort(arr, mid + 1, right);     // Sort right half
    merge(arr, left, mid, right);       // Merge the two halves
}

// ============================================================
//  DISPLAY — Print the attendance table nicely
// ============================================================
void displayAttendance(const vector<Subject>& subjects, const string& label) {
    cout << "\n" << label << "\n";
    cout << string(65, '-') << "\n";
    cout << left
         << setw(32) << "Subject"
         << setw(10) << "Code"
         << setw(10) << "Attended"
         << setw(8)  << "Total"
         << "  %\n";
    cout << string(65, '-') << "\n";

    for (const Subject& s : subjects) {
        string flag = (s.percentage < 75.0) ? " ⚠ LOW" : "";
        cout << left
             << setw(32) << s.name
             << setw(10) << s.code
             << setw(10) << s.attended
             << setw(8)  << s.total
             << fixed << setprecision(1) << s.percentage << "%"
             << flag << "\n";
    }
    cout << string(65, '-') << "\n";
}

// ============================================================
//  ATTENDANCE PREDICTOR
//  Calculates: how many more classes needed to reach 75%
// ============================================================
void predictRecovery(const vector<Subject>& subjects) {
    cout << "\n📈  RECOVERY PREDICTOR (to reach 75%)\n";
    cout << string(50, '-') << "\n";

    bool anyLow = false;
    for (const Subject& s : subjects) {
        if (s.percentage < 75.0) {
            anyLow = true;
            // Formula: let x = extra classes needed
            // (attended + x) / (total + x) >= 0.75
            // attended + x >= 0.75 * (total + x)
            // attended + x >= 0.75*total + 0.75x
            // 0.25x >= 0.75*total - attended
            // x >= (0.75*total - attended) / 0.25
            int x = 0;
            while (((s.attended + x) * 100.0) / (s.total + x) < 75.0) {
                x++;
            }
            cout << "  " << s.name << "  →  attend " << x
                 << " more consecutive class(es)\n";
        }
    }
    if (!anyLow) {
        cout << "  ✅  All subjects are above 75%. Great work!\n";
    }
    cout << string(50, '-') << "\n";
}

// ============================================================
//  MAIN — Hardcoded dummy data for Mohit (Roll: 2419260)
// ============================================================
int main() {
    cout << "======================================\n";
    cout << "   GEHU Connect — Attendance Module   \n";
    cout << "   Student : Mohit Purohit            \n";
    cout << "   Roll No : 2419260                  \n";
    cout << "   DSA     : Merge Sort               \n";
    cout << "======================================\n";

    // ---- HARDCODED DUMMY DATA ----
    // (In a real system this would be read from a database / file)
    vector<Subject> subjects = {
        {"Design & Analysis of Algorithms", "CSE401", 40, 35, 0},
        {"Operating Systems",               "CSE402", 38, 28, 0},  // <75% intentional
        {"Database Management Systems",     "CSE403", 42, 38, 0},
        {"Computer Networks",               "CSE404", 40, 29, 0},  // <75% intentional
        {"Software Engineering",            "CSE405", 36, 36, 0},
        {"Web Technology Lab",              "CSE406", 30, 20, 0}   // <75% intentional
    };

    // Calculate percentages for each subject
    for (Subject& s : subjects) {
        s.calcPercentage();
    }

    // Show BEFORE sorting
    displayAttendance(subjects, "BEFORE Merge Sort  (original order):");

    // ---- RUN MERGE SORT ----
    mergeSort(subjects, 0, static_cast<int>(subjects.size()) - 1);

    // Show AFTER sorting  (lowest attendance first — critical subjects on top)
    displayAttendance(subjects, "AFTER  Merge Sort  (sorted: lowest % first):");

    // Show recovery predictor
    predictRecovery(subjects);

    // Overall summary
    double total = 0;
    for (const Subject& s : subjects) total += s.percentage;
    cout << "\n📊  Overall Average Attendance: "
         << fixed << setprecision(1) << (total / subjects.size()) << "%\n\n";

    return 0;
}

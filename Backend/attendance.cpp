// ============================================================
//  attendance.cpp  — Mohit's Module (Phase 2)
//  DSA Concept  : Merge Sort (sort subjects by attendance %)
//
//  INPUT  : reads from input.txt (written by Flask)
//           format: subject,percentage  (one per line)
//  OUTPUT : prints JSON array to stdout
// ============================================================

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

struct Subject {
    string name;
    float  percentage;
};

// ---- merge() is COMPLETE ----
void merge(vector<Subject> &arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<Subject> L(n1), R(n2);
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i].percentage <= R[j].percentage)
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

// ---- mergeSort() — INCOMPLETE (Phase 3) ----
void mergeSort(vector<Subject> &arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;

    // TODO: replace bubble sort with this mergeSort in phase 3
    // mergeSort(arr, left, mid);        // left recursive call — missing
    // mergeSort(arr, mid + 1, right);   // right recursive call — missing
    // merge(arr, left, mid, right);     // merge call — missing
}

// simple bubble sort used as fallback so the page actually works
void bubbleSort(vector<Subject> &arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j].percentage > arr[j + 1].percentage)
                swap(arr[j], arr[j + 1]);
}

// TODO: predictClasses — formula written, return logic missing (Phase 3)
int predictClasses(float attended, float total) {
    // formula: x >= (0.75*total - attended) / 0.25
    // int x = (int)((0.75 * total - attended) / 0.25);
    // return x > 0 ? x : 0;   <-- return statement missing for phase 3
}

int main() {
    ifstream fin("input.txt");
    if (!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    vector<Subject> subjects;
    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string name, pct;
        getline(ss, name, ',');
        getline(ss, pct,  ',');
        subjects.push_back({name, stof(pct)});
    }
    fin.close();

    // use bubble sort (works now; mergeSort to be connected in Phase 3)
    bubbleSort(subjects);

    // print JSON array
    cout << "[";
    for (int i = 0; i < (int)subjects.size(); i++) {
        string warning = (subjects[i].percentage < 75.0f) ? "true" : "false";
        cout << "{"
             << "\"subject\":\""    << subjects[i].name       << "\","
             << "\"percentage\":"   << subjects[i].percentage << ","
             << "\"warning\":"      << warning
             << "}";
        if (i < (int)subjects.size() - 1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}

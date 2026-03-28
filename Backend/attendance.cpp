#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Subject {
    string name;
    float percentage;
};

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

void mergeSort(vector<Subject> &arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

// Phase 3 pending feature
int predictClasses(float attended, float total) {
    // formula: x >= (0.75*total - attended) / 0.25
    // int x = (int)((0.75 * total - attended) / 0.25);
    // return x > 0 ? x : 0;   <-- return statement missing for phase 3
    return 0;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Missing temp file argument\"}" << endl;
        return 1;
    }
    ifstream fin(argv[1]);
    if (!fin.is_open()) {
        cout << "{\"error\":\"temp file missing\"}" << endl;
        return 1;
    }

    vector<Subject> subjects;
    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string name, pct;
        getline(ss, name, ',');
        getline(ss, pct, ',');
        subjects.push_back({name, stof(pct)});
    }
    fin.close();

    if (!subjects.empty()) {
        mergeSort(subjects, 0, subjects.size() - 1);
    }

    cout << "[";
    for (int i = 0; i < (int)subjects.size(); i++) {
        string warning = (subjects[i].percentage < 75.0f) ? "true" : "false";
        cout << "{"
             << "\"subject\":\"" << subjects[i].name << "\","
             << "\"percentage\":" << subjects[i].percentage << ","
             << "\"warning\":" << warning
             << "}";
        if (i < (int)subjects.size() - 1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}

// ==========================================
// PHASE 3 PENDING:
// 1. predictClasses() is declared with the formula but return logic is missing.
//    Once complete, this will predict how many extra classes a student needs
//    to reach 75% attendance.
// ==========================================

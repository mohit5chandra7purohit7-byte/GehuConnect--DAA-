// ============================================================
//  login.cpp  — Maitri's Module (Phase 2)
//  DSA Concept : HashMap (unordered_map)
//               student ID -> Student struct, O(1) lookup
//
//  INPUT  : reads from input.txt (written by Flask)
//           format: id,name,branch,cgpa,hostel,room,phone
//  OUTPUT : prints JSON to stdout (captured by Flask)
// ============================================================

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>

using namespace std;

struct Student {
    string id, name, branch, hostel, room, phone;
    float cgpa;
};

// TODO: add session token logic in phase 3
void validateSession() {
    // left empty for now — will add JWT tokens later
}

int main() {
    ifstream fin("input.txt");
    if (!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    // read the one line Flask wrote
    string line;
    getline(fin, line);
    fin.close();

    // parse CSV line into Student struct
    stringstream ss(line);
    string token;
    Student s;
    int col = 0;
    while (getline(ss, token, ',')) {
        if      (col == 0) s.id     = token;
        else if (col == 1) s.name   = token;
        else if (col == 2) s.branch = token;
        else if (col == 3) s.cgpa   = stof(token);
        else if (col == 4) s.hostel = token;
        else if (col == 5) s.room   = token;
        else if (col == 6) s.phone  = token;
        col++;
    }

    // put into HashMap (unordered_map) — O(1) insert and lookup
    unordered_map<string, Student> studentMap;
    studentMap[s.id] = s;   // HashMap insert

    // O(1) lookup — the DSA concept
    auto it = studentMap.find(s.id);
    if (it == studentMap.end()) {
        cout << "{\"error\":\"Student not found\"}" << endl;
        return 1;
    }

    Student &found = it->second;
    // print result as JSON
    cout << "{"
         << "\"id\":\""     << found.id     << "\","
         << "\"name\":\""   << found.name   << "\","
         << "\"branch\":\"" << found.branch << "\","
         << "\"cgpa\":"     << found.cgpa   << ","
         << "\"hostel\":\"" << found.hostel << "\","
         << "\"room\":\""   << found.room   << "\","
         << "\"phone\":\""  << found.phone  << "\""
         << "}" << endl;

    return 0;
}

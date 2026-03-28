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

// Phase 3 pending
void validateSession() {
    // missing JWT token validation logic
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\":\"Missing temp file argument\"}" << endl;
        return 1;
    }
    ifstream fin(argv[1]);
    if (!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    string target_id;
    getline(fin, target_id); // first line is target id

    unordered_map<string, Student> studentMap;
    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;
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
        studentMap[s.id] = s;
    }
    fin.close();

    auto it = studentMap.find(target_id);
    if (it == studentMap.end()) {
        cout << "{\"error\":\"Student not found\"}" << endl;
        return 1;
    }

    Student &found = it->second;
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

// ==========================================
// PHASE 3 PENDING:
// 1. validateSession() is declared but empty.
//    Once complete, it will verify JWT tokens before allowing login lookup.
// ==========================================

// ============================================================
//  assignments.cpp  — Manisha's Module (Phase 2)
//  DSA Concept : Min Heap (sort assignments by due date)
//
//  INPUT  : reads from input.txt (written by Flask)
//           format: subject,title,due_date  (one per line)
//  OUTPUT : prints JSON array to stdout
// ============================================================

#include<iostream>
#include<fstream>
#include<sstream>
#include<string>
#include<vector>
#include<algorithm>
using namespace std;

struct Assignment {
    string subject, title, dueDate;
};

// ---- MinHeap Class — INCOMPLETE (Phase 3) ----
class MinHeap {
    vector<Assignment> heap;

    void heapify(int i) {
        int smallest = i;
        int left  = 2 * i + 1;
        int right = 2 * i + 2;
        if(left  < (int)heap.size() && heap[left].dueDate  < heap[smallest].dueDate) smallest = left;
        if(right < (int)heap.size() && heap[right].dueDate < heap[smallest].dueDate) smallest = right;
        if(smallest != i) {
            swap(heap[i], heap[smallest]);
            heapify(smallest);
        }
    }

public:
    void insert(Assignment a) {
        heap.push_back(a);   // push to end — done
        // TODO: finish insert() — bubble-up loop missing, connect in phase 3
        // int i = heap.size() - 1;
        // while (i > 0 && heap[(i-1)/2].dueDate > heap[i].dueDate) { ... }
    }

    Assignment extractMin() {
        Assignment top = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapify(0);
        return top;
    }

    bool empty() { return heap.empty(); }
};

int main() {
    ifstream fin("input.txt");
    if(!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    vector<Assignment> assignments;
    string line;
    while(getline(fin, line)) {
        if(line.empty()) continue;
        stringstream ss(line);
        string sub, title, date;
        getline(ss, sub,   ',');
        getline(ss, title, ',');
        getline(ss, date,  ',');
        assignments.push_back({sub, title, date});
    }
    fin.close();

    // simple string comparison sort by date — works now
    // TODO: replace with MinHeap extraction in phase 3
    sort(assignments.begin(), assignments.end(), [](const Assignment &a, const Assignment &b){
        return a.dueDate < b.dueDate;
    });

    cout << "[";
    for(int i = 0; i < (int)assignments.size(); i++) {
        cout << "{"
             << "\"subject\":\""  << assignments[i].subject  << "\","
             << "\"title\":\""    << assignments[i].title    << "\","
             << "\"due_date\":\"" << assignments[i].dueDate  << "\""
             << "}";
        if(i < (int)assignments.size()-1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}

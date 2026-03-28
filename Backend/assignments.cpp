#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Assignment {
    string subject, title, dueDate;
};

class MinHeap {
    vector<Assignment> heap;

    void heapify(int i) {
        int smallest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < (int)heap.size() && heap[left].dueDate < heap[smallest].dueDate) smallest = left;
        if (right < (int)heap.size() && heap[right].dueDate < heap[smallest].dueDate) smallest = right;
        if (smallest != i) {
            swap(heap[i], heap[smallest]);
            heapify(smallest);
        }
    }

public:
    void insert(Assignment a) {
        heap.push_back(a);
        int i = heap.size() - 1;
        while (i > 0 && heap[(i - 1) / 2].dueDate > heap[i].dueDate) {
            swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }

    Assignment extractMin() {
        Assignment top = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        heapify(0);
        return top;
    }

    bool empty() { return heap.empty(); }

    // Phase 3 pending
    void editDueDate(int index, string newDate) {
        // missing decreaseKey/increaseKey logic and re-heapify
    }
};

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

    MinHeap pq;
    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string sub, title, date;
        getline(ss, sub, ',');
        getline(ss, title, ',');
        getline(ss, date, ',');
        pq.insert({sub, title, date});
    }
    fin.close();

    cout << "[";
    bool first = true;
    while (!pq.empty()) {
        if (!first) cout << ",";
        Assignment a = pq.extractMin();
        cout << "{"
             << "\"subject\":\"" << a.subject << "\","
             << "\"title\":\"" << a.title << "\","
             << "\"due_date\":\"" << a.dueDate << "\""
             << "}";
        first = false;
    }
    cout << "]" << endl;

    return 0;
}

// ==========================================
// PHASE 3 PENDING:
// 1. editDueDate() inside MinHeap is declared but incomplete.
//    Once complete, it will allow updating the due date of an
//    assignment and correctly bubbling it up or down the heap.
// ==========================================

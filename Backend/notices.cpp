// ============================================================
//  notices.cpp  — Shyamali's Module (Phase 2)
//  DSA Concepts:
//    • Trie  — fast prefix-based notice search  O(L)
//    • Stack — recently viewed notices (LIFO)   O(1) push/pop
//  C++ Concepts: Struct/Class, String manipulation
//
//  HOW TO RUN:
//    g++ notices.cpp -o notices
//    ./notices          (Linux / Git-Bash)
//    notices.exe        (Windows CMD)
// ============================================================

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <sstream>
#include <iomanip>
using namespace std;

// ============================================================
//  STRUCT — Notice object
// ============================================================
struct Notice {
    int    id;
    string title;
    string category;
    string date;
    string content;
    bool   highPriority;
};

// ============================================================
//  TRIE — Prefix-based notice search
//  TrieNode holds children map and matched notice IDs
// ============================================================
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    vector<int> ids;   // IDs of notices whose words end here

    TrieNode() {}
    ~TrieNode() {
        for (auto it = children.begin(); it != children.end(); ++it)
            delete it->second;
    }
};

class Trie {
private:
    TrieNode* root;

    string toLower(const string& s) const {
        string r = s;
        transform(r.begin(), r.end(), r.begin(), ::tolower);
        return r;
    }

    void collectIDs(TrieNode* node, vector<int>& result) const {
        for (int id : node->ids)
            result.push_back(id);
        for (auto it = node->children.begin(); it != node->children.end(); ++it)
            collectIDs(it->second, result);
    }

public:
    Trie()  : root(new TrieNode()) {}
    ~Trie() { delete root; }

    // Insert one word, link to notice ID
    void insert(const string& word, int id) {
        TrieNode* node = root;
        for (char ch : toLower(word)) {
            if (!node->children.count(ch))
                node->children[ch] = new TrieNode();
            node = node->children[ch];
        }
        // Avoid duplicate IDs at the same node
        if (find(node->ids.begin(), node->ids.end(), id) == node->ids.end())
            node->ids.push_back(id);
    }

    // Index one notice: tokenize title + category + content
    void indexNotice(const Notice& n) {
        istringstream ss(n.title + " " + n.category + " " + n.content);
        string word;
        while (ss >> word) {
            string clean;
            for (char c : word)
                if (isalpha(c)) clean += tolower(c);
            if (clean.size() > 2)
                insert(clean, n.id);
        }
    }

    // Search prefix → returns all matching notice IDs
    // Time: O(L) where L = prefix length
    vector<int> search(const string& prefix) const {
        if (prefix.empty()) return {};
        TrieNode* node = root;
        for (char ch : toLower(prefix)) {
            if (!node->children.count(ch)) return {};
            node = node->children[ch];
        }
        vector<int> result;
        collectIDs(node, result);
        // Remove duplicates and sort
        sort(result.begin(), result.end());
        result.erase(unique(result.begin(), result.end()), result.end());
        return result;
    }
};

// ============================================================
//  STACK (LIFO) — Recently viewed notices, max 5
//  Implemented using std::vector for simplicity
// ============================================================
class RecentStack {
private:
    vector<int> items;
    int maxSize;

public:
    RecentStack(int max = 5) : maxSize(max) {}

    // Push: remove duplicate first, insert at top, trim if overflow
    // O(n) for remove, O(1) for insert — net O(n) but n ≤ 5
    void push(int id) {
        items.erase(remove(items.begin(), items.end(), id), items.end());
        items.insert(items.begin(), id);
        if ((int)items.size() > maxSize)
            items.pop_back();
    }

    int pop() {
        if (items.empty()) return -1;
        int top = items.front();
        items.erase(items.begin());
        return top;
    }

    int peek() const { return items.empty() ? -1 : items.front(); }

    void display(const vector<Notice>& notices) const {
        cout << "\n  [Stack — Recently Viewed (LIFO), top → bottom]\n";
        cout << "  " << string(55, '-') << "\n";
        if (items.empty()) {
            cout << "  (stack is empty)\n";
        } else {
            for (int i = 0; i < (int)items.size(); i++) {
                auto it = find_if(notices.begin(), notices.end(),
                    [&](const Notice& n) { return n.id == items[i]; });
                if (it != notices.end())
                    cout << "  [" << i + 1 << "] "
                         << "[" << setw(11) << it->category << "]  "
                         << it->title << "\n";
            }
        }
        cout << "  " << string(55, '-') << "\n";
    }

    bool empty() const { return items.empty(); }
    int  size()  const { return items.size(); }
};

// ============================================================
//  HARDCODED NOTICE DATA
//  Same notices as the frontend (notices.js)
// ============================================================
const vector<Notice> NOTICES = {
    {1,  "Mid Semester Examination Schedule — April 2026",
         "Examination", "2026-03-20",
         "Mid-semester exams from 5th April. CSE401 DAA 05-Apr, CSE402 OS 07-Apr, "
         "CSE403 DBMS 09-Apr, CSE404 CN 11-Apr, CSE405 SE 13-Apr.", true},
    {2,  "Technical Fest Technovate 2026 — Registration Open",
         "Event", "2026-03-22",
         "Annual fest on 2nd-3rd April. Coding, robotics, hackathon, paper presentation.", false},
    {3,  "Library Timings Extended for Examination Period",
         "Academic", "2026-03-18",
         "Central library open until 10 PM from 1st April to 20th April.", false},
    {4,  "College Closed — Holi Festival Holiday",
         "Holiday", "2026-03-13",
         "College closed on 14th March on account of Holi.", false},
    {5,  "Fee Payment Deadline — Last Date 31st March 2026",
         "General", "2026-03-15",
         "Fee payment last date without fine is 31st March. Late fine Rs 100 per day.", true},
    {6,  "New Elective Registration — 5th Semester",
         "Academic", "2026-03-17",
         "Electives: Machine Learning, Cyber Security, Cloud Computing, IoT, Blockchain.", false},
    {7,  "Guest Lecture by Dr. A. Kumar — AI & Future of Software",
         "Event", "2026-03-24",
         "Guest lecture on 28th March, 11 AM, Main Auditorium. E-cert for attendees.", false},
    {8,  "Summer Internship Drive — Apply Before 5th April",
         "Academic", "2026-03-23",
         "TCS, Infosys, Wipro, DRDO. Apply at placement.gehu.ac.in. 65 pct+ needed.", false},
    {9,  "Practical Examination Schedule — April 2026",
         "Examination", "2026-03-19",
         "Practical exams: CSE406 Web Lab 1st Apr, CSE Lab-II 2nd Apr. Bring lab records.", true},
    {10, "Annual Cultural Night — Spectrum 2026",
         "Event", "2026-03-21",
         "Cultural night on 29th March, open-air amphitheatre. Dance, singing, skit, comedy.", false},
    {11, "Campus Placement Drive — TCS NextStep 2026",
         "General", "2026-03-25",
         "TCS visiting on 15th April. 60 pct+ aggregate required. Register at NextStep portal.", false},
    {12, "Summer Vacation Schedule 2026",
         "Holiday", "2026-03-26",
         "Summer vacation 16th May to 14th June. Odd semester begins 15th June 2026.", false}
};

// ============================================================
//  HELPER — find notice by ID
// ============================================================
const Notice* findById(int id) {
    for (const Notice& n : NOTICES)
        if (n.id == id) return &n;
    return nullptr;
}

// ============================================================
//  MAIN
// ============================================================
int main() {
    cout << "========================================\n";
    cout << "   GEHU Connect — Notices Module        \n";
    cout << "   Member  : Shyamali Bisht             \n";
    cout << "   DSA     : Trie  + Stack (LIFO)       \n";
    cout << "   C++     : Struct/Class, String Manip \n";
    cout << "========================================\n\n";

    // Build Trie index
    Trie trie;
    for (const Notice& n : NOTICES)
        trie.indexNotice(n);

    cout << "[Trie] " << NOTICES.size() << " notices indexed.\n";

    // ---- TRIE SEARCH DEMO ----
    vector<string> queries = {"exam", "library", "holi", "tech", "fee", "intern", "placement"};

    cout << "\n--- TRIE PREFIX SEARCH DEMO ---\n";
    cout << string(60, '-') << "\n";

    for (const string& q : queries) {
        vector<int> ids = trie.search(q);
        cout << "\nQuery: \"" << q << "\"  → " << ids.size() << " result(s)\n";
        for (int id : ids) {
            const Notice* n = findById(id);
            if (n) {
                string pri = n->highPriority ? " 🔴HIGH" : "";
                cout << "  [" << setw(11) << n->category << "]  "
                     << n->title << pri << "\n";
            }
        }
    }

    // ---- STACK DEMO ----
    RecentStack stack(5);

    cout << "\n--- STACK (LIFO) RECENTLY VIEWED DEMO ---\n";
    cout << "Simulating: student views notices 1, 5, 3, 9, 2, then revisits 1\n\n";

    for (int id : {1, 5, 3, 9, 2, 1}) {
        const Notice* n = findById(id);
        if (n) {
            cout << "  push(" << id << ") — \"" << n->title.substr(0, 45) << "…\"\n";
            stack.push(id);
        }
    }

    stack.display(NOTICES);

    cout << "\n  Stack size  : " << stack.size() << " (max 5)\n";
    cout << "  Peek (top)  : ";
    const Notice* top = findById(stack.peek());
    if (top) cout << top->title << "\n";

    return 0;
}

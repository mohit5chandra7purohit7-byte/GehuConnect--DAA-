// ============================================================
//  notices.cpp  — Shyamali's Module (Phase 2)
//  DSA Concept  : Trie (for fast notice title search)
//
//  INPUT  : reads from input.txt (written by Flask)
//           line 1: category filter ("all" or specific)
//           rest  : id,title,category,date,urgency
//  OUTPUT : prints JSON array to stdout
// ============================================================

#include<iostream>
#include<fstream>
#include<sstream>
#include<string>
#include<vector>
using namespace std;

struct Notice {
    int id;
    string title, category, date, urgency;
};

// ---- Trie — INCOMPLETE (Phase 3) ----
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    TrieNode() {
        isEnd = false;
        for(int i = 0; i < 26; i++) children[i] = nullptr;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }

    // insert is fully written
    void insert(string word) {
        TrieNode* curr = root;
        for(char c : word) {
            int idx = tolower(c) - 'a';
            if(idx < 0 || idx >= 26) continue;
            if(!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }

    // TODO: complete search() and connect to main in phase 3
    bool search(string word) {
        TrieNode* curr = root;
        // only first two lines written for now
        if(!curr) return false;
        return false;  // rest of logic missing — phase 3
    }
};

int main() {
    ifstream fin("input.txt");
    if(!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    string category;
    getline(fin, category);

    vector<Notice> notices;
    string line;
    while(getline(fin, line)) {
        if(line.empty()) continue;
        stringstream ss(line);
        string token;
        Notice n;
        int col = 0;
        while(getline(ss, token, ',')) {
            if      (col == 0) n.id       = stoi(token);
            else if (col == 1) n.title    = token;
            else if (col == 2) n.category = token;
            else if (col == 3) n.date     = token;
            else if (col == 4) n.urgency  = token;
            col++;
        }
        notices.push_back(n);
    }
    fin.close();

    // Trie: insert all titles (for phase 3 search)
    Trie trie;
    for(auto &n : notices) trie.insert(n.title);

    // linear search filter — works now so page loads
    vector<Notice> filtered;
    for(auto &n : notices) {
        if(category == "all" || n.category == category)
            filtered.push_back(n);
    }

    cout << "[";
    for(int i = 0; i < (int)filtered.size(); i++) {
        cout << "{"
             << "\"id\":"         << filtered[i].id        << ","
             << "\"title\":\""    << filtered[i].title     << "\","
             << "\"category\":\"" << filtered[i].category  << "\","
             << "\"date\":\""     << filtered[i].date      << "\","
             << "\"urgency\":\""  << filtered[i].urgency   << "\""
             << "}";
        if(i < (int)filtered.size()-1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}

#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

struct Notice {
    int id;
    string title, category, date, urgency;
};

struct TrieNode {
    TrieNode* children[26];
    vector<Notice> categoryNotices;
    TrieNode() {
        for (int i = 0; i < 26; i++) children[i] = nullptr;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }

    void insert(string category, Notice n) {
        TrieNode* curr = root;
        for (char c : category) {
            int idx = tolower(c) - 'a';
            if (idx < 0 || idx >= 26) continue;
            if (!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->categoryNotices.push_back(n);
    }

    vector<Notice> search(string category) {
        TrieNode* curr = root;
        for (char c : category) {
            int idx = tolower(c) - 'a';
            if (idx < 0 || idx >= 26) continue;
            if (!curr->children[idx]) return {};
            curr = curr->children[idx];
        }
        return curr->categoryNotices;
    }

    // Phase 3 pending
    vector<string> autoCompleteCategory(string prefix) {
        // missing recursive traversal to find all child categories
        return {};
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

    string req_category;
    getline(fin, req_category);

    vector<Notice> allNotices;
    Trie trie;
    
    string line;
    while (getline(fin, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string token;
        Notice n;
        int col = 0;
        while (getline(ss, token, ',')) {
            if      (col == 0) n.id       = stoi(token);
            else if (col == 1) n.title    = token;
            else if (col == 2) n.category = token;
            else if (col == 3) n.date     = token;
            else if (col == 4) n.urgency  = token;
            col++;
        }
        allNotices.push_back(n);
        trie.insert(n.category, n);
    }
    fin.close();

    vector<Notice> filtered;
    if (req_category == "all") {
        filtered = allNotices;
    } else {
        filtered = trie.search(req_category);
    }

    cout << "[";
    for (int i = 0; i < (int)filtered.size(); i++) {
        cout << "{"
             << "\"id\":"         << filtered[i].id       << ","
             << "\"title\":\""    << filtered[i].title    << "\","
             << "\"category\":\"" << filtered[i].category << "\","
             << "\"date\":\""     << filtered[i].date     << "\","
             << "\"urgency\":\""  << filtered[i].urgency  << "\""
             << "}";
        if (i < (int)filtered.size() - 1) cout << ",";
    }
    cout << "]" << endl;

    return 0;
}

// ==========================================
// PHASE 3 PENDING:
// 1. autoCompleteCategory() inside Trie is declared but incomplete.
//    Once complete, users typing "E" will get "Event", "Exam", etc.
// ==========================================

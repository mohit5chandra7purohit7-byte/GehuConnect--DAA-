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
    bool isEnd;
    TrieNode() {
        isEnd = false;
        for (int i = 0; i < 26; i++) children[i] = nullptr;
    }
};

class Trie {
public:
    TrieNode* root;
    Trie() { root = new TrieNode(); }

    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = tolower(c) - 'a';
            if (idx < 0 || idx >= 26) continue;
            if (!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        TrieNode* curr = root;
        if (!curr) return false;
        return false;
    }
};

int main() {
    ifstream fin("input.txt");
    if (!fin.is_open()) {
        cout << "{\"error\":\"input file missing\"}" << endl;
        return 1;
    }

    string category;
    getline(fin, category);

    vector<Notice> notices;
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
        notices.push_back(n);
    }
    fin.close();

    Trie trie;
    for (auto &n : notices) trie.insert(n.title);

    vector<Notice> filtered;
    for (auto &n : notices) {
        if (category == "all" || n.category == category)
            filtered.push_back(n);
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

// ============================================================
//  notices.js — Shyamali's Module (Phase 2)
//  DSA Concepts:
//    • Trie          — fast prefix-based notice search
//    • Stack (LIFO)  — recently viewed notices (last 5)
// ============================================================

// ============================================================
//  TRIE — Node + Tree for O(L) prefix search
// ============================================================
class TrieNode {
    constructor() {
        this.children = {}; // char → TrieNode
        this.ids = [];      // notice IDs whose words end here
    }
}

class Trie {
    constructor() { this.root = new TrieNode(); }

    // Insert a word and link it to a notice ID
    insert(word, id) {
        let node = this.root;
        for (const ch of word) {
            if (!node.children[ch]) node.children[ch] = new TrieNode();
            node = node.children[ch];
        }
        if (!node.ids.includes(id)) node.ids.push(id);
    }

    // Index a notice: split title + category + content into words
    index(notice) {
        const text = (notice.title + ' ' + notice.category + ' ' + notice.content).toLowerCase();
        const words = text.split(/\s+/);
        for (const word of words) {
            const cleaned = word.replace(/[^a-z]/g, '');
            if (cleaned.length > 2) this.insert(cleaned, notice.id);
        }
    }

    // Search: DFS from prefix node, collect all matching IDs
    search(prefix) {
        let node = this.root;
        for (const ch of prefix.toLowerCase().replace(/[^a-z]/g, '')) {
            if (!node.children[ch]) return [];
            node = node.children[ch];
        }
        const ids = new Set();
        const stack = [node];
        while (stack.length) {
            const curr = stack.pop();
            curr.ids.forEach(id => ids.add(id));
            Object.values(curr.children).forEach(child => stack.push(child));
        }
        return [...ids];
    }
}

// ============================================================
//  STACK (LIFO) — Recently viewed notices, max 5
// ============================================================
class RecentStack {
    constructor(max = 5) { this.items = []; this.max = max; }

    push(id) {
        this.items = this.items.filter(x => x !== id); // remove duplicate
        this.items.unshift(id);                         // push on top
        if (this.items.length > this.max) this.items.pop(); // keep max 5
    }

    peek()    { return this.items[0] ?? null; }
    toArray() { return [...this.items]; }
    size()    { return this.items.length; }
}

// ============================================================
//  HARDCODED NOTICE DATA (same for all students — Phase 2)
// ============================================================
const NOTICES = [
    {
        id: 1, category: 'Examination', priority: 'high',
        title: 'Mid Semester Examination Schedule — April 2026',
        date: '2026-03-20',
        content: 'The mid-semester examinations for even semester (4th & 6th) will commence from 5th April 2026. Detailed schedule: CSE401 DAA on 05-Apr, CSE402 OS on 07-Apr, CSE403 DBMS on 09-Apr, CSE404 CN on 11-Apr, CSE405 SE on 13-Apr. Students must carry their university ID cards. No electronic devices permitted in the examination hall.'
    },
    {
        id: 2, category: 'Event', priority: 'normal',
        title: 'Technical Fest "Technovate 2026" — Registration Open',
        date: '2026-03-22',
        content: 'GEHU\'s annual technical fest Technovate 2026 will be held on 2nd–3rd April. Events include competitive coding, robotics challenge, hackathon (24h), paper presentation, and UI/UX design challenge. Registration fee: ₹150 per person or ₹400 per team (max 4). Register at the CSE department office or via the college ERP portal before 30th March.'
    },
    {
        id: 3, category: 'Academic', priority: 'normal',
        title: 'Library Timings Extended for Examination Period',
        date: '2026-03-18',
        content: 'The central library will remain open until 10:00 PM from 1st April to 20th April to support students during the examination period. Digital library access (JSTOR, IEEE Xplore, Springer) is available 24x7 using your university credentials. Fine waivers on overdue books will be granted upon faculty recommendation.'
    },
    {
        id: 4, category: 'Holiday', priority: 'normal',
        title: 'College Closed — Holi Festival Holiday',
        date: '2026-03-13',
        content: 'The college will remain closed on 14th March 2026 (Saturday) on account of Holi. Classes and labs scheduled for that day will not be compensated. Students residing in hostel must comply with hostel regulations. The college will resume normally on 16th March (Monday).'
    },
    {
        id: 5, category: 'General', priority: 'high',
        title: 'Fee Payment Deadline — Last Date 31st March 2026',
        date: '2026-03-15',
        content: 'Students who have not submitted the Even Semester fee are reminded that the last date for fee payment without late fine is 31st March 2026. A late fine of ₹100 per day will be applicable thereafter. Students may pay online via State Bank Collect or in person at the Accounts Office (Block A, Room 101). Failure to pay may result in exam form de-registration.'
    },
    {
        id: 6, category: 'Academic', priority: 'normal',
        title: 'New Elective Course Registration — 5th Semester',
        date: '2026-03-17',
        content: 'Students proceeding to 5th semester are required to select their elective courses for the upcoming odd semester. Available electives: Machine Learning, Cyber Security, Cloud Computing, IoT, and Blockchain. Each seat has limited capacity (30 per section). Registration portal will be open from 1st to 10th April. First come, first served.'
    },
    {
        id: 7, category: 'Event', priority: 'normal',
        title: 'Guest Lecture by Dr. A. Kumar — AI & Future of Software',
        date: '2026-03-24',
        content: 'The CSE department is hosting a guest lecture by Dr. Ankur Kumar (Senior Research Scientist, Google DeepMind) on the topic "AI & the Future of Software Engineering." The event will be held on 28th March 2026, 11:00 AM to 1:00 PM, in the Main Auditorium. All students are encouraged to attend. E-certificates will be awarded to attendees.'
    },
    {
        id: 8, category: 'Academic', priority: 'normal',
        title: 'Summer Internship Drive — Apply Before 5th April',
        date: '2026-03-23',
        content: 'The Training & Placement Cell is facilitating summer internship applications for 3rd year B.Tech students. Companies participating: TCS, Infosys, Wipro, DRDO, and multiple startups. Application portal open at placement.gehu.ac.in. Eligibility: 65%+ aggregate, no active backlogs. Resume must be submitted in the prescribed format available on the T&P portal.'
    },
    {
        id: 9, category: 'Examination', priority: 'high',
        title: 'Practical Examination Schedule — April 2026',
        date: '2026-03-19',
        content: 'Practical examinations will be conducted from 1st April to 4th April 2026. CSE406 (Web Technology Lab) on 1st April, CSE-Lab II on 2nd April. Students must bring their completed lab records and receive faculty signature before appearing. Viva-voce will be conducted simultaneously. Marks will be moderated by external examiner.'
    },
    {
        id: 10, category: 'Event', priority: 'normal',
        title: 'Annual Cultural Night — "Spectrum 2026"',
        date: '2026-03-21',
        content: 'The Annual Cultural Night "Spectrum 2026" will be organised on 29th March 2026 at the GEHU open-air amphitheatre. Events include dance competition, singing, skit, and stand-up comedy. Participants must register with their respective cultural coordinators. Gate passes will be issued to all registered students. Event starts at 5:00 PM.'
    },
    {
        id: 11, category: 'General', priority: 'normal',
        title: 'Campus Placement Drive — TCS NextStep 2026',
        date: '2026-03-25',
        content: 'Tata Consultancy Services (TCS) will be visiting campus for placement drive on 15th April 2026. Eligible batch: B.Tech 2022–2026 passout with 60%+ aggregate and no more than 1 active backlog. Test pattern: TCS iON CTQ (Cognitive + Technical + Quantitative). Pre-placement talk on 12th April. Register via TCS NextStep portal. Mandatory PPT attendance.'
    },
    {
        id: 12, category: 'Holiday', priority: 'normal',
        title: 'Summer Vacation Schedule — 2026',
        date: '2026-03-26',
        content: 'Summer vacation for all UG programmes will commence from 16th May 2026 and conclude on 14th June 2026. Results for Even Semester will be declared by 30th April. Odd semester classes will begin from 15th June 2026. Faculty re-evaluation applications, if any, must be filed within 7 days of result declaration. Hostel will remain operational during vacation for examination-retake students.'
    }
];

// ============================================================
//  GLOBAL STATE
// ============================================================
const trie        = new Trie();
const recentStack = new RecentStack(5);
let currentFilter = 'All';
let currentSearch = '';

// ============================================================
//  BUILD TRIE — Index all notices on page load
// ============================================================
function buildTrie() {
    NOTICES.forEach(notice => trie.index(notice));
}

// ============================================================
//  FILTER LOGIC
// ============================================================
function getFilteredNotices() {
    let result = NOTICES;

    // Search via Trie
    if (currentSearch.trim().length > 0) {
        const matchIds = new Set(trie.search(currentSearch.trim()));
        result = result.filter(n => matchIds.has(n.id));
    }

    // Category filter
    if (currentFilter !== 'All') {
        result = result.filter(n => n.category === currentFilter);
    }

    return result;
}

// ============================================================
//  RENDER — Notice cards
// ============================================================
function renderNotices() {
    const container = document.getElementById('noticesList');
    const data = getFilteredNotices();

    if (data.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div style="font-size:2rem;">🔍</div>
                <p>No notices found for "<strong>${currentSearch || currentFilter}</strong>"</p>
            </div>`;
        return;
    }

    container.innerHTML = data.map(n => `
        <div class="notice-card ${n.priority === 'high' ? 'priority-high' : ''}"
             onclick="openModal(${n.id})" data-id="${n.id}">
            <div class="notice-header">
                <div class="notice-title">${n.title}</div>
                <span class="cat-badge ${n.category}">${n.category}</span>
            </div>
            <div class="notice-meta">📅 ${formatDate(n.date)}${n.priority === 'high' ? ' &nbsp;🔴 High Priority' : ''}</div>
            <div class="notice-excerpt">${n.content}</div>
        </div>
    `).join('');
}

// ============================================================
//  RENDER — Recently viewed (Stack display)
// ============================================================
function renderRecent() {
    const container = document.getElementById('recentList');
    const ids = recentStack.toArray();

    if (ids.length === 0) {
        container.innerHTML = '<p class="recent-empty">No notices viewed yet.<br>Click any notice to read it.</p>';
        return;
    }

    container.innerHTML = ids.map((id, i) => {
        const n = NOTICES.find(x => x.id === id);
        if (!n) return '';
        return `
            <div class="recent-item" onclick="openModal(${n.id})">
                <span class="recent-num">${i + 1}</span>
                <span>${n.title.length > 42 ? n.title.slice(0, 42) + '…' : n.title}</span>
            </div>`;
    }).join('');
}

// ============================================================
//  MODAL — Open notice detail
// ============================================================
function openModal(id) {
    const notice = NOTICES.find(n => n.id === id);
    if (!notice) return;

    // Push to stack
    recentStack.push(id);
    renderRecent();

    // Populate modal
    document.getElementById('modalTitle').textContent = notice.title;
    document.getElementById('modalMeta').innerHTML =
        `<span class="cat-badge ${notice.category}">${notice.category}</span>
         <span>📅 ${formatDate(notice.date)}</span>
         ${notice.priority === 'high' ? '<span style="color:var(--danger)">🔴 High Priority</span>' : ''}`;
    document.getElementById('modalBody').textContent = notice.content;
    document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
}

// ============================================================
//  HELPERS
// ============================================================
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    // Fill student name badge from localStorage
    try {
        const stored = localStorage.getItem('studentData');
        if (stored) {
            const parsed = JSON.parse(stored);
            const name = parsed.fullName || parsed.studentId || '—';
            document.getElementById('studentNameBadge').textContent = name;
            document.getElementById('rollBadge').textContent = parsed.studentId || '—';
        }
    } catch (e) { /* ignore */ }

    // Build Trie index
    buildTrie();

    // Initial render
    renderNotices();

    // Search input — live Trie search
    document.getElementById('searchInput').addEventListener('input', function () {
        currentSearch = this.value.trim();
        renderNotices();
    });

    // Category pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', function () {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.cat;
            renderNotices();
        });
    });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    console.log('=== GEHU CONNECT — NOTICES MODULE ===');
    console.log('DSA: Trie (prefix search) + Stack (recently viewed)');
    console.log('Trie root:', trie.root);
    console.log('Total notices indexed:', NOTICES.length);
    console.log('=====================================');
});

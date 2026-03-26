// ============================================================
//  assignments.js — Manisha's Module (Phase 2)
//  DSA Concepts:
//    • Min Heap     — nearest deadline always at top O(log n) insert
//    • Linked List  — singly linked submission history
// ============================================================

// ============================================================
//  MIN HEAP — Min by dueDate (nearest deadline first)
// ============================================================
class MinHeap {
    constructor() { this.heap = []; }

    #parent(i) { return Math.floor((i - 1) / 2); }
    #left(i)   { return 2 * i + 1; }
    #right(i)  { return 2 * i + 2; }
    #cmp(a, b) { return new Date(a.dueDate) - new Date(b.dueDate); }

    insert(item) {
        this.heap.push(item);
        this.#heapifyUp(this.heap.length - 1);
    }

    #heapifyUp(i) {
        while (i > 0) {
            const p = this.#parent(i);
            if (this.#cmp(this.heap[i], this.heap[p]) < 0) {
                [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
                i = p;
            } else break;
        }
    }

    extractMin() {
        if (!this.heap.length) return null;
        const min  = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length) { this.heap[0] = last; this.#heapifyDown(0); }
        return min;
    }

    #heapifyDown(i) {
        const n = this.heap.length;
        let smallest = i;
        const l = this.#left(i), r = this.#right(i);
        if (l < n && this.#cmp(this.heap[l], this.heap[smallest]) < 0) smallest = l;
        if (r < n && this.#cmp(this.heap[r], this.heap[smallest]) < 0) smallest = r;
        if (smallest !== i) {
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            this.#heapifyDown(smallest);
        }
    }

    // Extract all in sorted order, restore heap afterwards
    toSortedArray() {
        const backup = [...this.heap];
        const sorted = [];
        while (this.heap.length) sorted.push(this.extractMin());
        this.heap = backup;
        return sorted;
    }

    size() { return this.heap.length; }
}

// ============================================================
//  SINGLY LINKED LIST — Submission history (newest at head)
// ============================================================
class ListNode {
    constructor(data) { this.data = data; this.next = null; }
}

class SubmissionList {
    constructor() { this.head = null; this.size = 0; }

    // Prepend (O(1)) — most recent submission becomes new head
    prepend(data) {
        const node  = new ListNode(data);
        node.next   = this.head;
        this.head   = node;
        this.size++;
    }

    // Traverse list → array for rendering
    toArray() {
        const result = [];
        let curr = this.head;
        while (curr) { result.push(curr.data); curr = curr.next; }
        return result;
    }
}

// ============================================================
//  HARDCODED DATA — Assignments
// ============================================================
const ASSIGNMENTS_RAW = [
    {
        id: 1, subject: 'Design & Analysis of Algorithms', code: 'CSE401',
        title: 'Implement Merge Sort Visualizer',
        desc: 'Build a step-by-step visual demo of the Merge Sort algorithm.',
        dueDate: '2026-03-28', marks: 20, status: 'pending'
    },
    {
        id: 2, subject: 'Operating Systems', code: 'CSE402',
        title: 'Round Robin Scheduling Simulator',
        desc: 'Simulate Round Robin CPU scheduling with quantum = 3ms.',
        dueDate: '2026-03-30', marks: 15, status: 'submitted'
    },
    {
        id: 3, subject: 'Database Management Systems', code: 'CSE403',
        title: 'Hospital Management ER Diagram',
        desc: 'Design a complete ER diagram for a hospital management system.',
        dueDate: '2026-04-01', marks: 20, status: 'pending'
    },
    {
        id: 4, subject: 'Computer Networks', code: 'CSE404',
        title: 'IP Subnetting Worksheet',
        desc: 'Solve 15 subnetting problems — VLSM and CIDR notation.',
        dueDate: '2026-04-03', marks: 10, status: 'pending'
    },
    {
        id: 5, subject: 'Software Engineering', code: 'CSE405',
        title: 'Use Case Diagram — Library System',
        desc: 'Draw use-case, class, and sequence diagrams for a library system.',
        dueDate: '2026-04-05', marks: 20, status: 'pending'
    },
    {
        id: 6, subject: 'Web Technology Lab', code: 'CSE406',
        title: 'Responsive Personal Portfolio',
        desc: 'Build a mobile-responsive portfolio using HTML, CSS, and JS only.',
        dueDate: '2026-04-07', marks: 25, status: 'submitted'
    }
];

// ============================================================
//  HARDCODED DATA — Exams (sorted by date — Min Heap concept)
// ============================================================
const EXAMS_RAW = [
    { subject: 'Design & Analysis of Algorithms', code: 'CSE401', date: '2026-04-05', time: '10:00 AM', room: 'LT-101', type: 'Mid Semester' },
    { subject: 'Operating Systems',               code: 'CSE402', date: '2026-04-07', time: '10:00 AM', room: 'LT-102', type: 'Mid Semester' },
    { subject: 'Database Management Systems',     code: 'CSE403', date: '2026-04-09', time: '02:00 PM', room: 'LT-103', type: 'Mid Semester' },
    { subject: 'Computer Networks',               code: 'CSE404', date: '2026-04-11', time: '10:00 AM', room: 'LT-101', type: 'Mid Semester' },
    { subject: 'Software Engineering',            code: 'CSE405', date: '2026-04-13', time: '02:00 PM', room: 'LT-104', type: 'Mid Semester' },
    { subject: 'Web Technology Lab',              code: 'CSE406', date: '2026-04-15', time: '10:00 AM', room: 'Lab-201', type: 'Practical'   }
];

// ============================================================
//  HARDCODED DATA — Submitted assignments (Linked List history)
// ============================================================
const HISTORY_DATA = [
    { title: 'Binary Search Tree Implementation', subject: 'DSA', code: 'CSE301', submittedOn: '2026-03-10', marks: '18/20', grade: 'A' },
    { title: 'SQL Query Practice Sheet',          subject: 'DBMS', code: 'CSE303', submittedOn: '2026-03-15', marks: '14/15', grade: 'A+' },
    { title: 'Responsive Portfolio',              subject: 'Web Lab', code: 'CSE406', submittedOn: '2026-03-22', marks: '23/25', grade: 'A' },
    { title: 'Round Robin Scheduling Simulator',  subject: 'OS', code: 'CSE402', submittedOn: '2026-03-25', marks: null, grade: 'Pending' }
];

// ============================================================
//  TODAY (reference point for deadline calculations)
// ============================================================
const TODAY = new Date('2026-03-26'); // fixed reference date

function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr) - TODAY) / (1000 * 60 * 60 * 24));
}

function deadlineClass(days, status) {
    if (status === 'submitted') return 'done';
    if (days < 0)  return 'danger';
    if (days <= 3) return 'danger';
    if (days <= 7) return 'warn';
    return 'safe';
}

function formatDate(str) {
    return new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ============================================================
//  RENDER — Assignments (Min Heap sorted)
// ============================================================
function renderAssignments() {
    // Build Min Heap from pending assignments; submitted go at end
    const heap = new MinHeap();
    const submitted = [];

    ASSIGNMENTS_RAW.forEach(a => {
        if (a.status === 'pending') heap.insert(a);
        else submitted.push(a);
    });

    const sorted = [...heap.toSortedArray(), ...submitted];

    // Summary counts
    const total     = ASSIGNMENTS_RAW.length;
    const pendingC  = ASSIGNMENTS_RAW.filter(a => a.status === 'pending').length;
    const subCount  = total - pendingC;
    const urgent    = ASSIGNMENTS_RAW.filter(a => a.status === 'pending' && daysUntil(a.dueDate) <= 3).length;

    document.getElementById('totalAssign').textContent    = total;
    document.getElementById('pendingCount').textContent   = pendingC;
    document.getElementById('submittedCount').textContent = subCount;
    document.getElementById('urgentCount').textContent    = urgent;

    const list = document.getElementById('assignmentsList');
    list.innerHTML = sorted.map(a => {
        const days  = daysUntil(a.dueDate);
        const cls   = deadlineClass(days, a.status);
        const daysLabel = a.status === 'submitted' ? '✅ Submitted'
            : days < 0  ? `${Math.abs(days)}d overdue`
            : days === 0 ? 'Due today!'
            : `${days} day${days > 1 ? 's' : ''} left`;

        // Progress bar: % of time elapsed (assume 14-day window)
        const barPct = Math.min(100, Math.max(0, a.status === 'submitted' ? 100 : ((14 - days) / 14) * 100));

        return `
        <div class="assign-card ${a.status === 'submitted' ? 'submitted' : days <= 3 ? 'urgent' : ''}">
            <div class="assign-top">
                <div class="assign-title">${a.title}</div>
                <span class="status-badge ${a.status === 'submitted' ? 'submitted' : days < 0 ? 'overdue' : 'pending'}">
                    ${a.status === 'submitted' ? '✅ Submitted' : days < 0 ? '🔴 Overdue' : '⏳ Pending'}
                </span>
            </div>
            <div class="assign-meta">
                <span>📚 ${a.subject}</span>
                <span class="code-tag">${a.code}</span>
                <span>📅 Due: <strong>${formatDate(a.dueDate)}</strong></span>
                <span>🎯 Marks: ${a.marks}</span>
            </div>
            <div class="deadline-bar">
                <div class="deadline-fill ${cls}" style="width:${barPct}%"></div>
            </div>
            <span class="days-badge ${cls}">${daysLabel}</span>
            <p style="font-size:.82rem;color:var(--muted);margin-top:8px;">${a.desc}</p>
        </div>`;
    }).join('');
}

// ============================================================
//  RENDER — Exams table
// ============================================================
function renderExams() {
    // Sort exams by date using Min Heap (same concept as assignments)
    const examHeap = new MinHeap();
    EXAMS_RAW.forEach(e => examHeap.insert({ ...e, dueDate: e.date }));
    const sorted = examHeap.toSortedArray();

    const total   = sorted.length;
    const nearest = sorted[0];
    const nDays   = nearest ? daysUntil(nearest.date) : 0;

    document.getElementById('totalExams').textContent    = total;
    document.getElementById('nextExamDays').textContent  = nDays;
    document.getElementById('nextExamName').textContent  = nearest?.code || '—';

    const tbody = document.getElementById('examsBody');
    tbody.innerHTML = sorted.map((exam, i) => {
        const days = daysUntil(exam.date);
        const bCls = days <= 5 ? 'soon' : days <= 10 ? 'near' : 'ok';
        const show = days <= 0 ? 'Done' : `${days}d left`;
        return `
        <tr>
            <td style="color:var(--muted)">${i + 1}</td>
            <td style="font-weight:500">${exam.subject}</td>
            <td class="exam-code">${exam.code}</td>
            <td class="exam-date">${formatDate(exam.date)}</td>
            <td class="exam-time">${exam.time}</td>
            <td class="exam-room">${exam.room}</td>
            <td><span class="days-left-badge ${bCls}">${show}</span></td>
        </tr>`;
    }).join('');
}

// ============================================================
//  RENDER — Submission history (Linked List)
// ============================================================
function renderHistory() {
    // Build linked list (prepend = newest at head)
    const list = new SubmissionList();
    // Insert in reverse chronological order so newest ends at head
    [...HISTORY_DATA].reverse().forEach(item => list.prepend(item));

    const container = document.getElementById('historyList');
    const items = list.toArray();

    container.innerHTML = items.map((item, i) => `
        <div class="history-item">
            <div class="history-dot">${i + 1}</div>
            <div class="history-content">
                <div class="history-title">${item.title}</div>
                <div class="history-meta">
                    <span class="code-tag" style="font-size:.75rem">${item.code}</span>
                    <span>📅 ${formatDate(item.submittedOn)}</span>
                    <span>🎯 ${item.marks ? `Marks: ${item.marks}` : 'Awaiting marks'}</span>
                    <span style="color:${item.grade === 'Pending' ? 'var(--warn)' : 'var(--safe)'}; font-weight:600">
                        ${item.grade === 'Pending' ? '⏳ Pending' : `Grade: ${item.grade}`}
                    </span>
                </div>
            </div>
        </div>`).join('');
}

// ============================================================
//  TABS
// ============================================================
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('tab-' + this.dataset.tab).classList.add('active');
        });
    });
}

// ============================================================
//  STUDENT BADGE
// ============================================================
function loadStudentBadge() {
    try {
        const stored = localStorage.getItem('studentData');
        if (stored) {
            const p = JSON.parse(stored);
            document.getElementById('studentNameBadge').textContent = p.fullName || p.studentId || '—';
            document.getElementById('rollBadge').textContent = p.studentId || '—';
        }
    } catch (e) { /* ignore */ }
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    loadStudentBadge();
    renderAssignments();
    renderExams();
    renderHistory();
    initTabs();

    console.log('=== GEHU CONNECT — ASSIGNMENTS MODULE ===');
    console.log('DSA: Min Heap (deadline sort) + Linked List (history)');
    console.log('Total assignments:', ASSIGNMENTS_RAW.length);
    console.log('Total exams:', EXAMS_RAW.length);
    console.log('==========================================');
});

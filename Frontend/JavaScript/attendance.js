// ============================================================
//  attendance.js  — Mohit's Attendance Module (Phase 2)
//  DSA Concept   : Merge Sort (mirroring Backend/attendance.cpp)
//  Data          : Hardcoded per-student data (Phase 2)
//                  Phase 3 will replace this with a Flask API
// ============================================================

// ============================================================
//  HARDCODED DATA — All students keyed by roll number
//  (Same structure as Data/attendance.txt)
// ============================================================
const ALL_STUDENTS = {
    '2419260': {
        name: 'MOHIT CHANDRA PUROHIT',
        subjects: [
            { subject: 'Design & Analysis of Algorithms', code: 'CSE401', total: 40, attended: 35 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 28 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 38 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 29 },
            { subject: 'Software Engineering', code: 'CSE405', total: 36, attended: 36 },
            { subject: 'Web Technology Lab', code: 'CSE406', total: 30, attended: 20 }
        ]
    },
    '2418628': {
        name: 'MAITRI GOYAL',
        subjects: [
            { subject: 'Design & Analysis of Algorithms', code: 'CSE401', total: 40, attended: 38 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 36 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 40 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 37 },
            { subject: 'Software Engineering', code: 'CSE405', total: 36, attended: 35 },
            { subject: 'Web Technology Lab', code: 'CSE406', total: 30, attended: 28 }
        ]
    },
    '2419475': {
        name: 'MANISHA BISHT',
        subjects: [
            { subject: 'Design & Analysis of Algorithms', code: 'CSE401', total: 40, attended: 36 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 34 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 39 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 35 },
            { subject: 'Software Engineering', code: 'CSE405', total: 36, attended: 34 },
            { subject: 'Web Technology Lab', code: 'CSE406', total: 30, attended: 22 }
        ]
    },
    '2418996': {
        name: 'SHYAMLI BISHT',
        subjects: [
            { subject: 'Design & Analysis of Algorithms', code: 'CSE401', total: 40, attended: 37 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 35 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 41 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 36 },
            { subject: 'Software Engineering', code: 'CSE405', total: 36, attended: 33 },
            { subject: 'Web Technology Lab', code: 'CSE406', total: 30, attended: 25 }
        ]
    }

};

// ============================================================
//  STEP 1 — Enrich raw data with computed percentage
// ============================================================
function enrichData(data) {
    return data.map(item => ({
        ...item,
        percentage: parseFloat(((item.attended / item.total) * 100).toFixed(1))
    }));
}

// ============================================================
//  MERGE SORT — JavaScript version (same logic as C++)
//  Sorts subjects by attendance percentage ASCENDING
//  (lowest % first → critical subjects appear on top)
// ============================================================
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i].percentage <= right[j].percentage) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

// ============================================================
//  RECOVERY PREDICTOR  (same formula as C++)
//  Returns how many consecutive classes needed to reach 75%
// ============================================================
function predictRecovery(subject) {
    if (subject.percentage >= 75) return null;

    let x = 0;
    while (((subject.attended + x) / (subject.total + x)) * 100 < 75) {
        x++;
    }
    return x;
}

// ============================================================
//  RENDER — One table row
// ============================================================
function buildRow(subject, index) {
    const isSafe = subject.percentage >= 75;
    const pctCls = isSafe ? 'safe' : 'danger';
    const badgeTxt = isSafe ? '✅ Safe' : '⚠ Low';

    return `
        <tr>
            <td class="cell-num">${index + 1}</td>
            <td class="cell-subject">${subject.subject}</td>
            <td class="cell-code">${subject.code}</td>
            <td>${subject.attended}</td>
            <td>${subject.total}</td>
            <td class="pct-cell">
                <div class="pct-wrap">
                    <div class="pct-bar">
                        <div class="pct-fill ${pctCls}" style="width:${subject.percentage}%"></div>
                    </div>
                    <span class="pct-txt ${pctCls}">${subject.percentage}%</span>
                </div>
            </td>
            <td><span class="badge ${pctCls}">${badgeTxt}</span></td>
        </tr>
    `;
}

function renderTable(data) {
    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = data.map((s, i) => buildRow(s, i)).join('');
}

// ============================================================
//  RENDER — Summary cards
// ============================================================
function renderSummary(data) {
    const total = data.length;
    const avg = (data.reduce((s, x) => s + x.percentage, 0) / total).toFixed(1);
    const low = data.filter(x => x.percentage < 75).length;
    const safe = total - low;

    document.getElementById('avgPct').textContent = avg + '%';
    document.getElementById('lowCount').textContent = low;
    document.getElementById('safeCount').textContent = safe;
    document.getElementById('totalSubs').textContent = total;
}

// ============================================================
//  RENDER — Recovery predictor cards
// ============================================================
function renderPredictor(data) {
    const container = document.getElementById('predictorCards');
    let html = '';

    data.forEach(subject => {
        const needed = predictRecovery(subject);
        if (needed === null) {
            html += `
                <div class="pred-card">
                    <div>
                        <div class="pred-subj">${subject.subject}</div>
                        <div class="pred-cur">Current: ${subject.percentage}%</div>
                    </div>
                    <span class="pred-rec ok">✅ You're safe!</span>
                </div>`;
        } else {
            html += `
                <div class="pred-card">
                    <div>
                        <div class="pred-subj">${subject.subject}</div>
                        <div class="pred-cur">Current: ${subject.percentage}% (${subject.attended}/${subject.total})</div>
                    </div>
                    <span class="pred-rec warn">Attend ${needed} more class${needed > 1 ? 'es' : ''}</span>
                </div>`;
        }
    });

    container.innerHTML = html;
}

// ============================================================
//  SORT BUTTON — Animate merge sort steps
// ============================================================
let isSorted = false;
let originalData = [];
let sortedData = [];

function runSortAnimation() {
    const btn = document.getElementById('sortBtn');
    const resetBtn = document.getElementById('resetBtn');
    const status = document.getElementById('sortStatus');

    btn.disabled = true;
    status.textContent = 'Step 1: Dividing array into halves...';

    setTimeout(() => { status.textContent = 'Step 2: Recursively sorting each half...'; }, 600);
    setTimeout(() => { status.textContent = 'Step 3: Merging sorted halves back together...'; }, 1200);

    setTimeout(() => {
        renderTable(sortedData);

        const rows = document.querySelectorAll('#attendanceBody tr');
        rows.forEach((row, i) => {
            setTimeout(() => {
                row.classList.add('highlight-moved');
                setTimeout(() => row.classList.remove('highlight-moved'), 700);
            }, i * 100);
        });

        renderPredictor(sortedData);
        status.textContent = '✅ Sort complete! Subjects sorted: lowest attendance first.';
        resetBtn.style.display = 'inline-block';
        isSorted = true;
    }, 1800);
}

function resetSort() {
    renderTable(originalData);
    renderPredictor(originalData);

    document.getElementById('sortBtn').disabled = false;
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('sortStatus').textContent = '';
    isSorted = false;
}

// ============================================================
//  INIT — Run on page load
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    // --- Identify logged-in student from localStorage ---
    let roll = '2419260'; // fallback default
    try {
        const stored = localStorage.getItem('studentData');
        if (stored) {
            const parsed = JSON.parse(stored);
            roll = parsed.studentId || roll;
        }
    } catch (e) { /* ignore parse errors */ }

    // --- Pick this student's data (fallback to Mohit if unknown roll) ---
    const studentRecord = ALL_STUDENTS[roll] || ALL_STUDENTS['2419260'];

    // --- Update header badge with real name + roll ---
    const nameBadge = document.getElementById('studentNameBadge');
    const rollBadge = document.querySelector('.roll-badge');
    if (nameBadge) nameBadge.textContent = studentRecord.name;
    if (rollBadge) rollBadge.textContent = roll;

    // --- Enrich & sort ---
    originalData = enrichData(studentRecord.subjects);
    sortedData = mergeSort([...originalData]);

    // --- Render ---
    renderTable(originalData);
    renderSummary(originalData);
    renderPredictor(originalData);

    // --- Buttons ---
    document.getElementById('sortBtn').addEventListener('click', runSortAnimation);
    document.getElementById('resetBtn').addEventListener('click', resetSort);

    console.log('=== GEHU CONNECT — ATTENDANCE MODULE ===');
    console.log('Logged in Roll  :', roll);
    console.log('Student Name    :', studentRecord.name);
    console.log('DSA Algorithm   : Merge Sort');
    console.log('Original Data   :', originalData);
    console.log('Sorted Data     :', sortedData);
    console.log('=========================================');
});

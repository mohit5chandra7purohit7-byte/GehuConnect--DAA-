// ============================================================
//  attendance.js  — Mohit's Attendance Module (Phase 2)
//  DSA Concept   : Merge Sort (implemented in JavaScript,
//                  mirroring the logic in Backend/attendance.cpp)
//  Data Approach : Approach 1 — Hardcoded dummy data in JS
// ============================================================

// ============================================================
//  HARDCODED DUMMY DATA
//  (Same data also lives in Data/attendance.txt — Approach 2)
// ============================================================
const DUMMY_ATTENDANCE = [
    { subject: "Design & Analysis of Algorithms", code: "CSE401", total: 40, attended: 35 },
    { subject: "Operating Systems", code: "CSE402", total: 38, attended: 28 },
    { subject: "Database Management Systems", code: "CSE403", total: 42, attended: 38 },
    { subject: "Computer Networks", code: "CSE404", total: 40, attended: 29 },
    { subject: "Software Engineering", code: "CSE405", total: 36, attended: 36 },
    { subject: "Web Technology Lab", code: "CSE406", total: 30, attended: 20 },
    { subject: "Hindi and English", code: "HIE407", total: 20, attended: 15 }
];

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
    if (arr.length <= 1) return arr;                 // Base case

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));      // Sort left half
    const right = mergeSort(arr.slice(mid));          // Sort right half

    return merge(left, right);                        // Merge both
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        // Compare by percentage — pick the smaller one first
        if (left[i].percentage <= right[j].percentage) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    // Append remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// ============================================================
//  RECOVERY PREDICTOR
//  Formula (same as C++):
//  Attend x more consecutive classes to reach 75%:
//  x = ceil((0.75 * total - attended) / 0.25)
// ============================================================
function predictRecovery(subject) {
    if (subject.percentage >= 75) return null;  // Already safe

    let x = 0;
    while (((subject.attended + x) / (subject.total + x)) * 100 < 75) {
        x++;
    }
    return x;
}

// ============================================================
//  RENDER — Build one table row from a subject object
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

// ============================================================
//  RENDER  — Populate the whole table
// ============================================================
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
            // Safe — still show it
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
//  SORT BUTTON — Animate the sort step by step
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

    setTimeout(() => {
        status.textContent = 'Step 2: Recursively sorting each half...';
    }, 600);

    setTimeout(() => {
        status.textContent = 'Step 3: Merging sorted halves back together...';
    }, 1200);

    setTimeout(() => {
        // Apply the sorted data
        renderTable(sortedData);

        // Flash each row
        const rows = document.querySelectorAll('#attendanceBody tr');
        rows.forEach((row, i) => {
            setTimeout(() => {
                row.classList.add('highlight-moved');
                setTimeout(() => row.classList.remove('highlight-moved'), 700);
            }, i * 100);
        });

        // Update predictor to match sorted order
        renderPredictor(sortedData);

        status.textContent = '✅ Sort complete! Subjects sorted: lowest attendance first.';
        resetBtn.style.display = 'inline-block';
        isSorted = true;
    }, 1800);
}

function resetSort() {
    renderTable(originalData);
    renderPredictor(originalData);

    const btn = document.getElementById('sortBtn');
    const resetBtn = document.getElementById('resetBtn');
    const status = document.getElementById('sortStatus');

    btn.disabled = false;
    resetBtn.style.display = 'none';
    status.textContent = '';
    isSorted = false;
}

// ============================================================
//  INIT — Run on page load
// ============================================================
document.addEventListener('DOMContentLoaded', function () {

    // Enrich dummy data with percentages
    originalData = enrichData(DUMMY_ATTENDANCE);

    // Pre-compute the sorted version
    sortedData = mergeSort([...originalData]);

    // Initial render (unsorted — so user can see the sort happen)
    renderTable(originalData);
    renderSummary(originalData);    // Summary always uses original stats
    renderPredictor(originalData);

    // Buttons
    document.getElementById('sortBtn').addEventListener('click', runSortAnimation);
    document.getElementById('resetBtn').addEventListener('click', resetSort);

    console.log('=== GEHU CONNECT — ATTENDANCE MODULE ===');
    console.log('DSA Algorithm : Merge Sort');
    console.log('Data          : Hardcoded dummy data in attendance.js');
    console.log('C++ Version   : Backend/attendance.cpp');
    console.log('Text Data     : Data/attendance.txt');
    console.log('Original Data :', originalData);
    console.log('Sorted Data   :', sortedData);
    console.log('=========================================');
});

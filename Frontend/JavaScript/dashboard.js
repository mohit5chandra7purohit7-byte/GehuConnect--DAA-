// ===================================
// dashboard.js - Student Dashboard Logic
// ===================================

// Demo data (used when backend is not available)
const demoData = {
    // Your team's student IDs
    '2418628': {
        attendance: [
            { subject: 'Design and Analysis of Algorithms', code: 'CSE401', total: 40, attended: 38 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 36 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 40 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 37 }
        ],
        results: [
            { subject: 'Design and Analysis of Algorithms', type: 'Mid-sem', marks: 45, total: 50, grade: 'A' },
            { subject: 'Operating Systems', type: 'Mid-sem', marks: 43, total: 50, grade: 'A' },
            { subject: 'Database Management Systems', type: 'Mid-sem', marks: 46, total: 50, grade: 'A' }
        ]
    },
    '2419260': {
        attendance: [
            { subject: 'Design and Analysis of Algorithms', code: 'CSE401', total: 40, attended: 35 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 32 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 38 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 34 }
        ],
        results: [
            { subject: 'Design and Analysis of Algorithms', type: 'Mid-sem', marks: 42, total: 50, grade: 'A' },
            { subject: 'Operating Systems', type: 'Mid-sem', marks: 40, total: 50, grade: 'A' },
            { subject: 'Database Management Systems', type: 'Mid-sem', marks: 44, total: 50, grade: 'A' }
        ]
    },
    '2419475': {
        attendance: [
            { subject: 'Design and Analysis of Algorithms', code: 'CSE401', total: 40, attended: 36 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 34 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 39 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 35 }
        ],
        results: [
            { subject: 'Design and Analysis of Algorithms', type: 'Mid-sem', marks: 44, total: 50, grade: 'A' },
            { subject: 'Operating Systems', type: 'Mid-sem', marks: 41, total: 50, grade: 'A' },
            { subject: 'Database Management Systems', type: 'Mid-sem', marks: 43, total: 50, grade: 'A' }
        ]
    },
    '2418996': {
        attendance: [
            { subject: 'Design and Analysis of Algorithms', code: 'CSE401', total: 40, attended: 37 },
            { subject: 'Operating Systems', code: 'CSE402', total: 38, attended: 35 },
            { subject: 'Database Management Systems', code: 'CSE403', total: 42, attended: 38 },
            { subject: 'Computer Networks', code: 'CSE404', total: 40, attended: 36 }
        ],
        results: [
            { subject: 'Design and Analysis of Algorithms', type: 'Mid-sem', marks: 43, total: 50, grade: 'A' },
            { subject: 'Operating Systems', type: 'Mid-sem', marks: 42, total: 50, grade: 'A' },
            { subject: 'Database Management Systems', type: 'Mid-sem', marks: 45, total: 50, grade: 'A' }
        ]
    }
};

// Common notices for all students
const allNotices = [
    { title: 'End Semester Exam Schedule Released', category: 'Exam', date: '2026-02-10', important: true },
    { title: 'Fee Payment Deadline Extended', category: 'Fee', date: '2026-02-12', important: true },
    { title: 'Technical Fest - TechnoVision 2026', category: 'Event', date: '2026-02-08', important: false },
    { title: 'Library Timing Changes', category: 'General', date: '2026-02-05', important: false },
    { title: 'Workshop on AI/ML', category: 'Event', date: '2026-02-01', important: true }
];

// ===== LOAD STUDENT DATA =====
function loadStudentData() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        // Redirect to login if not logged in
        alert('Please login first!');
        window.location.href = 'index.html';
        return null;
    }

    // Get student data from localStorage
    const studentData = JSON.parse(localStorage.getItem('studentData'));

    if (!studentData) {
        alert('Session expired. Please login again.');
        window.location.href = 'index.html';
        return null;
    }

    return studentData;
}

// ===== DISPLAY STUDENT INFO =====
function displayStudentInfo(studentData) {
    document.getElementById('userName').textContent = studentData.fullName;
    document.getElementById('studentName').textContent = studentData.fullName;
    document.getElementById('studentId').textContent = studentData.studentId;
    document.getElementById('course').textContent = studentData.course;
    document.getElementById('semester').textContent = studentData.semester;
    document.getElementById('section').textContent = studentData.section;
}

// ===== DISPLAY ATTENDANCE =====
function displayAttendance(studentId) {
    const attendanceData = demoData[studentId]?.attendance || [];
    const attendanceList = document.getElementById('attendanceList');

    if (attendanceData.length === 0) {
        attendanceList.innerHTML = '<p class="loading">No attendance data available</p>';
        return;
    }

    let totalPercentage = 0;
    let lowAttendanceCount = 0;
    let html = '';

    attendanceData.forEach(item => {
        const percentage = ((item.attended / item.total) * 100).toFixed(1);
        totalPercentage += parseFloat(percentage);
        const isLow = percentage < 75;

        if (isLow) lowAttendanceCount++;

        html += `
            <div class="attendance-item ${isLow ? 'low' : ''}">
                <div class="subject-name">${item.subject}</div>
                <div class="attendance-bar">
                    <div class="attendance-fill ${isLow ? 'low' : ''}" style="width: ${percentage}%"></div>
                </div>
                <div class="attendance-stats">
                    <span>${item.attended} / ${item.total} classes</span>
                    <span><strong>${percentage}%</strong></span>
                </div>
            </div>
        `;
    });

    attendanceList.innerHTML = html;

    // Update average attendance
    const avgAttendance = (totalPercentage / attendanceData.length).toFixed(1);
    document.getElementById('avgAttendance').textContent = avgAttendance + '%';
    document.getElementById('totalSubjects').textContent = attendanceData.length;

    // Show alert if any subject has < 75% attendance
    if (lowAttendanceCount > 0) {
        const alertDiv = document.getElementById('attendanceAlert');
        const alertMsg = document.getElementById('alertMessage');
        alertDiv.style.display = 'block';
        alertMsg.innerHTML = `You have <strong>${lowAttendanceCount} subject(s)</strong> with attendance below 75%. Please attend classes regularly to avoid detention.`;
    }
}

// ===== DISPLAY EXAM RESULTS =====
function displayExamResults(studentId) {
    const resultsData = demoData[studentId]?.results || [];
    const examResults = document.getElementById('examResults');

    if (resultsData.length === 0) {
        examResults.innerHTML = '<p class="loading">No exam results available</p>';
        return;
    }

    let html = '';
    let totalMarks = 0;
    let totalPossible = 0;

    resultsData.forEach(item => {
        totalMarks += item.marks;
        totalPossible += item.total;

        html += `
            <div class="exam-item">
                <div class="exam-subject">${item.subject}</div>
                <div class="exam-type">${item.type}</div>
                <div class="exam-details">
                    <span class="exam-marks">${item.marks} / ${item.total}</span>
                    <span class="exam-grade">${item.grade}</span>
                </div>
            </div>
        `;
    });

    examResults.innerHTML = html;

    // Update average grade (approximate)
    const avgPercentage = ((totalMarks / totalPossible) * 100).toFixed(0);
    let avgGrade = 'F';
    if (avgPercentage >= 90) avgGrade = 'A+';
    else if (avgPercentage >= 80) avgGrade = 'A';
    else if (avgPercentage >= 70) avgGrade = 'B+';
    else if (avgPercentage >= 60) avgGrade = 'B';
    else if (avgPercentage >= 50) avgGrade = 'C';

    document.getElementById('avgGrade').textContent = avgGrade;
}

// ===== DISPLAY NOTICES =====
function displayNotices() {
    const noticesList = document.getElementById('noticesList');
    let html = '';

    // Show latest 5 notices
    allNotices.slice(0, 5).forEach(notice => {
        html += `
            <div class="notice-item ${notice.important ? 'important' : ''}">
                <span class="notice-category">${notice.category}</span>
                <div class="notice-title">${notice.title}</div>
                <div class="notice-date">${formatDate(notice.date)}</div>
            </div>
        `;
    });

    noticesList.innerHTML = html;
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== LOGOUT FUNCTION =====
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('studentData');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    }
}

// ===== INITIALIZE DASHBOARD =====
document.addEventListener('DOMContentLoaded', function () {
    // Load student data
    const studentData = loadStudentData();

    if (!studentData) return;

    // Display all data
    displayStudentInfo(studentData);
    displayAttendance(studentData.studentId);
    displayExamResults(studentData.studentId);
    displayNotices();

    // Set upcoming exams (demo)
    document.getElementById('upcomingExams').textContent = '3';

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    console.log('=== DASHBOARD LOADED ===');
    console.log('Student:', studentData.fullName);
    console.log('Roll No:', studentData.studentId);
});
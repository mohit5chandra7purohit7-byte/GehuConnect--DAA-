// ============================================================
//  dashboard.js  — Simple Dashboard (Phase 2)
//  Fills profile card from localStorage / demo data
//  Handles hamburger sidebar toggle
// ============================================================

// ===== DEMO STUDENT DATA (hardcoded for Phase 2) =====
const DEMO_STUDENTS = {
    '2419260': {
        fullName:   'MOHIT CHANDRA PUROHIT',
        email:      '2419260@gehu.ac.in',
        semester:   4,
        section:    'CS1',
        enrollNo:   'PV-24190260',
        fatherName: 'BUDHI PRASAD',
        motherName: 'LAXMI DEVI',
        dob:        '21/12/2006'
    },
    '2418628': {
        fullName:   'MAITRI GOYAL',
        email:      '2418628@gehu.ac.in',
        semester:   4,
        section:    'CS1',
        enrollNo:   'PV-24186280',
        fatherName: '—',
        motherName: '—',
        dob:        '—'
    },
    '2419475': {
        fullName:   'MANISHA BISHT',
        email:      '2419475@gehu.ac.in',
        semester:   4,
        section:    'CS1',
        enrollNo:   'PV-24194750',
        fatherName: '—',
        motherName: '—',
        dob:        '—'
    },
    '2418996': {
        fullName:   'SHYAMLI BISHT',
        email:      '2418996@gehu.ac.in',
        semester:   4,
        section:    'CS1',
        enrollNo:   'PV-24189960',
        fatherName: '—',
        motherName: '—',
        dob:        '—'
    }
};

// ===== POPULATE PROFILE =====
function populateProfile(studentId) {
    const data = DEMO_STUDENTS[studentId] || {};

    // Banner
    const name = data.fullName || 'STUDENT';
    document.getElementById('profileName').textContent  = name;
    document.getElementById('profileRoll').textContent  = studentId;
    document.getElementById('profileEmail').textContent = data.email || studentId + '@gehu.ac.in';

    // Initials avatar
    const parts    = name.trim().split(' ');
    const initials = (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
    document.getElementById('avatarInitials').textContent = initials.toUpperCase();

    // ID card table
    document.getElementById('fatherName').textContent   = data.fatherName || '—';
    document.getElementById('motherName').textContent   = data.motherName || '—';
    document.getElementById('dob').textContent          = data.dob        || '—';
    document.getElementById('officialEmail').textContent = (name.replace(/\s+/g, '').toUpperCase() + '.' + studentId + '@GEHU.AC.IN');
    document.getElementById('yearSem').textContent      = data.semester   || '—';
    document.getElementById('sectionCell').textContent  = data.section    || '—';
    document.getElementById('enrollNo').textContent     = data.enrollNo   || '—';
    document.getElementById('uniRoll').textContent      = studentId;
}

// ===== HAMBURGER SIDEBAR =====
function initSidebar() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar   = document.getElementById('sidebar');
    const overlay   = document.getElementById('overlay');
    const closeBtn  = document.getElementById('closeBtn');

    function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('open'); }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

    hamburger.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click',  closeSidebar);
    overlay.addEventListener('click',   closeSidebar);
}

// ===== LOGOUT =====
function initLogout() {
    document.getElementById('logoutLink').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('studentData');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        }
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {

    // Get logged-in student from localStorage
    let studentId = '2419260'; // default for demo
    const stored  = localStorage.getItem('studentData');

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            studentId    = parsed.studentId || studentId;
        } catch (e) { /* ignore */ }
    }

    populateProfile(studentId);
    initSidebar();
    initLogout();
});
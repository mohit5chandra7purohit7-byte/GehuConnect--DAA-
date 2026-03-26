// ============================================================
//  clubs.js — Shyamali's Module (Phase 2)
//  Clubs & Societies page with vacancy info
// ============================================================

const CLUBS = [
    {
        id: 1, icon: '💻', name: 'Coding Club',
        head: 'Faculty Advisor: Dr. S. Bhatt',
        desc: 'Competitive programming, DSA workshops, hackathons, and open-source contributions. Hosts weekly coding contests on Codeforces.',
        members: 48, capacity: 60, vacancies: 12, tags: ['Competitive', 'DSA', 'Open Source']
    },
    {
        id: 2, icon: '🤖', name: 'Robotics Club',
        head: 'Faculty Advisor: Dr. P. Verma',
        desc: 'Hardware + software robotics projects. Participates in Robocon. Works with Arduino, Raspberry Pi, and ROS.',
        members: 27, capacity: 30, vacancies: 3, tags: ['Hardware', 'IoT', 'AI']
    },
    {
        id: 3, icon: '📚', name: 'Literary Club',
        head: 'Faculty Advisor: Ms. A. Singh',
        desc: 'Debates, creative writing, poetry slams, and the college magazine "The Pen". Enhances communication and writing skills.',
        members: 32, capacity: 50, vacancies: 18, tags: ['Writing', 'Debate', 'Magazine']
    },
    {
        id: 4, icon: '🎵', name: 'Music Club',
        head: 'Faculty Advisor: Mr. R. Negi',
        desc: 'Classical and modern music, band formation, college events performances. Regular jam sessions and annual music night.',
        members: 28, capacity: 30, vacancies: 2, tags: ['Classical', 'Band', 'Events']
    },
    {
        id: 5, icon: '📸', name: 'Photography Club',
        head: 'Faculty Advisor: Ms. D. Rawat',
        desc: 'Campus photography, photo walks, editing workshops using Lightroom and Photoshop. Manages college event photography.',
        members: 24, capacity: 40, vacancies: 16, tags: ['DSLR', 'Editing', 'Events']
    },
    {
        id: 6, icon: '🎤', name: 'Debate Club',
        head: 'Faculty Advisor: Dr. M. Joshi',
        desc: 'Parliamentary debates, MUNs, elocution contests. Consistently wins inter-college debate championships.',
        members: 20, capacity: 25, vacancies: 5, tags: ['MUN', 'Public Speaking', 'GD']
    },
    {
        id: 7, icon: '🌿', name: 'NSS Unit',
        head: 'Faculty Advisor: Dr. S. Rawat',
        desc: 'National Service Scheme — blood donation camps, tree plantation, rural outreach, and disaster management awareness.',
        members: 40, capacity: 60, vacancies: 20, tags: ['Social Work', 'Community', 'Volunteers']
    },
    {
        id: 8, icon: '🎭', name: 'Dance Club',
        head: 'Faculty Advisor: Ms. P. Arya',
        desc: 'Classical, folk and contemporary dance forms. Performs at college fests, cultural nights and inter-college events.',
        members: 30, capacity: 30, vacancies: 0, tags: ['Classical', 'Contemporary', 'Folk']
    }
];

let appliedClubs = new Set(JSON.parse(localStorage.getItem('appliedClubs') || '[]'));
let currentFilter = 'all';
let currentSearch = '';
let pendingApplyId = null;

// ===== VACANCY STATUS =====
function getVacancyStatus(club) {
    if (club.vacancies === 0) return 'full';
    if (club.vacancies <= 5)  return 'limited';
    return 'open';
}

// ===== RENDER CLUBS =====
function renderClubs() {
    const grid = document.getElementById('clubsGrid');
    const searchLower = currentSearch.toLowerCase();

    let filtered = CLUBS.filter(c => {
        const matchSearch = !searchLower ||
            c.name.toLowerCase().includes(searchLower) ||
            c.desc.toLowerCase().includes(searchLower) ||
            c.tags.some(t => t.toLowerCase().includes(searchLower));

        const status = getVacancyStatus(c);
        const matchFilter = currentFilter === 'all' || status === currentFilter;

        return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><div style="font-size:2rem">🔍</div><p>No clubs match your search.</p></div>`;
        return;
    }

    grid.innerHTML = filtered.map(club => {
        const status  = getVacancyStatus(club);
        const applied = appliedClubs.has(club.id);
        const fillPct = Math.round((club.members / club.capacity) * 100);

        const vacancyLabel = club.vacancies === 0
            ? '🔴 Full — Waitlist Only'
            : club.vacancies <= 5
                ? `🟡 Only ${club.vacancies} spot${club.vacancies > 1 ? 's' : ''} left`
                : `🟢 ${club.vacancies} open spots`;

        return `
        <div class="club-card">
            <div class="club-icon">${club.icon}</div>
            <div class="club-name">${club.name}</div>
            <div class="club-head">${club.head}</div>
            <div class="club-desc">${club.desc}</div>
            <div class="club-stats">
                <div class="stat"><strong>${club.members}</strong> members</div>
                <div class="stat"><strong>${fillPct}%</strong> full</div>
            </div>
            <div style="height:5px;background:#20243a;border-radius:3px;margin-bottom:10px;overflow:hidden;">
                <div style="height:100%;width:${fillPct}%;background:${fillPct >= 95 ? 'var(--danger)' : fillPct >= 80 ? 'var(--warn)' : 'var(--safe)'};border-radius:3px;"></div>
            </div>
            <div>
                <span class="vacancy-badge ${status}">${vacancyLabel}</span>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                ${club.tags.map(t => `<span style="font-size:.7rem;padding:2px 8px;background:#20243a;border:1px solid #2d3352;border-radius:12px;color:#8892a4;">${t}</span>`).join('')}
            </div>
            <button class="apply-btn" ${applied ? 'disabled' : ''}
                onclick="startApply(${club.id})">
                ${applied ? '✅ Applied' : club.vacancies === 0 ? '🔔 Join Waitlist' : '➕ Apply to Join'}
            </button>
        </div>`;
    }).join('');
}

// ===== APPLY FLOW =====
function startApply(id) {
    const club = CLUBS.find(c => c.id === id);
    pendingApplyId = id;
    document.getElementById('modalTitle').textContent = `Apply to ${club.name}`;
    document.getElementById('modalBody').innerHTML = `
        <p style="color:#8892a4;font-size:.9rem;line-height:1.6">
            You are applying to join the <strong style="color:#e2e8f0">${club.name}</strong>.<br><br>
            ${club.vacancies === 0 ? '<span style="color:var(--warn)">⚠ No vacancies available. You will be added to the <strong>waitlist</strong>.</span>' : `Available spots: <strong style="color:var(--safe)">${club.vacancies}</strong>`}<br><br>
            Faculty In-charge: ${club.head}<br>
            Current members: ${club.members} / ${club.capacity}
        </p>`;
    document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    pendingApplyId = null;
}

// ===== LOAD STUDENT BADGE =====
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
    loadStudentBadge();
    renderClubs();

    // Search
    document.getElementById('searchInput').addEventListener('input', function () {
        currentSearch = this.value;
        renderClubs();
    });

    // Filter pills
    document.querySelectorAll('.pill').forEach(p => {
        p.addEventListener('click', function () {
            document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderClubs();
        });
    });

    // Confirm apply
    document.getElementById('confirmApply').addEventListener('click', function () {
        if (pendingApplyId !== null) {
            appliedClubs.add(pendingApplyId);
            localStorage.setItem('appliedClubs', JSON.stringify([...appliedClubs]));
        }
        closeModal();
        renderClubs();
    });

    document.getElementById('cancelApply').addEventListener('click', closeModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });
});

// ===================================
// script.js - UPDATED with Backend Connection
// ===================================

// ===== INSPIRATIONAL QUOTES =====
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction."
];

// ===== GLOBAL VARIABLES =====
let currentCaptcha = '';

// ===== BACKEND API URL =====
// Change this to your actual backend URL
const API_URL = 'http://localhost:8080/gehu-connect/login';

// ===== GENERATE RANDOM QUOTE =====
function generateQuote() {
    const quoteElement = document.getElementById('quote');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
}

// ===== GENERATE CAPTCHA =====
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';

    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    currentCaptcha = captcha;
    document.getElementById('captchaText').textContent = captcha;
    document.getElementById('captchaInput').value = '';
}

// ===== VALIDATE LOGIN FORM (WITH BACKEND) =====
async function validateLogin(event) {
    event.preventDefault();

    // Get form values
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.querySelector('.login-btn');

    // Clear previous error
    errorMsg.textContent = '';
    errorMsg.style.color = '#e74c3c';

    // Front-end validation
    if (studentId === '') {
        errorMsg.textContent = 'Please enter your Student Roll No';
        return false;
    }

    if (password === '') {
        errorMsg.textContent = 'Please enter your password';
        return false;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters';
        return false;
    }

    // Captcha validation
    if (captchaInput !== currentCaptcha) {
        errorMsg.textContent = 'Incorrect captcha. Please try again.';
        generateCaptcha();
        return false;
    }

    // Show loading state
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    try {
        // Send login request to backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `studentId=${encodeURIComponent(studentId)}&password=${encodeURIComponent(password)}`
        });

        const data = await response.json();

        if (data.success) {
            // LOGIN SUCCESS
            errorMsg.style.color = '#27ae60';
            errorMsg.textContent = 'Login successful! Redirecting...';

            // Save student data to localStorage (for dashboard to use)
            localStorage.setItem('studentData', JSON.stringify(data.student));
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'student_dashboard.html';
            }, 1000);

        } else {
            // LOGIN FAILED
            errorMsg.textContent = data.message || 'Invalid credentials';
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
            generateCaptcha();
        }

    } catch (error) {
        // NETWORK ERROR or Backend not running
        console.error('Login error:', error);

        // FALLBACK: Use demo mode if backend is not available
        if (useDemoMode(studentId, password)) {
            errorMsg.style.color = '#27ae60';
            errorMsg.textContent = 'Login successful! (Demo Mode) Redirecting...';

            setTimeout(() => {
                window.location.href = 'student_dashboard.html';
            }, 1000);
        } else {
            errorMsg.textContent = 'Server error. Please try again later.';
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    }

    return false;
}

// ===== DEMO MODE (Fallback when backend is not running) =====
function useDemoMode(studentId, password) {
    // Demo accounts for testing (password = roll number)
    const demoAccounts = {
        '2418628': { password: '2418628', name: 'Maitri Goyal', course: 'B.Tech CSE', semester: 4 },
        '2419260': { password: '2419260', name: 'Mohit Purohit', course: 'B.Tech CSE', semester: 4 },
        '2419475': { password: '2419475', name: 'Manisha Bisht', course: 'B.Tech CSE', semester: 4 },
        '2418996': { password: '2418996', name: 'Shyamli Bisht', course: 'B.Tech CSE', semester: 4 }
    };

    if (demoAccounts[studentId] && demoAccounts[studentId].password === password) {
        // Create demo student data
        const studentData = {
            studentId: studentId,
            fullName: demoAccounts[studentId].name,
            email: studentId + '@gehu.ac.in',
            course: demoAccounts[studentId].course,
            semester: demoAccounts[studentId].semester,
            section: 'A',
            isDemoMode: true
        };

        localStorage.setItem('studentData', JSON.stringify(studentData));
        localStorage.setItem('isLoggedIn', 'true');

        return true;
    }

    return false;
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function () {
    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Redirect to dashboard if already logged in
        // Uncomment this line when dashboard is ready:
        // window.location.href = 'student_dashboard.html';
    }

    // Generate initial quote and captcha
    generateQuote();
    generateCaptcha();

    // New Quote Button
    document.getElementById('newQuoteBtn').addEventListener('click', generateQuote);

    // Refresh Captcha Button
    document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);

    // Form Submit
    document.getElementById('loginForm').addEventListener('submit', validateLogin);

    // Enter key support for captcha
    document.getElementById('captchaInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validateLogin(e);
        }
    });
});

// ===== DEMO CREDENTIALS (Console Log) =====
console.log('=== GEHU CONNECT - LOGIN SYSTEM ===');
console.log('Demo Accounts (when backend is not running):');
console.log('Roll No: 2418628, Password: 2418628 (Maitri Goyal)');
console.log('Roll No: 2419260, Password: 2419260 (Mohit Purohit)');
console.log('Roll No: 2419475, Password: 2419475 (Manisha Bisht)');
console.log('Roll No: 2418996, Password: 2418996 (Shyamli Bisht)');
console.log('=====================================');
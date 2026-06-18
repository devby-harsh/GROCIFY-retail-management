const API_URL = '/api';

const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = 'dashboard.html';  // Redirect to dashboard after successful login
        } else {
            alert(data.message || 'The credentials provided do not match our records.');
        }
    } catch (err) {
        console.error(err);
        alert('We encountered a temporary connection issue. Please try again.');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Your account has been successfully created. Welcome to GROCIFY.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration was not successful. Please verify your details.');
        }
    } catch (err) {
        console.error(err);
        alert('A network error occurred. Please ensure your connection is stable.');
    }
};

const logout = (e) => {
    if (e) e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'dashboard.html';
};

const updateNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userNav = document.getElementById('user-nav');
    const adminLink = document.getElementById('admin-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        if (userNav) {
            userNav.innerHTML = `<span style="font-weight: 600; color: var(--primary); font-size: 0.9rem; margin-right: 1.5rem;">Hello, ${user.name}</span>`;
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', logout);
        }
        if (adminLink && user.role === 'admin') {
            adminLink.style.display = 'inline-block';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateNav();
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
});

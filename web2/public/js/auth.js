// Auth state management
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
const API_URL = 'http://localhost:3000/api';

// Update UI based on auth state
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const myBookingsLink = document.querySelector('[data-page="my-bookings"]');

    if (currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        myBookingsLink.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        myBookingsLink.classList.add('hidden');
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        currentUser = data.user;

        // Update UI and navigate to home
        updateAuthUI();
        navigateTo('home');
        showAlert('Login successful!', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, address, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        currentUser = data.user;

        // Update UI and navigate to home
        updateAuthUI();
        navigateTo('home');
        showAlert('Registration successful!', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser = null;

    // Update UI and navigate to home
    updateAuthUI();
    navigateTo('home');
    showAlert('Logged out successfully', 'success');
});

// Show alert message
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Add alert to the top of the main content
    const mainContent = document.getElementById('mainContent');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize auth state
updateAuthUI(); 
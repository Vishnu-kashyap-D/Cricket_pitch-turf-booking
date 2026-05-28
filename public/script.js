// DOM Elements
const branchContainer = document.getElementById('branchContainer');
const bookingForm = document.getElementById('bookingForm');
const pitchSelect = document.getElementById('pitchSelect');
const bookingDateInput = document.getElementById('bookingDate');
const wholeDayBtn = document.getElementById('wholeDayBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userProfile = document.querySelector('.user-profile');
const userName = document.getElementById('userName');
const bookingsContainer = document.getElementById('bookingsContainer');

// API URL
const API_URL = 'http://localhost:5000/api';

// Authentication state
let currentUser = null;
let authToken = localStorage.getItem('token');

// Check authentication status on load
if (authToken) {
    fetchUserProfile();
}

// Fetch and populate pitches
async function fetchPitches() {
    try {
        const response = await fetch(`${API_URL}/pitches`);
        if (!response.ok) {
            throw new Error('Failed to fetch pitches');
        }
        const pitches = await response.json();
        
        // Clear existing options except the first one
        pitchSelect.innerHTML = '<option value="">Choose a pitch...</option>';
        
        // Add pitch options
        pitches.forEach(pitch => {
            const option = document.createElement('option');
            option.value = pitch.Pitch_ID;
            option.textContent = `${pitch.Pitch_type} (₹${pitch.Books_per_hour}/hour)`;
            option.disabled = pitch.Status === 'Not Available';
            pitchSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching pitches:', error);
        showNotification('Error loading pitches. Please try again later.', 'error');
    }
}

// Modal handling
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
});

// Close modals when clicking the X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('token', authToken);
        currentUser = data.user;
        updateUIForLoggedInUser();
        loginModal.style.display = 'none';
        showNotification('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Error during login. Please check your connection.', 'error');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        phone: document.getElementById('registerPhone').value,
        address: document.getElementById('registerAddress').value
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
        }

        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('token', authToken);
        currentUser = data.user;
        updateUIForLoggedInUser();
        registerModal.style.display = 'none';
        showNotification('Registration successful!', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message || 'Error during registration. Please check your connection.', 'error');
    }
});

// Logout handling
logoutBtn.addEventListener('click', () => {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('token');
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully', 'info');
});

// Fetch user profile
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateUIForLoggedInUser();
        } else {
            throw new Error('Failed to fetch user profile');
        }
    } catch (error) {
        console.error('Profile fetch error:', error);
        authToken = null;
        localStorage.removeItem('token');
        updateUIForLoggedOutUser();
    }
}

// Fetch user bookings
async function fetchUserBookings() {
    if (!authToken) {
        console.log('No auth token found');
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <p>Please login to view your bookings.</p>
            </div>
        `;
        return;
    }

    try {
        console.log('Fetching bookings with token:', authToken);
        const response = await fetch(`${API_URL}/bookings/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Token expired or invalid');
                authToken = null;
                localStorage.removeItem('token');
                updateUIForLoggedOutUser();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.error || 'Failed to fetch bookings');
        }

        displayBookings(data);
    } catch (error) {
        console.error('Error in fetchUserBookings:', error);
        showNotification(error.message || 'Error loading bookings. Please try again later.', 'error');
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <p>${error.message || 'Error loading bookings. Please try again later.'}</p>
            </div>
        `;
    }
}

// Display bookings
function displayBookings(bookings) {
    console.log('Displaying bookings:', bookings);
    
    if (!bookings || !bookings.length) {
        console.log('No bookings to display');
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <p>You haven't made any bookings yet.</p>
                <p>Book a pitch to get started!</p>
            </div>
        `;
        return;
    }

    try {
        bookingsContainer.innerHTML = bookings.map(booking => {
            console.log('Processing booking:', booking);
            return `
                <div class="booking-card">
                    <div class="booking-header">
                        <h3 class="booking-title">${booking.pitch_type || 'Cricket Pitch'}</h3>
                        <span class="booking-status status-${(booking.status || 'Available').toLowerCase()}">${booking.status || 'Available'}</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>Location:</strong> ${booking.location || 'Not specified'}</p>
                        <p><strong>Entry Time:</strong> ${new Date(booking.entry_time).toLocaleString()}</p>
                        <p><strong>Exit Time:</strong> ${new Date(booking.exit_time).toLocaleString()}</p>
                        <p><strong>Total Amount:</strong> ₹${booking.total_amount || 0}</p>
                    </div>
                    ${(booking.status || '').toLowerCase() === 'available' ? `
                        <div class="booking-actions">
                            <button class="btn-cancel" onclick="cancelBooking(${booking.booking_id})">Cancel Booking</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying bookings:', error);
        bookingsContainer.innerHTML = `
            <div class="no-bookings">
                <p>Error displaying bookings. Please try again later.</p>
            </div>
        `;
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        showNotification('Booking cancelled successfully', 'success');
        fetchUserBookings(); // Refresh bookings
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification('Error cancelling booking. Please try again later.', 'error');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = currentUser.name;
    fetchUserBookings(); // Fetch bookings when user logs in
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    userProfile.style.display = 'none';
    userName.textContent = '';
    bookingsContainer.innerHTML = `
        <div class="no-bookings">
            <p>Please login to view your bookings.</p>
        </div>
    `;
}

// Fetch and display branches
async function fetchBranches() {
    try {
        const response = await fetch(`${API_URL}/branches`);
        const branches = await response.json();
        
        branchContainer.innerHTML = branches.map(branch => `
            <div class="branch-card">
                <i class="fas fa-map-marker-alt"></i>
                <h3>${branch.Location}</h3>
                <p>${branch.Contact_Number}</p>
                ${branch.Contact_Number_2 ? `<p>${branch.Contact_Number_2}</p>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching branches:', error);
        showNotification('Error loading branches. Please try again later.', 'error');
    }
}

// Handle booking form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!authToken) {
        showNotification('Please login to make a booking', 'error');
        loginModal.style.display = 'block';
        return;
    }

    const bookingDate = document.getElementById('bookingDate').value;
    const entryTimeVal = document.getElementById('entryTime').value;
    const exitTimeVal = document.getElementById('exitTime').value;

    if (!bookingDate || !entryTimeVal || !exitTimeVal) {
        showNotification('Please provide booking date and times', 'error');
        return;
    }

    // Use ISO format for comparison: YYYY-MM-DDTHH:MM:SS
    const entryISO = `${bookingDate}T${entryTimeVal}:00`;
    const exitISO = `${bookingDate}T${exitTimeVal}:00`;

    if (new Date(entryISO) >= new Date(exitISO)) {
        showNotification('Exit time must be after entry time (same day)', 'error');
        return;
    }

    const formData = {
        pitch_id: pitchSelect.value,
        entry_time: entryISO.replace('T', ' '),
        exit_time: exitISO.replace('T', ' ')
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Booking successful!', 'success');
            bookingForm.reset();
            fetchUserBookings(); // Refresh bookings after successful booking
        } else {
            throw new Error(data.error || 'Booking failed');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        showNotification(error.message || 'Error creating booking. Please try again.', 'error');
    }
});

// Whole day booking (12 hours) quick action
if (wholeDayBtn) {
    wholeDayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dateVal = bookingDateInput ? bookingDateInput.value : document.getElementById('bookingDate').value;
        if (!dateVal) {
            showNotification('Please select a booking date first', 'error');
            return;
        }
        // Set a 12-hour slot (08:00 - 20:00)
        document.getElementById('entryTime').value = '08:00';
        document.getElementById('exitTime').value = '20:00';
        // submit form
        bookingForm.requestSubmit();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        background-color: #2ecc71;
    }

    .notification.error {
        background-color: #e74c3c;
    }

    .notification.info {
        background-color: #3498db;
    }

    .available {
        color: #2ecc71;
    }

    .unavailable {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    fetchBranches();
    fetchPitches();
}); 

// Reviews modal behavior
const reviewsModal = document.getElementById('reviewsModal');
const reviewsList = document.getElementById('reviewsList');
const reviewsModalTitle = document.getElementById('reviewsModalTitle');
const closeReviews = document.getElementById('closeReviews');

function openReviewsModal(title, reviewsHtml) {
    reviewsModalTitle.textContent = `Reviews — ${title}`;
    reviewsList.innerHTML = reviewsHtml;
    reviewsModal.style.display = 'block';
}

function closeReviewsModal() {
    reviewsModal.style.display = 'none';
    reviewsList.innerHTML = '';
}

closeReviews.addEventListener('click', closeReviewsModal);

// Close when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === reviewsModal) closeReviewsModal();
});

// Attach click handlers to view-reviews links (works for static and dynamic content)
function attachReviewHandlers() {
    document.querySelectorAll('.btn-view-reviews').forEach(btn => {
        btn.removeEventListener('click', viewReviewsHandler);
        btn.addEventListener('click', viewReviewsHandler);
    });
}

function viewReviewsHandler(e) {
    e.preventDefault();
    const link = e.currentTarget;
    const pitchCard = link.closest('.pitch-card');
    const titleEl = pitchCard.querySelector('.pitch-info h3');
    const title = titleEl ? titleEl.textContent.trim() : 'Pitch';

    // collect review cards inside this pitch card
    const reviewCards = pitchCard.querySelectorAll('.review-card');
    if (!reviewCards || reviewCards.length === 0) {
        openReviewsModal(title, '<p>No reviews available yet.</p>');
        return;
    }

    const html = Array.from(reviewCards).map(rc => {
        const img = rc.querySelector('.review-photo') ? rc.querySelector('.review-photo').src : '';
        const name = rc.querySelector('.reviewer-name') ? rc.querySelector('.reviewer-name').textContent : 'Anonymous';
        const text = rc.querySelector('.review-text') ? rc.querySelector('.review-text').textContent : '';

        return `
            <div class="review-full">
                <img src="${img}" alt="${name}">
                <div class="review-body">
                    <div class="reviewer-name">${name}</div>
                    <div class="review-text">${text}</div>
                </div>
            </div>
        `;
    }).join('');

    openReviewsModal(title, html);
}

// Re-attach after DOM ready
function attachBookingButtons() {
    document.querySelectorAll('.btn-direct-book').forEach(btn => {
        btn.removeEventListener('click', directBookHandler);
        btn.addEventListener('click', directBookHandler);
    });
}

function directBookHandler(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const pitchId = btn.dataset.pitchId;
    const pitchCard = btn.closest('.pitch-card');
    const titleEl = pitchCard ? pitchCard.querySelector('.pitch-info h3') : null;
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // Try to select existing option by value or by matching id in text
    let matched = Array.from(pitchSelect.options).find(o => o.value == pitchId || o.textContent.includes(pitchId));
    if (!matched) {
        // create a new option and select it
        const opt = document.createElement('option');
        opt.value = pitchId;
        opt.textContent = titleText ? `${titleText} (${pitchId})` : pitchId;
        pitchSelect.appendChild(opt);
        pitchSelect.value = opt.value;
    } else {
        pitchSelect.value = matched.value;
    }

    // Scroll to booking form and focus date
    const bookingSection = document.getElementById('booking-form');
    if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) dateInput.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    attachReviewHandlers();
    attachBookingButtons();
});

// If pitches are loaded dynamically later, call attachReviewHandlers() again


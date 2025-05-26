// Navigation
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });

    // Load page-specific content
    switch (pageId) {
        case 'pitches':
            loadPitches();
            break;
        case 'my-bookings':
            loadMyBookings();
            break;
    }
}

// Add click event listeners to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            navigateTo(pageId);
        }
    });
});

// Modal functionality
const modal = document.getElementById('bookingModal');
const closeBtn = document.querySelector('.close');

function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking the close button or outside the modal
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Format date and time
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        showAlert(error.message);
        throw error;
    }
}

// Initialize date picker with today's date
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const datePicker = document.getElementById('bookingDate');
    if (datePicker) {
        datePicker.value = today;
        datePicker.min = today;
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .step, .testimonial-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Initialize animations
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Counter animation for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            if (element.nextElementSibling?.classList.contains('stat-label') && 
                element.textContent.includes('K')) {
                element.textContent = target + 'K+';
            } else if (element.textContent.includes('.')) {
                element.textContent = target + '★';
            } else {
                element.textContent = target + '+';
            }
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Animate stats when they come into view
const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseFloat(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelector('.hero-stats')?.forEach(stats => {
    statsObserver.observe(stats);
});

// Add loading animation for buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('loading');
        setTimeout(() => {
            this.classList.remove('loading');
        }, 1000);
    });
});

// Gallery Filters
const filterGallery = (filter) => {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

// Initialize gallery filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterGallery(btn.dataset.filter);
    });
});

// Gallery lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                <button class="close-lightbox"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                lightbox.remove();
            }
        });
    });
});

// Calendar functionality
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.updateCalendarHeader();
        this.renderCalendar();
        this.attachEventListeners();
    }

    updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderCalendar() {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            grid.appendChild(document.createElement('div'));
        }

        // Add days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            // Add available class randomly (for demo purposes)
            if (Math.random() > 0.3) {
                dayElement.classList.add('available');
            }

            dayElement.addEventListener('click', () => this.selectDate(day));
            grid.appendChild(dayElement);
        }
    }

    selectDate(day) {
        const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        this.selectedDate = selectedDate;

        // Update visual selection
        document.querySelectorAll('.calendar-day').forEach(el => {
            el.classList.remove('selected');
            if (el.textContent == day) {
                el.classList.add('selected');
            }
        });

        this.showTimeSlots();
    }

    showTimeSlots() {
        const timeSlots = document.getElementById('timeSlots');
        timeSlots.innerHTML = '';

        // Generate time slots from 6 AM to 9 PM
        for (let hour = 6; hour <= 21; hour++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            if (Math.random() > 0.3) slot.classList.add('available');
            
            const timeString = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
            slot.textContent = timeString;

            slot.addEventListener('click', () => {
                if (slot.classList.contains('available')) {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                }
            });

            timeSlots.appendChild(slot);
        }
    }

    attachEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateCalendarHeader();
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateCalendarHeader();
            this.renderCalendar();
        });
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookingCalendar();
});

// Virtual Tour functionality
document.querySelector('.tour-btn')?.addEventListener('click', () => {
    const tourPreview = document.querySelector('.tour-preview');
    tourPreview.classList.add('tour-active');
    
    // Here you would typically initialize a 360-degree viewer library
    // For demo purposes, we'll just add a class that rotates the image
    tourPreview.style.transform = 'rotate3d(0, 1, 0, 360deg)';
    tourPreview.style.transition = 'transform 20s linear';
});

// Pitches Page Functionality
const filtersModal = document.getElementById('filtersModal');
const filterBtn = document.querySelector('.filter-btn');
const closeFiltersBtn = filtersModal?.querySelector('.close');
const pitchSearch = document.getElementById('pitchSearch');
const pitchTypeSelect = document.getElementById('pitchType');
const priceRange = document.getElementById('priceRange');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');

// Open/Close Filters Modal
filterBtn?.addEventListener('click', () => {
    filtersModal.style.display = 'block';
});

closeFiltersBtn?.addEventListener('click', () => {
    filtersModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === filtersModal) {
        filtersModal.style.display = 'none';
    }
});

// Search functionality
pitchSearch?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const pitchCards = document.querySelectorAll('.pitch-card');

    pitchCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.pitch-info p').textContent.toLowerCase();
        const type = card.dataset.type.toLowerCase();

        if (title.includes(searchTerm) || location.includes(searchTerm) || type.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
});

// Filter by type
pitchTypeSelect?.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    const pitchCards = document.querySelectorAll('.pitch-card');

    pitchCards.forEach(card => {
        if (selectedType === 'all' || card.dataset.type === selectedType) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
});

// Price range slider
if (priceRange && minPriceInput && maxPriceInput) {
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        maxPriceInput.value = value;
        filterByPrice();
    });

    minPriceInput.addEventListener('input', filterByPrice);
    maxPriceInput.addEventListener('input', filterByPrice);
}

function filterByPrice() {
    const min = parseInt(minPriceInput.value) || 0;
    const max = parseInt(maxPriceInput.value) || 10000;
    const pitchCards = document.querySelectorAll('.pitch-card');

    pitchCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));

        if (price >= min && price <= max) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Facility checkboxes
document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterByFacilities);
});

function filterByFacilities() {
    const selectedFacilities = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(cb => cb.value);

    const pitchCards = document.querySelectorAll('.pitch-card');

    pitchCards.forEach(card => {
        const facilities = Array.from(card.querySelectorAll('.pitch-features span'))
            .map(span => span.textContent.toLowerCase());

        const hasAllFacilities = selectedFacilities.every(facility => 
            facilities.some(f => f.includes(facility.toLowerCase()))
        );

        if (selectedFacilities.length === 0 || hasAllFacilities) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Reset filters
document.querySelector('.reset-btn')?.addEventListener('click', () => {
    // Reset search
    if (pitchSearch) pitchSearch.value = '';

    // Reset type filter
    if (pitchTypeSelect) pitchTypeSelect.value = 'all';

    // Reset price range
    if (priceRange) priceRange.value = 10000;
    if (minPriceInput) minPriceInput.value = '';
    if (maxPriceInput) maxPriceInput.value = '';

    // Reset checkboxes
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Show all pitches
    document.querySelectorAll('.pitch-card').forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease forwards';
    });
});

// Apply filters
document.querySelector('.apply-btn')?.addEventListener('click', () => {
    filterByPrice();
    filterByFacilities();
    filtersModal.style.display = 'none';
}); 
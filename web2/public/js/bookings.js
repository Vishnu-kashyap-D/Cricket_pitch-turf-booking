// Load available pitches
async function loadPitches() {
    try {
        const pitches = await apiRequest('/pitches');
        const pitchesGrid = document.getElementById('pitchesList');
        pitchesGrid.innerHTML = '';

        pitches.forEach(pitch => {
            const pitchCard = document.createElement('div');
            pitchCard.className = 'pitch-card';
            pitchCard.innerHTML = `
                <h3>${pitch.pitch_type} - ${pitch.pitch_no}</h3>
                <p><strong>Club:</strong> ${pitch.club}</p>
                <p><strong>Location:</strong> ${pitch.location}</p>
                <p><strong>Price:</strong> ${formatCurrency(pitch.price_per_hour)}/hour</p>
                <button class="btn-primary" onclick="showBookingModal(${JSON.stringify(pitch).replace(/"/g, '&quot;')})">
                    Book Now
                </button>
            `;
            pitchesGrid.appendChild(pitchCard);
        });
    } catch (error) {
        console.error('Error loading pitches:', error);
    }
}

// Load user's bookings
async function loadMyBookings() {
    if (!currentUser) {
        navigateTo('login');
        return;
    }

    try {
        const bookings = await apiRequest('/bookings/my-bookings');
        const bookingsGrid = document.getElementById('bookingsList');
        bookingsGrid.innerHTML = '';

        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            bookingCard.innerHTML = `
                <h3>${booking.pitch_type} - ${booking.pitch_no}</h3>
                <p><strong>Date:</strong> ${formatDate(booking.entry_time)}</p>
                <p><strong>Time:</strong> ${formatTime(booking.entry_time)} - ${formatTime(booking.exit_time)}</p>
                <p><strong>Amount:</strong> ${formatCurrency(booking.amount)}</p>
                <p><strong>Status:</strong> <span class="status ${booking.booking_status.toLowerCase()}">${booking.booking_status}</span></p>
                ${booking.booking_status === 'Pending' ? `
                    <button class="btn-primary" onclick="processPayment(${booking.booking_id})">Pay Now</button>
                    <button class="btn-secondary" onclick="cancelBooking(${booking.booking_id})">Cancel</button>
                ` : ''}
            `;
            bookingsGrid.appendChild(bookingCard);
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Show booking modal with available slots
async function showBookingModal(pitch) {
    if (!currentUser) {
        navigateTo('login');
        return;
    }

    const date = document.getElementById('bookingDate').value;
    const availability = await apiRequest(`/pitches/availability/${pitch.pitch_id}/${date}`);
    
    const timeSelect = document.getElementById('bookingTime');
    timeSelect.innerHTML = '';
    
    availability.slots.forEach(slot => {
        if (slot.available) {
            const option = document.createElement('option');
            option.value = slot.start;
            option.textContent = `${formatTime(slot.start)} - ${formatTime(slot.end)}`;
            timeSelect.appendChild(option);
        }
    });

    // Update price information
    document.getElementById('pricePerHour').textContent = formatCurrency(pitch.price_per_hour);
    updateTotalAmount(pitch.price_per_hour);

    // Store pitch data for booking
    timeSelect.dataset.pitchId = pitch.pitch_id;
    timeSelect.dataset.pricePerHour = pitch.price_per_hour;

    openModal();
}

// Update total amount when duration changes
document.getElementById('duration').addEventListener('change', function() {
    const pricePerHour = document.getElementById('bookingTime').dataset.pricePerHour;
    updateTotalAmount(pricePerHour);
});

function updateTotalAmount(pricePerHour) {
    const duration = document.getElementById('duration').value;
    const totalAmount = pricePerHour * duration;
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const pitchId = document.getElementById('bookingTime').dataset.pitchId;
    const startTime = document.getElementById('bookingTime').value;
    const duration = document.getElementById('duration').value;

    // Calculate end time
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + parseInt(duration));

    try {
        const booking = await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify({
                pitch_id: pitchId,
                entry_time: startTime,
                exit_time: endTime.toISOString()
            })
        });

        closeModal();
        showAlert('Booking created successfully!', 'success');
        processPayment(booking.booking_id);
    } catch (error) {
        console.error('Error creating booking:', error);
    }
});

// Process payment for a booking
async function processPayment(bookingId) {
    try {
        // Simulate payment gateway integration
        const paymentDetails = {
            payment_mode: 'Credit Card',
            transaction_id: 'TRANS_' + Date.now()
        };

        await apiRequest(`/payments/process/${bookingId}`, {
            method: 'POST',
            body: JSON.stringify(paymentDetails)
        });

        showAlert('Payment processed successfully!', 'success');
        loadMyBookings();
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

// Cancel a booking
async function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            await apiRequest(`/bookings/cancel/${bookingId}`, {
                method: 'PUT'
            });

            showAlert('Booking cancelled successfully!', 'success');
            loadMyBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    }
}

// Initialize date picker event listener
document.getElementById('bookingDate').addEventListener('change', () => {
    loadPitches();
}); 
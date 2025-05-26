import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createBooking,
    getCustomerBookings,
    updateBookingStatus,
    checkPitchAvailability
} from '../database.js';

const router = express.Router();

// Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const { pitch_id, entry_time, exit_time } = req.body;
        const customer_id = req.customer.customer_id;

        // Check pitch availability
        const isAvailable = await checkPitchAvailability(pitch_id, entry_time, exit_time);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Pitch is not available for the selected time slot'
            });
        }

        // Create booking
        const booking = await createBooking({
            customer_id,
            pitch_id,
            entry_time,
            exit_time
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking'
        });
    }
});

// Get customer's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const customer_id = req.customer.customer_id;
        const bookings = await getCustomerBookings(customer_id);

        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings'
        });
    }
});

// Update booking status
router.patch('/:bookingId/status', auth, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await updateBookingStatus(bookingId, status);

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            result
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
});

export default router; 
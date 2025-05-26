import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    getAvailablePitches,
    updatePitchStatus
} from '../database.js';

const router = express.Router();

// Get all available pitches
router.get('/', async (req, res) => {
    try {
        const pitches = await getAvailablePitches();
        res.json({
            success: true,
            pitches
        });
    } catch (error) {
        console.error('Get pitches error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pitches'
        });
    }
});

// Get pitch availability for a specific date
router.get('/availability/:pitchId/:date', async (req, res) => {
    try {
        const { pitchId, date } = req.params;
        const connection = await pool.getConnection();
        
        // Get all bookings for the specified date
        const [bookings] = await connection.query(
            `SELECT entry_time, exit_time 
             FROM bookings 
             WHERE pitch_id = ? 
             AND DATE(entry_time) = ? 
             AND booking_status = 'Confirmed'`,
            [pitchId, date]
        );

        // Get pitch details
        const [pitch] = await connection.query(
            'SELECT * FROM pitches WHERE pitch_id = ?',
            [pitchId]
        );

        connection.release();

        if (pitch.length === 0) {
            return res.status(404).json({ message: 'Pitch not found' });
        }

        // Create availability slots (assuming operating hours are 6 AM to 10 PM)
        const slots = [];
        for (let hour = 6; hour < 22; hour++) {
            const slotStart = `${date} ${hour.toString().padStart(2, '0')}:00:00`;
            const slotEnd = `${date} ${(hour + 1).toString().padStart(2, '0')}:00:00`;
            
            // Check if slot is booked
            const isBooked = bookings.some(booking => {
                const bookingStart = new Date(booking.entry_time);
                const bookingEnd = new Date(booking.exit_time);
                const slotStartDate = new Date(slotStart);
                const slotEndDate = new Date(slotEnd);
                return (
                    (bookingStart <= slotStartDate && bookingEnd > slotStartDate) ||
                    (bookingStart < slotEndDate && bookingEnd >= slotEndDate)
                );
            });

            slots.push({
                start: slotStart,
                end: slotEnd,
                available: !isBooked
            });
        }

        res.json({
            pitch: pitch[0],
            slots
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get available pitches for a branch
router.get('/available/:branchId', async (req, res) => {
    try {
        const { branchId } = req.params;
        const pitches = await getAvailablePitches(branchId);

        res.json({
            success: true,
            pitches
        });
    } catch (error) {
        console.error('Get available pitches error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available pitches'
        });
    }
});

// Update pitch status (admin only)
router.patch('/:pitchId/status', auth, async (req, res) => {
    try {
        const { pitchId } = req.params;
        const { status } = req.body;

        if (!['Available', 'Not Available'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await updatePitchStatus(pitchId, status);

        res.json({
            success: true,
            message: 'Pitch status updated successfully',
            result
        });
    } catch (error) {
        console.error('Update pitch status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update pitch status'
        });
    }
});

export default router; 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const connection = await pool.getConnection();
        const [employee] = await connection.query(
            'SELECT * FROM employees WHERE employee_id = ? AND position = "Admin"',
            [req.user.id]
        );
        connection.release();

        if (employee.length === 0) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings (admin only)
router.get('/bookings', [auth, isAdmin], async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [bookings] = await connection.query(
            `SELECT b.*, c.name as customer_name, c.phone, 
                    p.pitch_type, p.pitch_no, p.club,
                    py.amount, py.payment_status, py.payment_mode
             FROM bookings b
             JOIN customers c ON b.customer_id = c.customer_id
             JOIN pitches p ON b.pitch_id = p.pitch_id
             JOIN payments py ON b.booking_id = py.booking_id
             ORDER BY b.entry_time DESC`
        );
        connection.release();
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Manage pitches
router.post('/pitches', [auth, isAdmin], async (req, res) => {
    try {
        const { pitch_type, club, pitch_no, books_per_hour, price_per_hour, branch_id } = req.body;
        const connection = await pool.getConnection();

        const [result] = await connection.query(
            `INSERT INTO pitches (pitch_type, club, pitch_no, books_per_hour, price_per_hour, branch_id, status)
             VALUES (?, ?, ?, ?, ?, ?, 'Available')`,
            [pitch_type, club, pitch_no, books_per_hour, price_per_hour, branch_id]
        );

        connection.release();
        res.json({
            message: 'Pitch added successfully',
            pitch_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update pitch status
router.put('/pitches/:pitchId', [auth, isAdmin], async (req, res) => {
    try {
        const { status, price_per_hour } = req.body;
        const connection = await pool.getConnection();

        await connection.query(
            'UPDATE pitches SET status = ?, price_per_hour = ? WHERE pitch_id = ?',
            [status, price_per_hour, req.params.pitchId]
        );

        connection.release();
        res.json({ message: 'Pitch updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Manage branches
router.post('/branches', [auth, isAdmin], async (req, res) => {
    try {
        const { location, contact_number1, contact_number2 } = req.body;
        const connection = await pool.getConnection();

        const [result] = await connection.query(
            'INSERT INTO branches (location, contact_number1, contact_number2) VALUES (?, ?, ?)',
            [location, contact_number1, contact_number2]
        );

        connection.release();
        res.json({
            message: 'Branch added successfully',
            branch_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Manage employees
router.post('/employees', [auth, isAdmin], async (req, res) => {
    try {
        const { name, branch_id, position, salary } = req.body;
        const connection = await pool.getConnection();

        const [result] = await connection.query(
            'INSERT INTO employees (name, branch_id, position, salary) VALUES (?, ?, ?, ?)',
            [name, branch_id, position, salary]
        );

        connection.release();
        res.json({
            message: 'Employee added successfully',
            employee_id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get dashboard statistics
router.get('/dashboard', [auth, isAdmin], async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Get total bookings for today
        const [todayBookings] = await connection.query(
            `SELECT COUNT(*) as count FROM bookings 
             WHERE DATE(entry_time) = CURDATE()`
        );

        // Get total revenue for today
        const [todayRevenue] = await connection.query(
            `SELECT SUM(amount) as total FROM payments p
             JOIN bookings b ON p.booking_id = b.booking_id
             WHERE DATE(b.entry_time) = CURDATE()
             AND p.payment_status = 'Completed'`
        );

        // Get available pitches count
        const [availablePitches] = await connection.query(
            `SELECT COUNT(*) as count FROM pitches 
             WHERE status = 'Available'`
        );

        // Get upcoming bookings
        const [upcomingBookings] = await connection.query(
            `SELECT b.*, c.name as customer_name, p.pitch_type, p.pitch_no
             FROM bookings b
             JOIN customers c ON b.customer_id = c.customer_id
             JOIN pitches p ON b.pitch_id = p.pitch_id
             WHERE b.entry_time > NOW()
             AND b.booking_status = 'Confirmed'
             ORDER BY b.entry_time
             LIMIT 5`
        );

        connection.release();

        res.json({
            today_bookings: todayBookings[0].count,
            today_revenue: todayRevenue[0].total || 0,
            available_pitches: availablePitches[0].count,
            upcoming_bookings: upcomingBookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Vishnu@123',
    database: process.env.DB_NAME || 'cricket_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.stack);
        return;
    }
    console.log('✅ Connected to the database as id ' + connection.threadId);
    connection.release();
});

// Customer Functions
export const createCustomer = async (customerData) => {
    const { name, email_id, phone, address, password } = customerData;
    const query = 'INSERT INTO customers (name, email_id, phone, address, password) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        pool.query(query, [name, email_id, phone, address, password], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getCustomerByEmail = async (email) => {
    const query = 'SELECT * FROM customers WHERE email_id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [email], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};

// Pitch Functions
export const getAvailablePitches = async (branchId = null) => {
    let query = `
        SELECT p.*, b.location, b.contact_number1, b.contact_number2 
        FROM pitches p 
        JOIN branches b ON p.branch_id = b.branch_id 
        WHERE p.status = 'Available'
    `;
    const params = [];

    if (branchId) {
        query += ' AND p.branch_id = ?';
        params.push(branchId);
    }

    return new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const updatePitchStatus = async (pitchId, status) => {
    const query = 'UPDATE pitches SET status = ? WHERE pitch_id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [status, pitchId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Booking Functions
export const createBooking = async (bookingData) => {
    const { customer_id, pitch_id, entry_time, exit_time } = bookingData;
    const query = 'INSERT INTO bookings (customer_id, pitch_id, entry_time, exit_time) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        pool.query(query, [customer_id, pitch_id, entry_time, exit_time], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getCustomerBookings = async (customerId) => {
    const query = `
        SELECT b.*, p.pitch_type, p.pitch_no, br.location as branch_location 
        FROM bookings b 
        JOIN pitches p ON b.pitch_id = p.pitch_id 
        JOIN branches br ON p.branch_id = br.branch_id 
        WHERE b.customer_id = ?
    `;
    return new Promise((resolve, reject) => {
        pool.query(query, [customerId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const updateBookingStatus = async (bookingId, status) => {
    const query = 'UPDATE bookings SET booking_status = ? WHERE booking_id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [status, bookingId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Payment Functions
export const createPayment = async (paymentData) => {
    const { booking_id, amount, payment_mode, transaction_id } = paymentData;
    const query = 'INSERT INTO payments (booking_id, amount, payment_mode, transaction_id) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        pool.query(query, [booking_id, amount, payment_mode, transaction_id], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const updatePaymentStatus = async (paymentId, status) => {
    const query = 'UPDATE payments SET payment_status = ? WHERE payment_id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [status, paymentId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Branch Functions
export const getAllBranches = async () => {
    const query = 'SELECT * FROM branches';
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Employee Functions
export const getBranchEmployees = async (branchId) => {
    const query = 'SELECT * FROM employees WHERE branch_id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [branchId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Check pitch availability for a specific time slot
export const checkPitchAvailability = async (pitchId, entryTime, exitTime) => {
    const query = `
        SELECT COUNT(*) as count 
        FROM bookings 
        WHERE pitch_id = ? 
        AND booking_status = 'Confirmed'
        AND (
            (entry_time BETWEEN ? AND ?) 
            OR (exit_time BETWEEN ? AND ?)
            OR (? BETWEEN entry_time AND exit_time)
        )
    `;
    return new Promise((resolve, reject) => {
        pool.query(query, [pitchId, entryTime, exitTime, entryTime, exitTime, entryTime], (err, results) => {
            if (err) reject(err);
            resolve(results[0].count === 0);
        });
    });
};

export default pool; 
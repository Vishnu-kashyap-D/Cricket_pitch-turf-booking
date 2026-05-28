const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cricket'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload background image as base64 data URL
app.post('/api/upload-bg', (req, res) => {
    try {
        const { filename, data } = req.body;
        if (!filename || !data) return res.status(400).json({ error: 'filename and data required' });
        const matches = data.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!matches) return res.status(400).json({ error: 'invalid data URL' });
        const ext = matches[1].split('/')[1];
        const b64 = matches[2];
        const buffer = Buffer.from(b64, 'base64');
        const saveDir = path.join(__dirname, 'public', 'images');
        if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
        const savePath = path.join(saveDir, filename);
        fs.writeFile(savePath, buffer, (err) => {
            if (err) return res.status(500).json({ error: 'failed to save image' });
            return res.json({ ok: true, path: `/images/${filename}` });
        });
    } catch (err) {
        return res.status(500).json({ error: 'server error' });
    }
});

// Authentication Routes
app.post('/api/register', async (req, res) => {
    console.log('Register request received:', req.body);
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        // Check if email already exists
        const [existingUsers] = await db.promise().query(
            'SELECT * FROM Customer WHERE Email_ID = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.promise().query(
            'INSERT INTO Customer (Name, Email_ID, Password, Phone, Address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.insertId,
                name,
                email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error during registration' });
    }
});

app.post('/api/login', async (req, res) => {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const [users] = await db.promise().query(
            'SELECT * FROM Customer WHERE Email_ID = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.Customer_ID, email: user.Email_ID },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.Customer_ID,
                name: user.Name,
                email: user.Email_ID
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.promise().query(
            'SELECT Customer_ID, Name, Email_ID, Phone, Address FROM Customer WHERE Customer_ID = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Existing API Routes
app.get('/api/pitches', (req, res) => {
    const query = 'SELECT * FROM Pitch';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching pitches:', error);
            res.status(500).json({ error: 'Failed to fetch pitches' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/branches', (req, res) => {
    const query = 'SELECT * FROM Branch';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching branches:', error);
            res.status(500).json({ error: 'Failed to fetch branches' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/bookings', authenticateToken, (req, res) => {
    const { pitch_id, entry_time, exit_time } = req.body;
    const customer_id = req.user.id;
    
    const query = 'INSERT INTO Bookings (Customer_ID, Pitch_ID, Entry_time, Exit_time) VALUES (?, ?, ?, ?)';
    
    db.query(query, [customer_id, pitch_id, entry_time, exit_time], (err, results) => {
        if (err) {
            console.error('Error creating booking:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Booking created successfully', booking_id: results.insertId });
    });
});

// Get user bookings
app.get('/api/bookings/user', authenticateToken, async (req, res) => {
    console.log('Fetching bookings for user:', req.user.id);
    
    try {
        const query = `
            SELECT 
                b.Booking_ID,
                b.Entry_time,
                b.Exit_time,
                p.Pitch_type,
                p.Status as pitch_status,
                br.Location,
                p.Books_per_hour,
                TIMESTAMPDIFF(HOUR, b.Entry_time, b.Exit_time) * p.Books_per_hour as total_amount
            FROM Bookings b
            JOIN Pitch p ON b.Pitch_ID = p.Pitch_ID
            JOIN Branch br ON p.Branch_ID = br.Branch_ID
            WHERE b.Customer_ID = ?
            ORDER BY b.Entry_time DESC
        `;

        console.log('Executing query for user:', req.user.id);
        const [bookings] = await db.promise().query(query, [req.user.id]);
        console.log('Query results:', bookings);

        if (!bookings) {
            console.log('No bookings found for user:', req.user.id);
            return res.json([]);
        }

        // Format the bookings data
        const formattedBookings = bookings.map(booking => ({
            booking_id: booking.Booking_ID,
            entry_time: booking.Entry_time,
            exit_time: booking.Exit_time,
            pitch_type: booking.Pitch_type,
            location: booking.Location,
            status: booking.pitch_status || 'Available',
            total_amount: booking.total_amount || 0
        }));

        console.log('Sending formatted bookings:', formattedBookings);
        res.json(formattedBookings);
    } catch (error) {
        console.error('Error in /api/bookings/user:', error);
        res.status(500).json({ 
            error: 'Error fetching bookings',
            details: error.message 
        });
    }
});

// Cancel booking
app.post('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // First check if the booking belongs to the user
        const [bookings] = await db.promise().query(
            'SELECT * FROM Bookings WHERE Booking_ID = ? AND Customer_ID = ?',
            [bookingId, req.user.id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found or unauthorized' });
        }

        // Delete the booking
        await db.promise().query(
            'DELETE FROM Bookings WHERE Booking_ID = ?',
            [bookingId]
        );

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Error cancelling booking' });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database connection: ${db.state}`);
}); 

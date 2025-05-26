import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createCustomer, getCustomerByEmail } from '../database.js';

const router = express.Router();

// Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { name, email_id, phone, address, password } = req.body;

        // Check if customer already exists
        const existingCustomer = await getCustomerByEmail(email_id);
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new customer
        const result = await createCustomer({
            name,
            email_id,
            phone,
            address,
            password: hashedPassword
        });

        // Create JWT token
        const token = jwt.sign(
            { email: email_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// Login customer
router.post('/login', async (req, res) => {
    try {
        const { email_id, password } = req.body;

        // Check if customer exists
        const customer = await getCustomerByEmail(email_id);
        if (!customer) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { email: email_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            customer: {
                id: customer.customer_id,
                name: customer.name,
                email: customer.email_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

export default router; 
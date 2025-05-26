import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    createPayment,
    updatePaymentStatus
} from '../database.js';

const router = express.Router();

// Create a new payment
router.post('/', auth, async (req, res) => {
    try {
        const { booking_id, amount, payment_mode, transaction_id } = req.body;

        const payment = await createPayment({
            booking_id,
            amount,
            payment_mode,
            transaction_id
        });

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            payment
        });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record payment'
        });
    }
});

// Update payment status
router.patch('/:paymentId/status', auth, async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Completed', 'Failed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await updatePaymentStatus(paymentId, status);

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            result
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status'
        });
    }
});

export default router; 
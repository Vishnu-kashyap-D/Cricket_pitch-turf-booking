import jwt from 'jsonwebtoken';
import { getCustomerByEmail } from '../database.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await getCustomerByEmail(decoded.email);

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.customer = customer;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}; 
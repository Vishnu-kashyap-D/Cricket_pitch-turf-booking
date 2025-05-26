import express from 'express';
import { getAllBranches, getBranchEmployees } from '../database.js';

const router = express.Router();

// Get all branches
router.get('/', async (req, res) => {
    try {
        const branches = await getAllBranches();

        res.json({
            success: true,
            branches
        });
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branches'
        });
    }
});

// Get employees for a branch
router.get('/:branchId/employees', async (req, res) => {
    try {
        const { branchId } = req.params;
        const employees = await getBranchEmployees(branchId);

        res.json({
            success: true,
            employees
        });
    } catch (error) {
        console.error('Get branch employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branch employees'
        });
    }
});

export default router; 
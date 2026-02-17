import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile with financial data
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                monthlyIncome: user.monthlyIncome,
                monthlyExpenses: user.monthlyExpenses,
                currentSavings: user.currentSavings,
                goals: user.goals,
                preferences: user.preferences,
                disposableIncome: user.getDisposableIncome(),
                hourlyWage: user.getHourlyWage(),
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Update fields if provided
        if (req.body.name) user.name = req.body.name;
        if (req.body.monthlyIncome !== undefined) user.monthlyIncome = req.body.monthlyIncome;
        if (req.body.monthlyExpenses) user.monthlyExpenses = req.body.monthlyExpenses;
        if (req.body.currentSavings !== undefined) user.currentSavings = req.body.currentSavings;
        if (req.body.preferences) user.preferences = { ...user.preferences, ...req.body.preferences };

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                monthlyIncome: updatedUser.monthlyIncome,
                monthlyExpenses: updatedUser.monthlyExpenses,
                currentSavings: updatedUser.currentSavings,
                preferences: updatedUser.preferences,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

// @route   POST /api/user/goals
// @desc    Add a financial goal
// @access  Private
router.post('/goals', protect, async (req, res) => {
    try {
        const { name, targetAmount, deadline, priority } = req.body;

        if (!name || !targetAmount) {
            return res.status(400).json({
                success: false,
                message: 'Please provide goal name and target amount'
            });
        }

        const user = await User.findById(req.user._id);

        user.goals.push({
            name,
            targetAmount,
            deadline: deadline || null,
            priority: priority || 'medium',
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Goal added successfully',
            data: user.goals,
        });
    } catch (error) {
        console.error('Add goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding goal'
        });
    }
});

// @route   PUT /api/user/goals/:goalId
// @desc    Update a financial goal
// @access  Private
router.put('/goals/:goalId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const goal = user.goals.id(req.params.goalId);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        // Update goal fields
        if (req.body.name) goal.name = req.body.name;
        if (req.body.targetAmount !== undefined) goal.targetAmount = req.body.targetAmount;
        if (req.body.currentAmount !== undefined) goal.currentAmount = req.body.currentAmount;
        if (req.body.deadline) goal.deadline = req.body.deadline;
        if (req.body.priority) goal.priority = req.body.priority;

        await user.save();

        res.json({
            success: true,
            message: 'Goal updated successfully',
            data: user.goals,
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating goal'
        });
    }
});

// @route   DELETE /api/user/goals/:goalId
// @desc    Delete a financial goal
// @access  Private
router.delete('/goals/:goalId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Remove the goal using pull
        user.goals.pull(req.params.goalId);
        await user.save();

        res.json({
            success: true,
            message: 'Goal deleted successfully',
            data: user.goals,
        });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting goal'
        });
    }
});

export default router;

import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import sniperAgent from '../agents/sniperAgent.js';
import wolfAgent from '../agents/wolfAgent.js';
import sageAgent from '../agents/sageAgent.js';

const router = express.Router();

// @route   POST /api/chat
// @desc    Send a message to the AI agents
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { message, type } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a message'
            });
        }

        // Get user with full context
        const user = await User.findById(req.user._id).select('-password');

        // Build user context for agents
        const userContext = {
            monthlyIncome: user.monthlyIncome,
            monthlyExpenses: user.monthlyExpenses,
            currentSavings: user.currentSavings,
            disposableIncome: user.getDisposableIncome(),
            hourlyWage: user.getHourlyWage(),
            goals: user.goals,
            riskTolerance: user.preferences.riskTolerance,
            conversationHistory: user.conversations.slice(-5), // Last 5 conversations
        };

        let result;

        // Route to appropriate handler
        if (type === 'stock_comparison') {
            const { stock1, stock2 } = req.body;
            result = await sniperAgent.handleStockComparison(stock1, stock2, userContext);
        } else {
            // General chat - let Sniper route
            result = await sniperAgent.route(message, userContext);
        }

        // Save conversation to user history
        if (result.success && result.responses) {
            for (const response of result.responses) {
                user.conversations.push({
                    agentType: response.agent,
                    message: message,
                    response: response.response || response.analysis,
                    timestamp: new Date(),
                });
            }

            // Keep only last 50 conversations
            if (user.conversations.length > 50) {
                user.conversations = user.conversations.slice(-50);
            }

            await user.save();
        }

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing chat message',
            error: error.message
        });
    }
});

// @route   GET /api/chat/history
// @desc    Get user's conversation history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('conversations');

        res.json({
            success: true,
            data: user.conversations.reverse(), // Most recent first
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching conversation history'
        });
    }
});

// @route   POST /api/chat/stock-analysis
// @desc    Analyze a specific stock
// @access  Private
router.post('/stock-analysis', protect, async (req, res) => {
    try {
        const { symbol } = req.body;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a stock symbol'
            });
        }

        const user = await User.findById(req.user._id).select('-password');
        const userContext = {
            monthlyIncome: user.monthlyIncome,
            currentSavings: user.currentSavings,
            riskTolerance: user.preferences.riskTolerance,
        };

        const stockData = await wolfAgent.analyzeStock(symbol, userContext);

        if (!stockData) {
            return res.status(404).json({
                success: false,
                message: 'Stock not found or unable to fetch data'
            });
        }

        res.json({
            success: true,
            data: stockData,
        });
    } catch (error) {
        console.error('Stock analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing stock',
            error: error.message
        });
    }
});

// @route   POST /api/chat/spending-analysis
// @desc    Analyze a spending decision
// @access  Private
router.post('/spending-analysis', protect, async (req, res) => {
    try {
        const { itemName, itemPrice } = req.body;

        if (!itemName || !itemPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please provide item name and price'
            });
        }

        const user = await User.findById(req.user._id).select('-password');
        const userContext = {
            monthlyIncome: user.monthlyIncome,
            currentSavings: user.currentSavings,
            disposableIncome: user.getDisposableIncome(),
            hourlyWage: user.getHourlyWage(),
            goals: user.goals,
        };

        const analysis = await sageAgent.analyzeSpendingDecision(itemName, itemPrice, userContext);

        res.json({
            success: true,
            data: analysis,
        });
    } catch (error) {
        console.error('Spending analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing spending decision',
            error: error.message
        });
    }
});

export default router;

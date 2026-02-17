import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // Authentication
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },

    // Financial Profile
    monthlyIncome: {
        type: Number,
        default: 0,
    },
    monthlyExpenses: {
        rent: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        existingEmis: { type: Number, default: 0 },
        utilities: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
    },
    currentSavings: {
        type: Number,
        default: 0,
    },

    // Financial Goals
    goals: [{
        name: String,
        targetAmount: Number,
        currentAmount: { type: Number, default: 0 },
        deadline: Date,
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        createdAt: { type: Date, default: Date.now },
    }],

    // Agent Conversation History
    conversations: [{
        agentType: { type: String, enum: ['wolf', 'sage', 'sniper'] },
        message: String,
        response: String,
        timestamp: { type: Date, default: Date.now },
    }],

    // User Preferences
    preferences: {
        riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        investmentInterest: { type: Boolean, default: false },
        notificationsEnabled: { type: Boolean, default: true },
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate disposable income
userSchema.methods.getDisposableIncome = function () {
    const totalExpenses =
        this.monthlyExpenses.rent +
        this.monthlyExpenses.food +
        this.monthlyExpenses.existingEmis +
        this.monthlyExpenses.utilities +
        this.monthlyExpenses.other;

    return this.monthlyIncome - totalExpenses;
};

// Method to calculate hourly wage
userSchema.methods.getHourlyWage = function () {
    // Assuming 160 work hours per month (8 hours/day * 20 days)
    return this.monthlyIncome / 160;
};

const User = mongoose.model('User', userSchema);

export default User;

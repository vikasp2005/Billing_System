import express from 'express';
import { body } from 'express-validator';
import User from '../Models/User.js';
import { validate } from '../Middlewares/validate.js';
import { sendResetPasswordEmail } from '../Utils/sendEmail.js';
import { isAuthenticated } from '../Middlewares/auth.js';

const router = express.Router();


router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', status: 'error' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', status: 'error' });
        }
        req.session.userId = user._id;
        req.session.userRole = user.role;
        res.json({ message: 'Logged in successfully', status: 'success', user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please enter a valid email')
], validate, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', status: 'error' });
        }
        const resetToken = Math.random().toString(36).slice(-8);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        await sendResetPasswordEmail(email, resetToken);
        res.json({ message: 'Reset password email sent', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validate, async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token', status: 'error' });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password reset successfully', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.get('/session', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Session expired', status: 'error' });
        }
        res.json({ user, status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out', status: 'error' });
        }
        res.json({ message: 'Logged out successfully', status: 'success' });
    });
});

export default router;
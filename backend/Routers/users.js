import express from 'express';
import { body } from 'express-validator';
import User from '../Models/User.js';
import { isAuthenticated, isAdmin } from '../Middlewares/auth.js';
import { validate } from '../Middlewares/validate.js';

const router = express.Router();

router.post('/', [
    isAuthenticated,
    isAdmin,
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['admin', 'employee']).withMessage('Invalid role')
], validate, async (req, res) => {
    try {
        const { name, email, password, role, permissions } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists', status: 'error' });
        }
        const user = new User({ name, email, password, role, permissions });
        await user.save();
        res.status(201).json({ message: 'User created successfully', status: 'success', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.get('/', [isAuthenticated, isAdmin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.put('/:id', [
    isAuthenticated,
    isAdmin,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('role').optional().isIn(['admin', 'employee']).withMessage('Invalid role')
], validate, async (req, res) => {
    try {
        const { name, email, role, permissions } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id,
            { name, email, role, permissions },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 'error' });
        }
        res.json({ message: 'User updated successfully', status: 'success', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.delete('/:id', [isAuthenticated, isAdmin], async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found', status: 'error' });
        }
        res.json({ message: 'User deleted successfully', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

export default router;
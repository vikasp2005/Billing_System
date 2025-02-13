import express from 'express';
import { body } from 'express-validator';
import Customer from '../Models/Customer.js';
import { isAuthenticated } from '../Middlewares/auth.js';
import { validate } from '../Middlewares/validate.js';

const router = express.Router();

router.post('/', [
    isAuthenticated,
    body('name').notEmpty().withMessage('Name is required'),
    body('mobile').notEmpty().withMessage('Mobile number is required'),
    body('email').isEmail().withMessage('Please enter a valid email')
], validate, async (req, res) => {
    try {
        const { name, mobile, email } = req.body;
        const customer = new Customer({ name, mobile, email });
        await customer.save();
        res.status(201).json({ message: 'Customer created successfully', status: 'success', customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.put('/:id', [
    isAuthenticated,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('mobile').optional().notEmpty().withMessage('Mobile number cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email')
], validate, async (req, res) => {
    try {
        const { name, mobile, email } = req.body;
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            { name, mobile, email },
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found', status: 'error' });
        }
        res.json({ message: 'Customer updated successfully', status: 'success', customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found', status: 'error' });
        }
        res.json({ message: 'Customer deleted successfully', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

export default router;
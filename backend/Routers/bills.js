import express from 'express';
import { body } from 'express-validator';
import Bill from '../Models/Bill.js';
import { isAuthenticated } from '../Middlewares/auth.js';
import { validate } from '../Middlewares/validate.js';

const router = express.Router();

router.post('/', [
    isAuthenticated,
    body('customer').notEmpty().withMessage('Customer is required'),
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.product').notEmpty().withMessage('Product is required for each item'),
    body('items.*.quantity').isNumeric().withMessage('Quantity must be a number'),
    body('items.*.price').isNumeric().withMessage('Price must be a number'),
    body('total').isNumeric().withMessage('Total must be a number')
], validate, async (req, res) => {
    try {
        const { customer, items, total } = req.body;
        const bill = new Bill({
            customer,
            items,
            total,
            createdBy: req.session.userId
        });
        await bill.save();
        res.status(201).json({ message: 'Bill created successfully', status: 'success', bill });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const bills = await Bill.find().populate('customer').populate('items.product');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.put('/:id', [
    isAuthenticated,
    body('items').optional().isArray().withMessage('Items must be an array'),
    body('items.*.product').optional().notEmpty().withMessage('Product is required for each item'),
    body('items.*.quantity').optional().isNumeric().withMessage('Quantity must be a number'),
    body('items.*.price').optional().isNumeric().withMessage('Price must be a number'),
    body('total').optional().isNumeric().withMessage('Total must be a number')
], validate, async (req, res) => {
    try {
        const { items, total } = req.body;
        const bill = await Bill.findByIdAndUpdate(req.params.id,
            { items, total },
            { new: true, runValidators: true }
        );
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found', status: 'error' });
        }
        res.json({ message: 'Bill updated successfully', status: 'success', bill });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found', status: 'error' });
        }
        res.json({ message: 'Bill deleted successfully', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

export default router;
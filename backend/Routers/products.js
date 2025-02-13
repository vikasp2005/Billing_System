import express from 'express';
import { body } from 'express-validator';
import Product from '../Models/Product.js';
import { isAuthenticated, isAdmin } from '../Middlewares/auth.js';
import { validate } from '../Middlewares/validate.js';

const router = express.Router();

router.post('/', [
    isAuthenticated,
    isAdmin,
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number')
], validate, async (req, res) => {
    try {
        const { name, price, image, discounts } = req.body;
        const product = new Product({ name, price, image, discounts });
        await product.save();
        res.status(201).json({ message: 'Product created successfully', status: 'success', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.put('/:id', [
    isAuthenticated,
    isAdmin,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number')
], validate, async (req, res) => {
    try {
        const { name, price, image, discounts } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id,
            { name, price, image, discounts },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found', status: 'error' });
        }
        res.json({ message: 'Product updated successfully', status: 'success', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

router.delete('/:id', [isAuthenticated, isAdmin], async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found', status: 'error' });
        }
        res.json({ message: 'Product deleted successfully', status: 'success' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 'error' });
    }
});

export default router;
import express from "express"
import { Product } from "../Models/Product.Model.js"
import { checkAuth, checkPermission } from "../MiddleWares/Auth.Middleware.js"
const Router = express.Router()

// Create product
Router.post("/", checkAuth, checkPermission("manageProducts"), async (req, res) => {
    try {
        const { name, price, description } = req.body
        const product = new Product({
            name,
            price,
            description,
            createdBy: req.user._id,
        })
        await product.save()
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get all products
Router.get("/", checkAuth, async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update product
Router.put("/:id", checkAuth, checkPermission("manageProducts"), async (req, res) => {
    try {
        const { name, price, description } = req.body
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, updatedAt: Date.now() },
            { new: true },
        )
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete product
Router.delete("/:id", checkAuth, checkPermission("manageProducts"), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Add discount to product
Router.post("/:id/discounts", checkAuth, checkPermission("manageProducts"), async (req, res) => {
    try {
        const { percentage, startDate, endDate } = req.body
        const product = await Product.findById(req.params.id)
        product.discounts.push({
            percentage,
            startDate,
            endDate,
            createdBy: req.user._id,
        })
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete discount from product
Router.delete("/:id/discounts/:discountId", checkAuth, checkPermission("manageProducts"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        product.discounts = product.discounts.filter((discount) => discount._id.toString() !== req.params.discountId)
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

export default Router


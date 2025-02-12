import express from "express"
import { Bill } from "../Models/Bill.Model.js"
import { checkAuth, checkPermission } from "../MiddleWares/Auth.Middleware.js"
const Router = express.Router()

// Create bill
Router.post("/", checkAuth, checkPermission("manageBills"), async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body
        const bill = new Bill({
            customer,
            items,
            totalAmount,
            createdBy: req.user._id,
        })
        await bill.save()
        res.status(201).json(bill)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get all bills
Router.get("/", checkAuth, async (req, res) => {
    try {
        const bills = await Bill.find().populate("customer").populate("items.product")
        res.json(bills)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update bill
Router.put("/:id", checkAuth, checkPermission("manageBills"), async (req, res) => {
    try {
        const { customer, items, totalAmount, status } = req.body
        const bill = await Bill.findByIdAndUpdate(req.params.id, { customer, items, totalAmount, status }, { new: true })
            .populate("customer")
            .populate("items.product")
        res.json(bill)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete bill
Router.delete("/:id", checkAuth, checkPermission("manageBills"), async (req, res) => {
    try {
        await Bill.findByIdAndDelete(req.params.id)
        res.json({ message: "Bill deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Confirm bill
Router.post("/:id/confirm", checkAuth, checkPermission("manageBills"), async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id, { status: "confirmed" }, { new: true })
            .populate("customer")
            .populate("items.product")
        res.json(bill)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

export default Router;


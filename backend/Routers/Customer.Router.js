import express from "express"
import { Customer } from "../Models/Customer.Model.js"
import { checkAuth, checkPermission } from "../MiddleWares/Auth.Middleware.js"
const Router = express.Router()

// Create customer
Router.post("/", checkAuth, checkPermission("manageCustomers"), async (req, res) => {
    try {
        const { name, email, mobile } = req.body
        const customer = new Customer({
            name,
            email,
            mobile,
            createdBy: req.user._id,
        })
        await customer.save()
        res.status(201).json(customer)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get all customers
Router.get("/", checkAuth, async (req, res) => {
    try {
        const customers = await Customer.find()
        res.json(customers)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update customer
Router.put("/:id", checkAuth, checkPermission("manageCustomers"), async (req, res) => {
    try {
        const { name, email, mobile } = req.body
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, mobile, updatedAt: Date.now() },
            { new: true },
        )
        res.json(customer)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete customer
Router.delete("/:id", checkAuth, checkPermission("manageCustomers"), async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id)
        res.json({ message: "Customer deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

export default Router


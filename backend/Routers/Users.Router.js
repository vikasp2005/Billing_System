import express from "express"
import { User } from "../Models/User.Model.js"
import { checkAuth, checkPermission } from "../MiddleWares/Auth.Middleware.js"

const Router = express.Router()

// Create admin/employee
Router.post("/", checkAuth, checkPermission("manageAdmins"), async (req, res) => {
    try {
        const { name, email, password, role, permissions } = req.body
        const user = new User({
            name,
            email,
            password,
            role,
            permissions,
            createdBy: req.user._id,
        })
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get all users
Router.get("/", checkAuth, checkPermission("manageAdmins"), async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update user
Router.put("/:id", checkAuth, checkPermission("manageAdmins"), async (req, res) => {
    try {
        const { name, email, role, permissions } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, permissions, updatedAt: Date.now() },
            { new: true },
        ).select("-password")
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete user
Router.delete("/:id", checkAuth, checkPermission("manageAdmins"), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

export default Router


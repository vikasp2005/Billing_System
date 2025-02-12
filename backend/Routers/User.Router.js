import express from "express"
import { User } from "../Models/User.Model.js";
const Router = express.Router()

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next()
    } else {
        res.status(401).json({ message: "Unauthorized" })
    }
}

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId)
        if (user && user.role === "admin") {
            next()
        } else {
            res.status(403).json({ message: "Forbidden" })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// Get user profile
Router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select("-password")
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Admin-only route
Router.get("/admin-dashboard", isAuthenticated, isAdmin, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard" })
})

export default Router


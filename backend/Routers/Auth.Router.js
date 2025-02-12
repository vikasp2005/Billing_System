import express from "express"
import crypto from "crypto"
import { User } from "../Models/User.Model.js"
import { sendEmail } from "../Utils/SendEmail.js";
const Router = express.Router()
// Login
Router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        req.session.userId = user._id
        res.json({ user: { id: user._id, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Forgot password
Router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const token = crypto.randomBytes(20).toString("hex")
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
        await user.save()

        const resetUrl = `http://localhost:3000/reset-password/${token}`
        await sendEmail(email, "Password Reset", `Reset your password: ${resetUrl}`)

        res.json({ message: "Password reset email sent" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Reset password
Router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }
        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        res.json({ message: "Password reset successful" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Logout
Router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" })
        }
        res.json({ message: "Logged out successfully" })
    })
})

export default Router


import { User } from "../Models/User.Model.js"

export const checkAuth = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        const user = await User.findById(req.session.userId)
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

export const checkPermission = (permission) => async (req, res, next) => {
    if (req.user.role === "admin" && req.user.permissions[permission]) {
        next()
    } else {
        res.status(403).json({ message: "Forbidden" })
    }
}



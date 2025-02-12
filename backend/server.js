import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./Routers/Auth.Router.js"
import userRoutes from "./Routers/Users.Router.js";
import productRoutes from "./Routers/Product.Router.js";
import customerRoutes from "./Routers/Customer.Router.js";
import billRoutes from "./Routers/Bill.Router.js";

dotenv.config({ path: '../.env' });

const app = express()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Middleware
app.use(express.json())
app.use(cookieParser)
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
)

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secure-secret', // Replace with a strong secret
    resave: false, // Avoid saving unchanged sessions
    saveUninitialized: false, // Don't create a session until it's modified
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB connection string
        collectionName: 'sessions', // Name of the collection
    }),
    cookie: {
        httpOnly: true, // Prevent access to cookies via JavaScript
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 24-hour expiration
    },
}));

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/bills", billRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


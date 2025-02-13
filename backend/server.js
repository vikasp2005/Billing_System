import express from 'express';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './Config/db.js';
import authRoutes from './Routers/auth.js';
import userRoutes from './Routers/users.js';
import productRoutes from './Routers/products.js';
import customerRoutes from './Routers/customers.js';
import billRoutes from './Routers/bills.js';


dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bills', billRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Pages/Auth/Login';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import ManageBills from './Pages/Admin/ManageBills';
import ManageProducts from './Pages/Admin/ManageProducts';
import ManageUsers from './Pages/Admin/ManageUsers';
import ManageCustomers from './Pages/Admin/ManageCustomers';
import CreateBill from './Pages/Employee/CreateBill';
import ProtectedRoute from './Components/ProtectedRoute';
import api from './API/api';
import Alert from './Components/Alert';
import Spinner from './Components/Spinner';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await api.get('/auth/session');
                setUser(response.data.user);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setAlert({ message: 'Session expired. Please log in again.', type: 'error' });
                } else {
                    setAlert({ message: 'An error occurred. Please try again.', type: 'error' });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navbar user={user} setUser={setUser} />
                <div className="container mx-auto px-4 py-8">
                    {alert && <Alert message={alert.message} type={alert.type} />}
                    <Routes>
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/admin/bills" element={
                            <ProtectedRoute user={user} role="admin">
                                <ManageBills />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/products" element={
                            <ProtectedRoute user={user} role="admin">
                                <ManageProducts />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute user={user} role="admin">
                                <ManageUsers />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/customers" element={
                            <ProtectedRoute user={user} role="admin">
                                <ManageCustomers />
                            </ProtectedRoute>
                        } />
                        <Route path="/employee/create-bill" element={
                            <ProtectedRoute user={user} role="employee">
                                <CreateBill />
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/bills' : '/employee/create-bill') : '/login'} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../API/api';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (!user) return null;

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">Billing System</Link>
                <div className="space-x-4">
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin/bills" className="hover:text-blue-200">Bills</Link>
                            <Link to="/admin/products" className="hover:text-blue-200">Products</Link>
                            <Link to="/admin/users" className="hover:text-blue-200">Users</Link>
                            <Link to="/admin/customers" className="hover:text-blue-200">Customers</Link>
                        </>
                    )}
                    {user.role === 'employee' && (
                        <Link to="/employee/create-bill" className="hover:text-blue-200">Create Bill</Link>
                    )}
                    <button onClick={handleLogout} className="hover:text-blue-200">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
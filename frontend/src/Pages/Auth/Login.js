import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data.user);
            setAlert({ message: 'Login successful', type: 'success' });
            navigate(response.data.user.role === 'admin' ? '/admin/bills' : '/employee/create-bill');
        } catch (error) {
            setAlert({ message: error.response?.data?.message || 'Login failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Login</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? <Spinner /> : 'Login'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
        </div>
    );
};

export default Login;
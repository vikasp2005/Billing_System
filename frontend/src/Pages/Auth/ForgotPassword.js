import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setAlert({ message: 'Password reset email sent', type: 'success' });
        } catch (error) {
            setAlert({ message: error.response?.data?.message || 'Failed to send reset email', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Forgot Password</h2>
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
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? <Spinner /> : 'Send Reset Link'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/login" className="text-blue-500 hover:underline">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
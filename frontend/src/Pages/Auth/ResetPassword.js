import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setAlert({ message: 'Passwords do not match', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setAlert({ message: 'Password reset successful', type: 'success' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setAlert({ message: error.response?.data?.message || 'Failed to reset password', type: 'error' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Reset Password</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block mb-1">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? <Spinner /> : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
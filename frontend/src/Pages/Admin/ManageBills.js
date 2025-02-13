import React, { useState, useEffect } from 'react';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const ManageBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await api.get('/bills');
            setBills(response.data);
        } catch (error) {
            setAlert({ message: 'Failed to fetch bills', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const deleteBill = async (id) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                await api.delete(`/bills/${id}`);
                setAlert({ message: 'Bill deleted successfully', type: 'success' });
                fetchBills();
            } catch (error) {
                setAlert({ message: 'Failed to delete bill', type: 'error' });
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-5">Manage Bills</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Customer</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr key={bill._id}>
                            <td className="py-2 px-4 border-b">{bill.customer.name}</td>
                            <td className="py-2 px-4 border-b">${bill.total.toFixed(2)}</td>
                            <td className="py-2 px-4 border-b">{new Date(bill.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => deleteBill(bill._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBills;
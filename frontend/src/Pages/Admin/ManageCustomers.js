import React, { useState, useEffect } from 'react';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/customers');
            setCustomers(response.data);
        } catch (error) {
            setAlert({ message: 'Failed to fetch customers', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/customers/${editingId}`, formData);
                setAlert({ message: 'Customer updated successfully', type: 'success' });
            } else {
                await api.post('/customers', formData);
                setAlert({ message: 'Customer added successfully', type: 'success' });
            }
            setFormData({ name: '', mobile: '', email: '' });
            setEditingId(null);
            fetchCustomers();
        } catch (error) {
            setAlert({ message: 'Failed to save customer', type: 'error' });
        }
    };

    const handleEdit = (customer) => {
        setFormData({ name: customer.name, mobile: customer.mobile, email: customer.email });
        setEditingId(customer._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${id}`);
                setAlert({ message: 'Customer deleted successfully', type: 'success' });
                fetchCustomers();
            } catch (error) {
                setAlert({ message: 'Failed to delete customer', type: 'error' });
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-5">Manage Customers</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="mobile" className="block mb-1">Mobile</label>
                    <input
                        type="tel"
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {editingId ? 'Update Customer' : 'Add Customer'}
                </button>
            </form>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Mobile</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id}>
                            <td className="py-2 px-4 border-b">{customer.name}</td>
                            <td className="py-2 px-4 border-b">{customer.mobile}</td>
                            <td className="py-2 px-4 border-b">{customer.email}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleEdit(customer)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(customer._id)}
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

export default ManageCustomers;
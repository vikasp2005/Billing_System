import React, { useState, useEffect } from 'react';
import api from '../../API/api';
import Alert from '../../Components/Alert';
import Spinner from '../../Components/Spinner';

const CreateBill = () => {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [billData, setBillData] = useState({
        customer: '',
        items: [],
        total: 0
    });

    useEffect(() => {
        fetchCustomersAndProducts();
    }, []);

    const fetchCustomersAndProducts = async () => {
        try {
            const [customersResponse, productsResponse] = await Promise.all([
                api.get('/customers'),
                api.get('/products')
            ]);
            setCustomers(customersResponse.data);
            setProducts(productsResponse.data);
        } catch (error) {
            setAlert({ message: 'Failed to fetch data', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (product) => {
        const existingItem = billData.items.find(item => item.product === product._id);
        if (existingItem) {
            const updatedItems = billData.items.map(item =>
                item.product === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
            updateBillData(updatedItems);
        } else {
            const newItem = { product: product._id, quantity: 1, price: product.price };
            updateBillData([...billData.items, newItem]);
        }
    };

    const handleRemoveItem = (productId) => {
        const updatedItems = billData.items.filter(item => item.product !== productId);
        updateBillData(updatedItems);
    };

    const updateBillData = (items) => {
        const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        setBillData({ ...billData, items, total });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!billData.customer || billData.items.length === 0) {
            setAlert({ message: 'Please select a customer and add items to the bill', type: 'error' });
            return;
        }
        try {
            await api.post('/bills', billData);
            setAlert({ message: 'Bill created successfully', type: 'success' });
            setBillData({ customer: '', items: [], total: 0 });
        } catch (error) {
            setAlert({ message: 'Failed to create bill', type: 'error' });
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-5">Create Bill</h2>
            {alert && <Alert message={alert.message} type={alert.type} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="customer" className="block mb-1">Customer</label>
                    <select
                        id="customer"
                        value={billData.customer}
                        onChange={(e) => setBillData({ ...billData, customer: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                            <option key={customer._id} value={customer._id}>{customer.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Products</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(product => (
                            <div key={product._id} className="border p-2 rounded">
                                <p>{product.name}</p>
                                <p>${product.price.toFixed(2)}</p>
                                <button
                                    type="button"
                                    onClick={() => handleAddItem(product)}
                                    className="bg-green-500 text-white px-2 py-1 rounded mt-2 hover:bg-green-600"
                                >
                                    Add to Bill
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Bill Items</h3>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Product</th>
                                <th className="py-2 px-4 border-b">Quantity</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billData.items.map((item) => {
                                const product = products.find(p => p._id === item.product);
                                return (
                                    <tr key={item.product}>
                                        <td className="py-2 px-4 border-b">{product?.name}</td>
                                        <td className="py-2 px-4 border-b">{item.quantity}</td>
                                        <td className="py-2 px-4 border-b">${(item.quantity * item.price).toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.product)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <p className="font-bold">Total: ${billData.total.toFixed(2)}</p>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Create Bill
                </button>
            </form>
        </div>
    );
};

export default CreateBill;
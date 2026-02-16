"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Trash2, X, Loader2, ShoppingCart } from "lucide-react";
import api from "@/lib/axios";
import { logBackup } from "@/lib/notifications";

interface Order {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: string;
    items: any[];
}

interface Customer {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface OrderItem {
    productId: string;
    quantity: number;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: "", quantity: 1 }]);

    useEffect(() => {
        fetchOrders();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const handleAddItem = () => {
        setOrderItems([...orderItems, { productId: "", quantity: 1 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...orderItems];
        // @ts-ignore
        newItems[index][field] = value;
        setOrderItems(newItems);
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const customer = customers.find(c => c.id === selectedCustomer);
        if (!customer) return;

        const items = orderItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productName: product?.name || "Unknown Product",
                quantity: item.quantity,
                price: product?.price || 0
            };
        });

        const newOrder = {
            customerName: customer.name,
            total: calculateTotal(),
            items
        };

        try {
            await api.post("/orders", newOrder);
            logBackup("Order", "Added", `Order for ${customer.name}`, null, newOrder);
            setIsModalOpen(false);
            // Reset form
            setSelectedCustomer("");
            setOrderItems([{ productId: "", quantity: 1 }]);
            fetchOrders();
        } catch (error) {
            console.error("Failed to create order", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage customer orders.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Order
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No orders found</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">${order.total.toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Order</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                                <select
                                    required
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                >
                                    <option value="">Select a customer</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Items</label>
                                    <button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        + Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <div className="flex-1">
                                                <select
                                                    required
                                                    value={item.productId}
                                                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                                />
                                            </div>
                                            {orderItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg flex justify-between items-center">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">${calculateTotal().toLocaleString()}</span>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                                >
                                    {submitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

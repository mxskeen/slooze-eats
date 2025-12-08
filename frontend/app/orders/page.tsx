'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            await api.post(`/orders/${orderId}/cancel`);
            toast.success('Order cancelled');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to cancel order');
        }
    };

    const canCancel = user?.role === 'admin' || user?.role === 'manager';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'placed':
                return 'bg-primary/20 text-primary';
            case 'completed':
                return 'bg-success/20 text-success';
            case 'cancelled':
                return 'bg-error/20 text-error';
            default:
                return 'bg-text-secondary/20 text-text-secondary';
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Order History</h1>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="card p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">
                                                Order #{order.id}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`badge ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            {canCancel && order.status === 'placed' && (
                                                <button
                                                    onClick={() => cancelOrder(order.id)}
                                                    className="text-error hover:underline text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-text-secondary">
                                                    {item.quantity}x {item.menu_item_name}
                                                </span>
                                                <span>
                                                    {typeof item.price === 'number' && item.price < 100
                                                        ? `$${(item.price * item.quantity).toFixed(2)}`
                                                        : `₹${item.price * item.quantity}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-border pt-4 flex justify-between items-center">
                                        <span className="font-medium">Total</span>
                                        <span className="text-xl font-bold text-primary">
                                            {typeof order.total_amount === 'number' && order.total_amount < 1000
                                                ? `$${order.total_amount.toFixed(2)}`
                                                : `₹${order.total_amount}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                            <p className="text-text-secondary">
                                Start ordering to see your history here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

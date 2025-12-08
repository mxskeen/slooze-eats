'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
    const [cart, setCart] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/orders/cart');
            setCart(data);
        } catch (error) {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await api.delete(`/orders/cart/items/${itemId}`);
            toast.success('Item removed');
            fetchCart();
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const checkout = async () => {
        try {
            await api.post('/orders/checkout', {});
            toast.success('Order placed successfully!');
            router.push('/orders');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Checkout failed');
        }
    };

    const canCheckout = user?.role !== 'member';

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : cart && cart.items.length > 0 ? (
                        <div className="space-y-6">
                            <div className="card p-6">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center py-4 border-b border-border last:border-0"
                                    >
                                        <div>
                                            <h3 className="font-bold">{item.menu_item_name}</h3>
                                            <p className="text-sm text-text-secondary">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-primary">
                                                {typeof item.price === 'number' && item.price < 100
                                                    ? `$${(item.price * item.quantity).toFixed(2)}`
                                                    : `₹${item.price * item.quantity}`}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-error hover:underline text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="card p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {typeof cart.total_amount === 'number' && cart.total_amount < 1000
                                            ? `$${cart.total_amount.toFixed(2)}`
                                            : `₹${cart.total_amount}`}
                                    </span>
                                </div>

                                {canCheckout ? (
                                    <button onClick={checkout} className="btn-primary w-full">
                                        Checkout
                                    </button>
                                ) : (
                                    <div className="bg-warning/20 text-warning p-4 rounded-lg text-center">
                                        Members cannot checkout. Please contact a manager or admin.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                            <p className="text-text-secondary mb-6">
                                Add some delicious items from our restaurants!
                            </p>
                            <button
                                onClick={() => router.push('/restaurants')}
                                className="btn-primary"
                            >
                                Browse Restaurants
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

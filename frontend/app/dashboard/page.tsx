'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
                        <p className="text-text-secondary">
                            Ready to order some delicious food?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/restaurants" className="card p-6 hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">🍽️</div>
                            <h3 className="text-xl font-bold mb-2">Browse Restaurants</h3>
                            <p className="text-text-secondary text-sm">
                                Discover restaurants in your region
                            </p>
                        </Link>

                        <Link href="/cart" className="card p-6 hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">🛒</div>
                            <h3 className="text-xl font-bold mb-2">View Cart</h3>
                            <p className="text-text-secondary text-sm">
                                Check items in your cart
                            </p>
                        </Link>

                        <Link href="/orders" className="card p-6 hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-2">My Orders</h3>
                            <p className="text-text-secondary text-sm">
                                Track your order history
                            </p>
                        </Link>
                    </div>

                    <div className="mt-12 card p-6">
                        <h2 className="text-xl font-bold mb-4">Your Access Level</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Permissions</h3>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li className="flex items-center gap-2">
                                        <span className="text-success">✓</span> View restaurants & menus
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-success">✓</span> Add items to cart
                                    </li>
                                    {user?.role !== 'member' && (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <span className="text-success">✓</span> Checkout & place orders
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-success">✓</span> Cancel orders
                                            </li>
                                        </>
                                    )}
                                    {user?.role === 'member' && (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <span className="text-error">✗</span> Checkout (Manager/Admin only)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-error">✗</span> Cancel orders (Manager/Admin only)
                                            </li>
                                        </>
                                    )}
                                    {user?.role === 'admin' && (
                                        <li className="flex items-center gap-2">
                                            <span className="text-success">✓</span> Manage payment methods
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Region Access</h3>
                                <p className="text-sm text-text-secondary">
                                    {user?.country === 'global'
                                        ? 'You have access to all regions'
                                        : `You can only see restaurants and orders from ${user?.country}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

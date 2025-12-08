'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
                            Slooze Eats
                        </Link>

                        <div className="hidden md:flex gap-6">
                            <Link href="/dashboard" className="text-text-secondary hover:text-text transition">
                                Dashboard
                            </Link>
                            <Link href="/restaurants" className="text-text-secondary hover:text-text transition">
                                Restaurants
                            </Link>
                            <Link href="/cart" className="text-text-secondary hover:text-text transition">
                                Cart
                            </Link>
                            <Link href="/orders" className="text-text-secondary hover:text-text transition">
                                Orders
                            </Link>
                            {user.role === 'admin' && (
                                <Link href="/payments" className="text-text-secondary hover:text-text transition">
                                    Payments
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="flex items-center gap-2 justify-end">
                                <span className={`badge badge-${user.role}`}>{user.role}</span>
                                <span className="text-xs text-text-secondary">{user.country}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm text-error hover:underline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

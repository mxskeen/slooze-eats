'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Unable to sign in');
        } finally {
            setLoading(false);
        }
    };

    const testUsers = [
        { email: 'nick@slooze.com', role: 'Admin', country: 'Global' },
        { email: 'marvel@slooze.com', role: 'Manager', country: 'India' },
        { email: 'america@slooze.com', role: 'Manager', country: 'America' },
        { email: 'thanos@slooze.com', role: 'Member', country: 'India' },
        { email: 'thor@slooze.com', role: 'Member', country: 'India' },
        { email: 'travis@slooze.com', role: 'Member', country: 'America' },
    ];

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* Logo and Title */}
                <div className="flex flex-col items-center text-center mb-10">
                    <img
                        src="/slooze.ico"
                        alt="Slooze Eats"
                        className="w-24 h-24 mb-6"
                    />
                    <h1 className="text-[28px] font-semibold text-white tracking-tight">
                        Slooze Eats
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full h-14 px-5 bg-[#1c1c1e] rounded-2xl text-white text-[17px] placeholder:text-zinc-500 outline-none border-2 border-transparent focus:border-blue-500 transition-colors"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full h-14 px-5 bg-[#1c1c1e] rounded-2xl text-white text-[17px] placeholder:text-zinc-500 outline-none border-2 border-transparent focus:border-blue-500 transition-colors"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-[17px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Demo Toggle */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowAccounts(!showAccounts)}
                        className="text-blue-500 text-[15px] hover:text-blue-400 transition-colors"
                    >
                        {showAccounts ? 'Hide demo accounts' : 'Use demo account'}
                    </button>
                </div>

                {/* Demo Accounts */}
                {showAccounts && (
                    <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        {testUsers.map((user) => (
                            <button
                                key={user.email}
                                onClick={() => {
                                    setEmail(user.email);
                                    setPassword('password123');
                                    setShowAccounts(false);
                                }}
                                className="w-full flex items-center justify-between px-5 py-4 bg-[#1c1c1e] hover:bg-[#2c2c2e] rounded-2xl transition-colors group"
                            >
                                <span className="text-[15px] text-zinc-300 group-hover:text-white transition-colors">
                                    {user.email}
                                </span>
                                <span className={`text-[11px] font-medium uppercase tracking-wide ${user.role === 'Admin' ? 'text-red-400' :
                                    user.role === 'Manager' ? 'text-orange-400' :
                                        'text-emerald-400'
                                    }`}>
                                    {user.role}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

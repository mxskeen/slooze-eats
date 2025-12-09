'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { PaymentMethod } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'card' as const,
        last_four: '',
        is_default: false,
    });
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchPayments();
    }, [user]);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments/methods');
            setPayments(data);
        } catch (error) {
            toast.error('Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/payments/methods', formData);
            toast.success('Payment method added');
            setShowForm(false);
            setFormData({ type: 'card', last_four: '', is_default: false });
            fetchPayments();
        } catch (error) {
            toast.error('Failed to add payment method');
        }
    };

    const deletePayment = async (id: number) => {
        if (!confirm('Are you sure you want to delete this payment method?')) return;

        try {
            await api.delete(`/payments/methods/${id}`);
            toast.success('Payment method deleted');
            fetchPayments();
        } catch (error) {
            toast.error('Failed to delete payment method');
        }
    };

    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Payment Methods</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary"
                        >
                            {showForm ? 'Cancel' : 'Add Payment Method'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value as any })
                                    }
                                    className="input-field"
                                >
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="netbanking">Net Banking</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Last Four Digits
                                </label>
                                <input
                                    type="text"
                                    value={formData.last_four}
                                    onChange={(e) =>
                                        setFormData({ ...formData, last_four: e.target.value })
                                    }
                                    className="input-field"
                                    placeholder="1234"
                                    maxLength={4}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_default}
                                    onChange={(e) =>
                                        setFormData({ ...formData, is_default: e.target.checked })
                                    }
                                    className="w-4 h-4"
                                />
                                <label className="text-sm">Set as default</label>
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                Add Payment Method
                            </button>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment.id} className="card p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold capitalize">
                                                    {payment.type}
                                                </span>
                                                {payment.is_default && (
                                                    <span className="badge bg-success/20 text-success">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-text-secondary mt-1">
                                                ending in {payment.last_four}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deletePayment(payment.id)}
                                            className="text-error hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-xl font-bold mb-2">No payment methods</h3>
                            <p className="text-text-secondary">
                                Add a payment method to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

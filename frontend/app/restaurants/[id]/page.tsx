'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { RestaurantDetail } from '@/lib/types';
import toast from 'react-hot-toast';

export default function RestaurantDetailPage() {
    const params = useParams();
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchRestaurant();
        }
    }, [params.id]);

    const fetchRestaurant = async () => {
        try {
            const { data } = await api.get(`/restaurants/${params.id}`);
            setRestaurant(data);
        } catch (error) {
            toast.error('Failed to load restaurant');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (menuItemId: number) => {
        try {
            await api.post('/orders/cart/items', {
                menu_item_id: menuItemId,
                quantity: 1,
            });
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!restaurant) {
        return (
            <ProtectedRoute>
                <Navbar />
                <div className="min-h-screen p-8">
                    <div className="text-center">Restaurant not found</div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="w-full h-64 object-cover rounded-2xl mb-6"
                        />
                        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
                        <p className="text-text-secondary">{restaurant.description}</p>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurant.menu_items.map((item) => (
                            <div key={item.id} className="card p-0 overflow-hidden">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold mb-1">{item.name}</h3>
                                    <p className="text-text-secondary text-sm mb-3">
                                        {item.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-primary">
                                            {typeof item.price === 'number' && item.price < 100
                                                ? `$${item.price.toFixed(2)}`
                                                : `₹${item.price}`}
                                        </span>
                                        <button
                                            onClick={() => addToCart(item.id)}
                                            className="btn-primary text-sm py-2 px-4"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

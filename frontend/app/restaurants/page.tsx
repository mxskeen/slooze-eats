'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Restaurant } from '@/lib/types';
import toast from 'react-hot-toast';

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
        } catch (error) {
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Restaurants</h1>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map((restaurant) => (
                                <Link
                                    key={restaurant.id}
                                    href={`/restaurants/${restaurant.id}`}
                                    className="card p-0 overflow-hidden"
                                >
                                    <img
                                        src={restaurant.image_url}
                                        alt={restaurant.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                                        <p className="text-text-secondary text-sm mb-4">
                                            {restaurant.description}
                                        </p>
                                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                            {restaurant.country.toUpperCase()}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

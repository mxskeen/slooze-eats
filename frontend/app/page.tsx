'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const featuredRestaurants = [
  { id: 1, name: 'Taj Mahal Kitchen', category: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', color: '#FF6B35' },
  { id: 2, name: 'Sakura Sushi', category: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop', color: '#E63946' },
  { id: 3, name: 'Bella Italia', category: 'Italian', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', color: '#2A9D8F' },
  { id: 4, name: 'Dragon Palace', category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', color: '#E9C46A' },
  { id: 5, name: 'El Mariachi', category: 'Mexican', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', color: '#F4A261' },
  { id: 6, name: 'Le Petit Paris', category: 'French', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', color: '#264653' },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="text-xl font-semibold tracking-tight">Slooze Eats</div>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 pt-16 pb-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-zinc-400">Powered by FastAPI</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-center tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
          Slooze Eats
        </h1>

        {/* Tagline */}
        <p className="text-xl text-zinc-400 text-center max-w-md mb-12">
          Discover culinary excellence from restaurants around the world, delivered to your door.
        </p>

        {/* CTA Card */}
        <div className="w-full max-w-xl p-8 bg-[#111111] border border-white/5 rounded-3xl backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-zinc-500 mb-6">Search for your favorite cuisine</p>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>

      {/* Restaurant Showcase */}
      <section className="relative z-10 pb-16">
        <h2 className="text-center text-zinc-500 text-sm font-medium uppercase tracking-widest mb-8">
          Featured Restaurants
        </h2>

        {/* Horizontal Scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 px-8 pb-4" style={{ width: 'max-content' }}>
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group relative w-64 flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/login')}
              >
                {/* Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Category Badge */}
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: restaurant.color }}
                >
                  {restaurant.category}
                </span>

                {/* Name */}
                <h3 className="text-lg font-medium text-white mt-1 group-hover:text-zinc-300 transition-colors">
                  {restaurant.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-8">
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <span>2024 Slooze Eats</span>
          <span>Role-Based Access Control Demo</span>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-center mb-6">
          Slooze Eats
        </h1>
        <p className="text-lg text-zinc-400 text-center max-w-md mb-12">
          Transform your dining experience with world-class cuisine delivered in seconds.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black text-lg font-semibold rounded-full hover:px-14 hover:scale-105 transition-all duration-300 ease-out"
        >
          Start Ordering
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6">
        <div className="text-center text-xs text-zinc-600">
          © 2025 Slooze Eats
        </div>
      </footer>
    </div>
  );
}

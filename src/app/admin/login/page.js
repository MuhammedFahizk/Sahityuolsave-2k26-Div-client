'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { post } from '@/utils/api';
import Spinner from '@/components/shared/Spinner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuth, loading } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await post('/api/auth/login', { username, password });
      login(data.token);
      // Use a "Hard Redirect" to fix state-related "Logic Errors" 
      // and ensure the dashboard starts with a fresh browser environment.
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear local errors if the user is already authenticated
  useEffect(() => {
    if (!loading) {
      if (isAuth) {
        setError('');
        router.replace('/admin/dashboard');
      }
    }
  }, [loading, isAuth, router]);

  // Show spinner while checking auth OR if already authenticated (waiting for redirect)
  if (loading || isAuth) {
    return <div className="h-screen flex items-center justify-center bg-[#F0F6FF]"><Spinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #0F4C81 0%, #1A6BAD 60%, #EEF6FF 100%)' }}>

      {/* Left — branding */}
      <div className="hidden md:flex flex-col justify-center px-16 w-[45%]">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center
          justify-center mb-6">
          <span className="text-white text-2xl font-bold">SF</span>
        </div>
        <h1 className="text-white text-3xl font-semibold leading-tight mb-3">
          SSF Festival<br />Admin Panel
        </h1>
        <p className="text-white/50 text-sm leading-relaxed">
          Manage teams, results, gallery<br />
          and announcements for<br />
          Sahityolsavam 2026
        </p>

        {/* Decorative dots */}
        <div className="flex gap-2 mt-10">
          <span className="w-2 h-2 rounded-full bg-white/40" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="mb-7">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6FF] flex items-center
              justify-center mb-4 md:hidden">
              <span className="text-[#0F4C81] font-bold text-sm">SF</span>
            </div>
            <h2 className="text-[18px] font-semibold text-gray-800">
              Welcome back
            </h2>
            <p className="text-gray-400 text-[12px] mt-1">
              Sign in to your admin account
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100
              rounded-xl text-red-600 text-[12px]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1.5 block">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                  text-[13px] text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:border-[#0F4C81] focus:ring-2
                  focus:ring-[#0F4C81]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-medium text-gray-500 mb-1.5 block">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                  text-[13px] text-gray-800 placeholder:text-gray-300
                  focus:outline-none focus:border-[#0F4C81] focus:ring-2
                  focus:ring-[#0F4C81]/10 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-white text-[13px]
                font-medium flex items-center justify-center gap-2
                transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0F4C81, #1A6BAD)' }}>
              {isSubmitting ? <Spinner size="sm" /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[11px] text-gray-300 mt-6">
            SSF Mavoor Division · Sahityolsavam 2026
          </p>
        </div>
      </div>
    </div>
  );
}
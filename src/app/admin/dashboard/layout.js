'use client';

import { useEffect }         from 'react';
import { useRouter }         from 'next/navigation';
import { useAuth }           from '@/context/AuthContext';
import Sidebar               from '@/components/admin/Sidebar';
import Spinner               from '@/components/shared/Spinner';

export default function AdminLayout({ children }) {
  const { isAuth, loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect AFTER loading is complete AND token is confirmed null
    if (!loading && !isAuth) {
      router.replace('/admin/login');
    }
  }, [loading, isAuth, router]);

  // Show spinner while AuthProvider is checking localStorage
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F0F6FF]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Prevent children from mounting if not authenticated
  if (!isAuth) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-[#F0F6FF] overflow-auto">
        {children}
      </main>
    </div>
  );
}
/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        // Simple role check, in a real app use custom claims or a profiles table
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, supabase]);

  if (loading) return <div className="p-5 text-center">Loading admin...</div>;

  return (
    <div className="d-flex min-vh-100 bg-dark text-white">
      {/* Sidebar */}
      <div className="bg-black border-end border-secondary shadow-sm" style={{ width: '250px' }}>
        <div className="p-4 border-bottom border-secondary font-weight-bold fs-5 text-white">Super Admin</div>
        <nav className="p-3 d-flex flex-column gap-2">
          <Link href="/admin" className="btn btn-dark text-start text-decoration-none">Overview</Link>
          <Link href="/admin/shops" className="btn btn-dark text-start text-decoration-none">All Shops</Link>
          <Link href="/admin/orders" className="btn btn-dark text-start text-decoration-none">All Orders</Link>
          <Link href="/admin/agents" className="btn btn-dark text-start text-decoration-none">Print Agents</Link>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
            className="btn btn-outline-danger text-start mt-4"
          >
            Log Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
}

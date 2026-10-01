/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, supabase]);

  if (loading) return <div className="p-5 text-center">Loading dashboard...</div>;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-white border-end shadow-sm" style={{ width: '250px' }}>
        <div className="p-4 border-bottom font-weight-bold fs-5">Shop Dashboard</div>
        <nav className="p-3 d-flex flex-column gap-2">
          <Link href="/dashboard" className="btn btn-light text-start text-decoration-none">Live Queue</Link>
          <Link href="/dashboard/printers" className="btn btn-light text-start text-decoration-none">Printers</Link>
          <Link href="/dashboard/pricing" className="btn btn-light text-start text-decoration-none">Pricing</Link>
          <Link href="/dashboard/downloads" className="btn btn-light text-start text-decoration-none">Downloads</Link>
          <Link href="/dashboard/settings" className="btn btn-light text-start text-decoration-none">Settings</Link>
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

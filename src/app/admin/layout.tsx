'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'kaushiksavaliya909@gmail.com') {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [pathname, router, supabase]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f7f8' }}>Loading...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-wrap" style={{ display: 'flex', height: '100vh', background: '#f5f7f8' }}>
      <div className="admin-sidebar" style={{ width: '240px', background: 'white', borderRight: '1px solid #eaeaea', display: 'flex', flexDirection: 'column' }}>
        <div className="admin-logo" style={{ padding: '24px 20px', borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#7c3aed', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '20px' }}>
            A
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>Admin Panel</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Super Access</div>
          </div>
        </div>

        <div className="sp-nav" style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/admin" className={`sp-nav-item ${pathname === '/admin' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: pathname === '/admin' ? '#7c3aed' : '#4b5563', background: pathname === '/admin' ? '#f3e8ff' : 'transparent', textDecoration: 'none', fontWeight: 500 }}>
            <i className="bi bi-speedometer2"></i> Overview
          </Link>
          <Link href="/admin/shops" className={`sp-nav-item ${pathname === '/admin/shops' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: pathname === '/admin/shops' ? '#7c3aed' : '#4b5563', background: pathname === '/admin/shops' ? '#f3e8ff' : 'transparent', textDecoration: 'none', fontWeight: 500 }}>
            <i className="bi bi-shop"></i> All Shops
          </Link>
          <Link href="/admin/orders" className={`sp-nav-item ${pathname === '/admin/orders' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: pathname === '/admin/orders' ? '#7c3aed' : '#4b5563', background: pathname === '/admin/orders' ? '#f3e8ff' : 'transparent', textDecoration: 'none', fontWeight: 500 }}>
            <i className="bi bi-receipt"></i> All Orders
          </Link>
          <Link href="/admin/agents" className={`sp-nav-item ${pathname === '/admin/agents' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: pathname === '/admin/agents' ? '#7c3aed' : '#4b5563', background: pathname === '/admin/agents' ? '#f3e8ff' : 'transparent', textDecoration: 'none', fontWeight: 500 }}>
            <i className="bi bi-pc-display"></i> Print Agents
          </Link>
          <Link href="/admin/users" className={`sp-nav-item ${pathname === '/admin/users' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', color: pathname === '/admin/users' ? '#7c3aed' : '#4b5563', background: pathname === '/admin/users' ? '#f3e8ff' : 'transparent', textDecoration: 'none', fontWeight: 500 }}>
            <i className="bi bi-people"></i> Users
          </Link>
        </div>

        <div className="sp-footer" style={{ padding: '20px', borderTop: '1px solid #eaeaea' }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Kaushik Savaliya</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Super Admin</div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }} className="sp-signout" style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', color: '#374151', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
        </div>
      </div>

      <div className="admin-main" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

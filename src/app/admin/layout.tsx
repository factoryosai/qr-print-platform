'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const ADMIN_EMAIL = 'kaushiksavaliya909@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/admin/login'); return; }
      if (session.user.email !== ADMIN_EMAIL) { router.push('/'); return; }
      setIsAdmin(true);
      setLoading(false);
    };
    check();
  }, []);

  const navItems = [
    { href: '/admin', label: 'Overview', icon: 'bi-speedometer2' },
    { href: '/admin/shops', label: 'All Shops', icon: 'bi-shop' },
    { href: '/admin/orders', label: 'All Orders', icon: 'bi-receipt' },
    { href: '/admin/agents', label: 'Print Agents', icon: 'bi-pc-display' },
    { href: '/admin/users', label: 'Users', icon: 'bi-people' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6b7280' }}>Authenticating admin...</div>
    </div>
  );
  if (!isAdmin) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-sidebar {
          width: 220px; background: #0a0a0a; min-height: 100vh;
          position: fixed; left: 0; top: 0; bottom: 0; z-index: 100;
          border-right: 1px solid #1a1a1a; display: flex; flex-direction: column;
        }
        .admin-logo { padding: 20px 16px; border-bottom: 1px solid #1a1a1a; }
        .admin-logo-badge { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
        .admin-logo-icon { width: 32px; height: 32px; background: #dc2626; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: white; font-size: 13px; }
        .admin-logo strong { color: white; font-size: 14px; font-weight: 700; }
        .admin-logo small { display: block; color: #ef4444; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .admin-nav { flex: 1; padding: 12px 8px; }
        .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; color: #6b7280; text-decoration: none; font-size: 13px; font-weight: 500; margin-bottom: 2px; transition: all 0.15s; }
        .admin-nav-item:hover { color: white; background: #1a1a1a; }
        .admin-nav-item.active { color: white; background: #1a1a2e; border-left: 3px solid #3b82f6; padding-left: 9px; }
        .admin-nav-item i { font-size: 15px; }
        .admin-footer { padding: 16px; border-top: 1px solid #1a1a1a; }
        .admin-main { margin-left: 220px; min-height: 100vh; background: #f8fafc; }
        .admin-topbar { background: white; border-bottom: 1px solid #e5e7eb; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .admin-topbar-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; }
        .admin-topbar h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
        .admin-content { padding: 24px; }
        .stat-card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .stat-val { font-size: 26px; font-weight: 800; line-height: 1; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
      `}} />
      <div style={{ display: 'flex' }}>
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <Link href="/admin" className="admin-logo-badge">
              <div className="admin-logo-icon">A</div>
              <div><strong>Admin Panel</strong><small>Super Access</small></div>
            </Link>
          </div>
          <nav className="admin-nav">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}>
                <i className={`bi ${item.icon}`}></i> {item.label}
              </Link>
            ))}
          </nav>
          <div className="admin-footer">
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Logged in as<br /><span style={{ color: '#9ca3af' }}>Kaushik Savaliya</span></div>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }} className="btn btn-sm btn-outline-danger w-100">Sign Out</button>
          </div>
        </aside>
        <div className="admin-main">{children}</div>
      </div>
    </>
  );
}

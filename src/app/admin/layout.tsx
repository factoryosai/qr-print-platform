'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const ADMIN_EMAIL = 'kaushiksavaliya909@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const check = async () => {
      if (pathname === '/admin/login') { setLoading(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== ADMIN_EMAIL) { router.push('/admin/login'); return; }
      setLoading(false);
    };
    check();
  }, [pathname]);

  const nav = [
    { href: '/admin', label: 'Overview', icon: 'bi-speedometer2' },
    { href: '/admin/shops', label: 'All Shops', icon: 'bi-shop' },
    { href: '/admin/orders', label: 'All Orders', icon: 'bi-receipt' },
    { href: '/admin/agents', label: 'Print Agents', icon: 'bi-pc-display' },
  ];

  if (loading) return <div style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#687080' }}>Loading…</div>;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <div className="admin-logo-icon">A</div>
          <div><strong>Admin Panel</strong><small>Super Access</small></div>
        </Link>

        <nav className="sp-nav">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={`sp-nav-item ${pathname === item.href ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>{item.label}
            </Link>
          ))}
        </nav>

        <div className="sp-footer">
          <div className="sp-footer-name">Kaushik Savaliya</div>
          <div className="sp-footer-sub">Super Admin</div>
          <button className="sp-signout" onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', session.user.id).single();
      setShop(data);
      setLoading(false);
    };
    init();
  }, []);

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { href: '/dashboard/downloads', label: 'Downloads', icon: 'bi-download' },
    { href: '/dashboard/printers', label: 'Printers', icon: 'bi-printer' },
    { href: '/dashboard/wallet', label: 'Wallet & Plans', icon: 'bi-wallet2' },
    { href: '/dashboard/reports', label: 'Reports', icon: 'bi-bar-chart-line' },
    { href: '/dashboard/refer', label: 'Refer & Earn', icon: 'bi-gift' },
    { href: '/dashboard/profile', label: 'Profile', icon: 'bi-person' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'bi-gear' },
    { href: '/dashboard/change-password', label: 'Change Password', icon: 'bi-key' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f8' }}>
      <div style={{ color: '#687080', fontSize: 14 }}>Loading panel…</div>
    </div>
  );

  return (
    <div className="sp-wrap">
      {/* Sidebar */}
      <aside className="sp-sidebar">
        <Link href="/" className="sp-logo">
          <div className="sp-logo-icon">QP</div>
          <strong>Qr To Print</strong>
        </Link>

        <nav className="sp-nav">
          {nav.map(item => (
            <Link key={item.href} href={item.href} className={`sp-nav-item ${pathname === item.href ? 'active' : ''}`}>
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sp-footer">
          <div className="sp-footer-name">{shop?.name || '—'}</div>
          <div className="sp-footer-sub">{shop?.id} · Wallet</div>
          <button className="sp-signout" onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="sp-main">{children}</main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', session.user.id).single();
      if (data) setShop(data);
      setLoading(false);
    };
    init();
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', short: 'D' },
    { href: '/dashboard/downloads', label: 'Downloads', icon: 'bi-download', short: 'DL' },
    { href: '/dashboard/printers', label: 'Printers', icon: 'bi-printer', short: 'P' },
    { href: '/dashboard/wallet', label: 'Wallet & Plans', icon: 'bi-wallet2', short: 'W' },
    { href: '/dashboard/reports', label: 'Reports', icon: 'bi-bar-chart', short: 'R' },
    { href: '/dashboard/refer', label: 'Refer & Earn', icon: 'bi-gift', short: 'K' },
    { href: '/dashboard/profile', label: 'Profile', icon: 'bi-person', short: 'A' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'bi-gear', short: 'S' },
    { href: '/dashboard/change-password', label: 'Change Password', icon: 'bi-key', short: 'K' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#111' }}>
      <div className="text-white">Loading...</div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .shop-sidebar {
          width: 125px;
          background: #111;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
          overflow-y: auto;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          border-bottom: 1px solid #222;
          text-decoration: none;
          color: white;
        }
        .sidebar-logo-icon {
          width: 30px;
          height: 30px;
          background: #2563eb;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }
        .sidebar-logo strong {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
          color: white;
        }
        .sidebar-nav {
          flex: 1;
          padding: 8px 0;
        }
        .sidebar-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 6px;
          color: #9ca3af;
          text-decoration: none;
          font-size: 11px;
          gap: 4px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
          text-align: center;
          cursor: pointer;
          background: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          width: 100%;
        }
        .sidebar-nav-item:hover {
          color: white;
          background: #1a1a1a;
          border-left-color: #374151;
        }
        .sidebar-nav-item.active {
          color: white;
          background: #1d2232;
          border-left-color: #2563eb;
        }
        .sidebar-nav-item .nav-badge {
          width: 26px;
          height: 26px;
          background: #1f2937;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #9ca3af;
        }
        .sidebar-nav-item.active .nav-badge {
          background: #2563eb;
          color: white;
        }
        .sidebar-nav-item i {
          font-size: 16px;
        }
        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid #222;
        }
        .sidebar-user {
          font-size: 11px;
          color: #9ca3af;
        }
        .sidebar-user strong {
          display: block;
          color: white;
          font-size: 12px;
          margin-bottom: 2px;
        }
        .sidebar-user small {
          color: #6b7280;
          font-size: 10px;
        }
        .sign-out-btn {
          color: #ef4444;
          font-size: 11px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          margin-top: 4px;
        }
        .shop-main {
          margin-left: 125px;
          min-height: 100vh;
          background: #f8fafc;
        }
        .shop-topbar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .shop-topbar-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          font-weight: 600;
        }
        .shop-topbar h1 {
          font-size: 22px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          line-height: 1.3;
        }
        .shop-content {
          padding: 24px;
          max-width: 1100px;
        }
        @media (max-width: 768px) {
          .shop-sidebar { width: 60px; }
          .sidebar-nav-item span { display: none; }
          .sidebar-logo strong { display: none; }
          .shop-main { margin-left: 60px; }
          .sidebar-user strong, .sidebar-user small { display: none; }
        }
      `}} />

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <Link href="/" className="sidebar-logo">
            <div className="sidebar-logo-icon">QP</div>
            <strong>Qr To Print</strong>
          </Link>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
                  <div className="nav-badge">{item.short}</div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <strong>{shop?.name || 'My Shop'}</strong>
              <small>{shop?.id} · Wallet</small>
              <br />
              <button className="sign-out-btn" onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="shop-main">
          {children}
        </div>
      </div>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ShopDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (shopData) {
        setShop(shopData);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router, supabase]);

  const handleSignout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Live Queue', icon: 'bi-speedometer2' },
    { href: '/dashboard/reports', label: 'Reports', icon: 'bi-bar-chart-line' },
    { href: '/dashboard/wallet', label: 'Wallet & Plans', icon: 'bi-wallet2' },
    { href: '/dashboard/profile', label: 'Profile', icon: 'bi-person' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'bi-gear' },
    { href: '/dashboard/refer', label: 'Refer & Earn', icon: 'bi-gift' },
    { href: '/dashboard/change-password', label: 'Security', icon: 'bi-key' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f8fafc' }}>
      <div style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ width: '40px', height: '40px', background: '#ef4444', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
            QP
          </div>
          <span style={{ fontWeight: '600', fontSize: '18px', color: '#0f172a' }}>Qr To Print</span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? '#ef4444' : '#64748b',
                      background: isActive ? '#fef2f2' : 'transparent',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: '18px' }}></i>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
            {shop?.name || 'Shop Name'}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', wordBreak: 'break-all' }}>
            ID: {shop?.id?.substring(0, 12)}...
          </div>
          <button 
            onClick={handleSignout}
            style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#64748b', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
          >
            <i className="bi bi-box-arrow-right"></i>
            Sign Out
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

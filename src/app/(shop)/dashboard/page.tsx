'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardHome() {
  const [orders, setOrders] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: s } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (!s) return;
      setShop(s);
      const { data: o } = await supabase.from('orders').select('*').eq('shop_id', s.id).order('created_at', { ascending: false }).limit(30);
      if (o) setOrders(o);
    };
    init();
  }, []);

  const today = new Date().toDateString();
  const stats = {
    today: orders.filter(o => new Date(o.created_at).toDateString() === today).length,
    total: orders.length,
    printed: orders.filter(o => o.print_status === 'printed').length,
    queued: orders.filter(o => o.print_status === 'queued').length,
  };

  const statusBadge = (s: string) => {
    const cls: any = { queued: 'badge-queued', printed: 'badge-printed', failed: 'badge-failed', printing: 'badge-printing', cancelled: 'badge-cancelled', sending_to_printer: 'badge-printing' };
    return <span className={cls[s] || 'badge-cancelled'}>{s}</span>;
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Dashboard</h1></div>
        {shop && (
          <Link href={`/print/${shop.id}`} target="_blank" className="btn-sp btn-sp-dark">
            Open Print Page <i className="bi bi-arrow-up-right"></i>
          </Link>
        )}
      </div>
      <div className="sp-body">
        <div className="stat-row">
          {[
            { label: "Today's Jobs", val: stats.today, icon: 'bi-calendar-check', bg: '#eff6ff', color: '#2563eb' },
            { label: 'Total Orders', val: stats.total, icon: 'bi-receipt', bg: '#f5f3ff', color: '#7c3aed' },
            { label: 'Printed', val: stats.printed, icon: 'bi-printer', bg: '#f0fdf4', color: '#059669' },
            { label: 'In Queue', val: stats.queued, icon: 'bi-clock', bg: '#fffbeb', color: '#d97706' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><i className={`bi ${s.icon}`} style={{ color: s.color }}></i></div>
              <div><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <div className="table-card-header">
            <h2>Live Print Queue</h2>
            <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}><i className="bi bi-circle-fill" style={{ fontSize: 8, marginRight: 4 }}></i>Live</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f5f7f8' }}>
                  {['Order #', 'Customer', 'Service', 'Settings', 'Amount', 'Status', 'Time'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#687080' }}>
                    <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8, opacity: 0.4 }}></i>
                    No orders yet. Share your print page to get started!
                  </td></tr>
                )}
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f5f7f8' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{o.order_number}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{o.mobile}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{o.service_type}</span></td>
                    <td style={{ padding: '12px 16px', color: '#687080', fontSize: 12 }}>{o.print_settings?.paper_size} · {o.print_settings?.color_mode?.toUpperCase()} · {o.print_settings?.copies}x</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>₹{o.total_amount}</td>
                    <td style={{ padding: '12px 16px' }}>{statusBadge(o.print_status)}</td>
                    <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: 12 }}>{new Date(o.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

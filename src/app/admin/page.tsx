'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminOverview() {
  const [stats, setStats] = useState({ shops: 0, orders: 0, printed: 0, agents: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentShops, setRecentShops] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const [{ count: shops }, { count: orders }, { data: ordersData }, { data: shopsData }, { count: agents }] = await Promise.all([
        supabase.from('shops').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('shops').select('id,name,created_at,is_active').order('created_at', { ascending: false }).limit(5),
        supabase.from('agent_status').select('*', { count: 'exact', head: true }).eq('is_online', true),
      ]);
      const printed = ordersData?.filter((o: any) => o.print_status === 'printed').length || 0;
      setStats({ shops: shops || 0, orders: orders || 0, printed, agents: agents || 0 });
      setRecentOrders(ordersData || []);
      setRecentShops(shopsData || []);
    };
    load();
  }, []);

  const statusBadge = (s: string) => {
    const cls: any = { queued: 'badge-queued', printed: 'badge-printed', failed: 'badge-failed', printing: 'badge-printing', cancelled: 'badge-cancelled' };
    return <span className={cls[s] || 'badge-cancelled'}>{s}</span>;
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Admin Panel</small><h1>Platform Overview</h1></div>
      </div>
      <div className="sp-body">
        <div className="stat-row">
          {[
            { label: 'Total Shops', val: stats.shops, icon: 'bi-shop', bg: '#eff6ff', color: '#2563eb' },
            { label: 'Total Orders', val: stats.orders, icon: 'bi-receipt', bg: '#f5f3ff', color: '#7c3aed' },
            { label: 'Printed Jobs', val: stats.printed, icon: 'bi-printer', bg: '#f0fdf4', color: '#059669' },
            { label: 'Agents Online', val: stats.agents, icon: 'bi-pc-display', bg: '#ecfeff', color: '#0891b2' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><i className={`bi ${s.icon}`} style={{ color: s.color }}></i></div>
              <div><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div className="table-card">
            <div className="table-card-header"><h2>Recent Orders</h2></div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: '#f5f7f8' }}>
                {['Order#', 'Shop', 'Customer', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {recentOrders.length === 0 && <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>No orders yet.</td></tr>}
                {recentOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #f5f7f8' }}>
                    <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{o.order_number}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12 }}><span style={{ background: '#f3f4f6', borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace', fontSize: 11 }}>{o.shop_id}</span></td>
                    <td style={{ padding: '10px 16px' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer_name}</div><div style={{ fontSize: 11, color: '#9ca3af' }}>{o.mobile}</div></td>
                    <td style={{ padding: '10px 16px', fontWeight: 700 }}>₹{o.total_amount}</td>
                    <td style={{ padding: '10px 16px' }}>{statusBadge(o.print_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <div className="table-card-header"><h2>Recent Shops</h2></div>
            {recentShops.map(s => (
              <div key={s.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f5f7f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{s.id}</div>
                </div>
                <span className={s.is_active ? 'badge-printed' : 'badge-cancelled'}>{s.is_active ? 'Active' : 'Off'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

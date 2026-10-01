'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState({ shops: 0, orders: 0, printed: 0, agents: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentShops, setRecentShops] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const [{ count: shops }, { count: orders }, { data: orderData }, { data: shopData }, { count: agents }] = await Promise.all([
        supabase.from('shops').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(8),
        supabase.from('shops').select('id,name,created_at,is_active').order('created_at', { ascending: false }).limit(5),
        supabase.from('agent_status').select('*', { count: 'exact', head: true }).eq('is_online', true),
      ]);
      const printed = orderData?.filter(o => o.print_status === 'printed').length || 0;
      const revenue = orderData?.filter(o => o.print_status === 'printed').reduce((s, o) => s + Number(o.total_amount), 0) || 0;
      setStats({ shops: shops || 0, orders: orders || 0, printed, agents: agents || 0, revenue });
      setRecentOrders(orderData || []);
      setRecentShops(shopData || []);
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Shops', value: stats.shops, icon: 'bi-shop', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Total Orders', value: stats.orders, icon: 'bi-receipt', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Printed Jobs', value: stats.printed, icon: 'bi-printer', color: '#059669', bg: '#ecfdf5' },
    { label: 'Agents Online', value: stats.agents, icon: 'bi-pc-display', color: '#0891b2', bg: '#ecfeff' },
  ];

  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-label">Admin Panel</div>
          <h1>Platform Overview</h1>
        </div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: 8 }}></i>
          All systems operational
        </div>
      </div>

      <div className="admin-content">
        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {statCards.map(s => (
            <div key={s.label} className="col-6 col-xl-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
                </div>
                <div>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Orders */}
          <div className="col-lg-8">
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0, fontWeight: 700 }}>Recent Orders (All Shops)</h6>
                <Link href="/admin/orders" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr><th>Order#</th><th>Shop</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">No orders yet.</td></tr>}
                    {recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="fw-bold font-monospace" style={{ fontSize: 12 }}>{o.order_number}</td>
                        <td style={{ fontSize: 12 }}>{o.shop_id}</td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{o.customer_name}</div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{o.mobile}</div>
                        </td>
                        <td className="fw-bold">₹{o.total_amount}</td>
                        <td><span className={`badge bg-${o.print_status === 'printed' ? 'success' : o.print_status === 'failed' ? 'danger' : o.print_status === 'cancelled' ? 'secondary' : 'warning'}`}>{o.print_status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Shops */}
          <div className="col-lg-4">
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h6 style={{ margin: 0, fontWeight: 700 }}>Recent Shops</h6>
                <Link href="/admin/shops" style={{ fontSize: 12, color: '#2563eb', textDecoration: 'none' }}>View all →</Link>
              </div>
              <div style={{ padding: '8px 0' }}>
                {recentShops.length === 0 && <div className="text-center text-muted py-4" style={{ fontSize: 13 }}>No shops yet.</div>}
                {recentShops.map(s => (
                  <div key={s.id} style={{ padding: '10px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{s.id}</div>
                    </div>
                    <span className={`badge ${s.is_active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`} style={{ fontSize: 10 }}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

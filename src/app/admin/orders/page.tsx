'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
    };
    load();
  }, []);

  const filtered = orders.filter(o => {
    const matchS = statusFilter === 'all' || o.print_status === statusFilter;
    const matchQ = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.mobile?.includes(search) || o.order_number?.includes(search) || o.shop_id?.includes(search);
    return matchS && matchQ;
  });

  const totalRevenue = orders.filter(o => o.print_status === 'printed').reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-label">Admin Panel</div>
          <h1>All Orders <span style={{ fontSize: 16, fontWeight: 500, color: '#6b7280' }}>({orders.length})</span></h1>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>Platform Revenue: <strong style={{ color: '#111' }}>₹{totalRevenue}</strong></div>
      </div>
      <div className="admin-content">
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input className="form-control form-control-sm" style={{ maxWidth: 280 }} placeholder="Search by name, mobile, order#, shop..." value={search} onChange={e => setSearch(e.target.value)} />
            {['all', 'queued', 'printed', 'failed', 'cancelled'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`btn btn-sm ${statusFilter === s ? 'btn-dark' : 'btn-outline-secondary'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>Order#</th><th>Shop</th><th>Customer</th><th>Service</th><th>Settings</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-muted py-5">No orders found.</td></tr>}
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td className="fw-bold font-monospace" style={{ fontSize: 11 }}>{o.order_number}</td>
                    <td><span className="badge bg-dark font-monospace" style={{ fontSize: 10 }}>{o.shop_id}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer_name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{o.mobile}</div>
                    </td>
                    <td><span className="badge bg-light text-dark border" style={{ fontSize: 10 }}>{o.service_type}</span></td>
                    <td style={{ fontSize: 11, color: '#6b7280' }}>{o.print_settings?.paper_size} · {o.print_settings?.color_mode} · {o.print_settings?.copies}x</td>
                    <td className="fw-bold">₹{o.total_amount}</td>
                    <td><span className={`badge bg-${o.print_status === 'printed' ? 'success' : o.print_status === 'failed' ? 'danger' : o.print_status === 'cancelled' ? 'secondary' : 'warning'}`}>{o.print_status}</span></td>
                    <td style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
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

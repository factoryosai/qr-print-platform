'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [shop, setShop] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: s } = await supabase.from('shops').select('id').eq('owner_user_id', user.id).single();
      if (!s) return;
      setShop(s);
      const { data } = await supabase.from('orders').select('*').eq('shop_id', s.id).order('created_at', { ascending: false });
      if (data) setOrders(data);
    };
    init();
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.print_status === filter;
    const matchSearch = !search || o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.mobile?.includes(search) || o.order_number?.includes(search);
    return matchStatus && matchSearch;
  });

  const totalRevenue = orders.filter(o => o.print_status === 'printed').reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Reports</h1>
        </div>
      </div>

      <div className="shop-content">
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Printed', value: orders.filter(o => o.print_status === 'printed').length },
            { label: 'Failed', value: orders.filter(o => o.print_status === 'failed').length },
            { label: 'Revenue (informational)', value: `₹${totalRevenue}` },
          ].map(s => (
            <div key={s.label} className="col-6 col-xl-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex gap-2 flex-wrap">
              <input className="form-control form-control-sm" style={{ maxWidth: 240 }} placeholder="Search name, mobile, order#..." value={search} onChange={e => setSearch(e.target.value)} />
              {['all', 'queued', 'printed', 'failed', 'cancelled'].map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-dark' : 'btn-outline-secondary'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order #</th><th>Customer</th><th>Service</th><th>Settings</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-5">No orders found.</td></tr>
                )}
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td className="fw-bold font-monospace">{o.order_number}</td>
                    <td>
                      <div className="fw-semibold">{o.customer_name}</div>
                      <small className="text-muted">{o.mobile}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{o.service_type}</span></td>
                    <td className="small text-muted">{o.print_settings?.paper_size} · {o.print_settings?.color_mode} · {o.print_settings?.copies}x</td>
                    <td className="fw-bold">₹{o.total_amount}</td>
                    <td><span className={`badge bg-${o.print_status === 'printed' ? 'success' : o.print_status === 'failed' ? 'danger' : o.print_status === 'cancelled' ? 'secondary' : 'warning'}`}>{o.print_status}</span></td>
                    <td className="small text-muted">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
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

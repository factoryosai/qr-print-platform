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

  const statusBadge = (s: string) => {
    const cls: any = { queued: 'badge-queued', printed: 'badge-printed', failed: 'badge-failed', printing: 'badge-printing', cancelled: 'badge-cancelled' };
    return <span className={cls[s] || 'badge-cancelled'}>{s}</span>;
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Reports</h1></div>
      </div>

      <div className="sp-body">
        <div className="stat-row">
          {[
            { label: 'Total Orders', val: orders.length, icon: 'bi-receipt', bg: '#eff6ff', color: '#2563eb' },
            { label: 'Printed', val: orders.filter(o => o.print_status === 'printed').length, icon: 'bi-printer', bg: '#f0fdf4', color: '#059669' },
            { label: 'Failed', val: orders.filter(o => o.print_status === 'failed').length, icon: 'bi-x-circle', bg: '#fef2f2', color: '#dc2626' },
            { label: 'Total Revenue', val: `₹${totalRevenue}`, icon: 'bi-cash', bg: '#fefce8', color: '#ca8a04' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}><i className={`bi ${s.icon}`} style={{ color: s.color }}></i></div>
              <div><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <div className="table-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <input 
              className="form-control-sp" 
              style={{ maxWidth: 260 }} 
              placeholder="Search name, mobile, order#..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'queued', 'printed', 'failed', 'cancelled'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setFilter(s)} 
                  className={filter === s ? 'btn-sp btn-sp-dark' : 'btn-sp btn-sp-outline'}
                  style={{ padding: '6px 12px', fontSize: 12 }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f5f7f8' }}>
                  {['Order #', 'Customer', 'Service', 'Settings', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#687080' }}>No orders found matching filters.</td></tr>
                )}
                {filtered.map(o => (
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
                    <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
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

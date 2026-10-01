'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DashboardHome() {
  const [orders, setOrders] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [stats, setStats] = useState({ today: 0, total: 0, printed: 0, failed: 0 });
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: shopData } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (!shopData) return;
      setShop(shopData);

      const { data: ordersData } = await supabase.from('orders').select('*').eq('shop_id', shopData.id).order('created_at', { ascending: false }).limit(20);
      if (ordersData) {
        setOrders(ordersData);
        const today = new Date().toDateString();
        setStats({
          today: ordersData.filter(o => new Date(o.created_at).toDateString() === today).length,
          total: ordersData.length,
          printed: ordersData.filter(o => o.print_status === 'printed').length,
          failed: ordersData.filter(o => o.print_status === 'failed').length,
        });
      }
    };
    init();
  }, []);

  const statusBadge = (s: string) => {
    const map: any = { queued: 'warning', sending_to_printer: 'info', printing: 'primary', printed: 'success', failed: 'danger', cancelled: 'secondary' };
    return <span className={`badge bg-${map[s] || 'secondary'}`}>{s}</span>;
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Dashboard</h1>
        </div>
        {shop && (
          <Link href={`/print/${shop.id}`} target="_blank" className="btn btn-dark btn-sm fw-bold">
            Open Print Page
          </Link>
        )}
      </div>

      <div className="shop-content">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: "Today's Jobs", value: stats.today, icon: 'bi-calendar-check', color: '#2563eb' },
            { label: 'Total Orders', value: stats.total, icon: 'bi-receipt', color: '#059669' },
            { label: 'Printed', value: stats.printed, icon: 'bi-printer', color: '#7c3aed' },
            { label: 'Failed', value: stats.failed, icon: 'bi-exclamation-triangle', color: '#dc2626' },
          ].map((s) => (
            <div key={s.label} className="col-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${s.icon}`} style={{ fontSize: 20, color: s.color }}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{s.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Queue */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0 fw-bold">Live Print Queue</h5>
            <span className="badge bg-success-subtle text-success fw-semibold"><i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>Live</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Settings</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-5">
                    <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
                    No orders yet. Share your print page to get started!
                  </td></tr>
                )}
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><span className="fw-bold font-monospace">{o.order_number}</span></td>
                    <td>
                      <div className="fw-semibold">{o.customer_name}</div>
                      <small className="text-muted">{o.mobile}</small>
                    </td>
                    <td><span className="badge bg-light text-dark border">{o.service_type}</span></td>
                    <td className="small text-muted">{o.print_settings?.paper_size} · {o.print_settings?.color_mode} · {o.print_settings?.copies}x</td>
                    <td className="fw-bold">₹{o.total_amount}</td>
                    <td>{statusBadge(o.print_status)}</td>
                    <td className="small text-muted">{new Date(o.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
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

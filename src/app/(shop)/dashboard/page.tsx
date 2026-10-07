'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, total: 0, printed: 0, inQueue: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let channel: any;

    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', session.user.id)
        .order('created_at', { ascending: false });

      if (orderData) {
        setOrders(orderData);
        calculateStats(orderData);
      }
      setLoading(false);

      // Realtime subscription
      channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `shop_id=eq.${session.user.id}` }, (payload) => {
          setOrders(current => {
            let updated = [...current];
            if (payload.eventType === 'INSERT') {
              updated = [payload.new, ...updated];
            } else if (payload.eventType === 'UPDATE') {
              updated = updated.map(o => o.id === payload.new.id ? payload.new : o);
            } else if (payload.eventType === 'DELETE') {
              updated = updated.filter(o => o.id !== payload.old.id);
            }
            calculateStats(updated);
            return updated;
          });
        })
        .subscribe();
    };

    fetchOrders();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  const calculateStats = (data: any[]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let today = 0;
    let printed = 0;
    let inQueue = 0;

    data.forEach(o => {
      if (o.created_at?.startsWith(todayStr)) today++;
      if (o.print_status === 'printed') printed++;
      if (o.print_status === 'queued') inQueue++;
    });

    setStats({ today, total: data.length, printed, inQueue });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued': return <span className="badge-queued" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#fef3c7', color: '#d97706' }}>Queued</span>;
      case 'printing': return <span className="badge-printing" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#dbeafe', color: '#2563eb' }}>Printing</span>;
      case 'printed': return <span className="badge-printed" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#dcfce3', color: '#16a34a' }}>Printed</span>;
      case 'failed': return <span className="badge-failed" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#fee2e2', color: '#dc2626' }}>Failed</span>;
      case 'cancelled': return <span className="badge-cancelled" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: '#f3f4f6', color: '#4b5563' }}>Cancelled</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Live Queue</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Monitor and manage incoming print jobs</p>
        </div>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label" style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Today&apos;s Jobs</div>
                <div className="stat-val" style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>{stats.today}</div>
              </div>
              <div className="stat-icon" style={{ background: '#fef2f2', padding: '12px', borderRadius: '10px', color: '#ef4444' }}>
                <i className="bi bi-calendar-day" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label" style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total Orders</div>
                <div className="stat-val" style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
              </div>
              <div className="stat-icon" style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', color: '#22c55e' }}>
                <i className="bi bi-stack" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label" style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Printed</div>
                <div className="stat-val" style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>{stats.printed}</div>
              </div>
              <div className="stat-icon" style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}>
                <i className="bi bi-printer" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-label" style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>In Queue</div>
                <div className="stat-val" style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>{stats.inQueue}</div>
              </div>
              <div className="stat-icon" style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', color: '#f59e0b' }}>
                <i className="bi bi-hourglass-split" style={{ fontSize: '20px' }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="table-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div className="table-card-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Recent Orders</h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order #</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
                        <div>
                          <h4 style={{ margin: 0, color: '#0f172a', fontWeight: '600', fontSize: '18px' }}>No orders yet</h4>
                          <p style={{ margin: '8px 0 0', color: '#64748b' }}>When customers place print orders, they will appear here.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>#{order.order_number}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{order.customer_name || 'Guest'}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{order.mobile}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: '#0f172a', fontSize: '14px' }}>{order.service_type || 'Document Print'}</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>
                          {order.print_settings?.copies} copies, {order.print_settings?.color_mode === 'color' ? 'Color' : 'B&W'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>
                        ₹{order.total_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {getStatusBadge(order.print_status)}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px' }}>
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

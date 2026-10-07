'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
        setFilteredOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [supabase]);

  useEffect(() => {
    let result = orders;
    if (filter !== 'all') {
      result = result.filter(o => o.print_status === filter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(o => 
        o.order_number?.toLowerCase().includes(s) || 
        o.customer_name?.toLowerCase().includes(s) || 
        o.mobile?.includes(s)
      );
    }
    setFilteredOrders(result);
  }, [filter, search, orders]);

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

  const totalAmount = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Reports & Orders</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>View all past orders and print history</p>
        </div>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '16px', top: '12px', color: '#94a3b8' }}></i>
            <input 
              type="text" 
              placeholder="Search by Order #, Name, or Mobile..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff', width: '200px' }}
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="printing">Printing</option>
            <option value="printed">Printed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Filtered Orders:</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>{filteredOrders.length}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total Amount:</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#16a34a' }}>₹{totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="table-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order #</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading data...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ color: '#64748b' }}>No orders found matching your criteria.</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>#{order.order_number}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>{order.customer_name || 'Guest'}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{order.mobile}</div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '14px' }}>
                        <div>{new Date(order.created_at).toLocaleDateString()}</div>
                        <div style={{ fontSize: '12px' }}>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#0f172a', fontSize: '14px' }}>
                        {order.service_type || 'Document Print'}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '500', fontSize: '14px' }}>
                        ₹{order.total_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {getStatusBadge(order.print_status)}
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

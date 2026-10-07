'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*, shops(name)').order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.order_number?.toLowerCase().includes(search.toLowerCase())) || 
                          (order.id.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued': return <span className="badge-queued" style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Queued</span>;
      case 'printing': return <span className="badge-printing" style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Printing</span>;
      case 'printed': return <span className="badge-printed" style={{ background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Printed</span>;
      case 'failed': return <span className="badge-failed" style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Failed</span>;
      case 'cancelled': return <span className="badge-cancelled" style={{ background: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Cancelled</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>All Orders</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
            <input 
              type="text" 
              placeholder="Search by order number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: 'white' }}
          >
            <option value="all">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="printing">Printing</option>
            <option value="printed">Printed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Order#</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Shop</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Service</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '12px 20px', color: '#111827', fontWeight: 500 }}>{order.order_number || order.id.substring(0,8)}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{order.shops?.name || order.shop_id}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{order.customer_name || 'Anonymous'}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{order.service_type || 'Print'}</td>
                    <td style={{ padding: '12px 20px', color: '#111827', fontWeight: 500 }}>₹{order.total_amount || 0}</td>
                    <td style={{ padding: '12px 20px' }}>{getStatusBadge(order.status)}</td>
                    <td style={{ padding: '12px 20px', color: '#6b7280' }}>{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

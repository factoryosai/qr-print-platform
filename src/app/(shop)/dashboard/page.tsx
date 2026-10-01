/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardQueue() {
  const [orders, setOrders] = useState<any[]>([]);
  const [shopId, setShopId] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_user_id', user.id)
        .single();

      if (shop) {
        setShopId(shop.id);
        
        // initial fetch
        const fetchOrders = async (id: string) => {
          const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('shop_id', id)
            .order('created_at', { ascending: false })
            .limit(50);
          if (data) setOrders(data);
        };
        
        fetchOrders(shop.id);
        
        // Subscribe to changes
        const channel = supabase.channel(`shop-queue-${shop.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `shop_id=eq.${shop.id}` }, () => {
            fetchOrders(shop.id);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        }
      }
    };

    init();
  }, [supabase]);

  const handleRetry = async (orderId: string) => {
    await supabase.from('orders').update({ print_status: 'queued', failure_reason: null }).eq('id', orderId);
  };

  const handleCancel = async (orderId: string) => {
    await supabase.from('orders').update({ print_status: 'cancelled' }).eq('id', orderId);
  };

  return (
    <div>
      <h1 className="h3 mb-4 fw-bold">Live Print Queue</h1>
      
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Settings</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted p-4">No recent orders.</td></tr>
              )}
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="font-monospace fw-bold">{order.order_number}</td>
                  <td>
                    {order.customer_name}<br/>
                    <small className="text-muted">{order.mobile}</small>
                  </td>
                  <td className="small">
                    {order.print_settings?.paper_size}, {order.print_settings?.color_mode}, 
                    {order.print_settings?.copies} copy(s)
                  </td>
                  <td>
                    <span className={`badge ${
                      order.print_status === 'printed' ? 'bg-success' :
                      order.print_status === 'failed' ? 'bg-danger' :
                      order.print_status === 'cancelled' ? 'bg-secondary' :
                      'bg-primary'
                    }`}>
                      {order.print_status}
                    </span>
                    {order.failure_reason && <div className="small text-danger mt-1">{order.failure_reason}</div>}
                  </td>
                  <td className="fw-bold">₹{order.total_amount}</td>
                  <td>
                    {order.print_status === 'failed' && (
                      <button onClick={() => handleRetry(order.id)} className="btn btn-sm btn-link text-primary text-decoration-none">Retry</button>
                    )}
                    {order.print_status === 'queued' && (
                      <button onClick={() => handleCancel(order.id)} className="btn btn-sm btn-link text-danger text-decoration-none">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

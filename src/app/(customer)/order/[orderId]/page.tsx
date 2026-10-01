/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, shops(name)')
        .eq('id', params.orderId)
        .single();
        
      if (data) setOrder(data);
      setLoading(false);
    };

    fetchOrder();

    const channel = supabase
      .channel(`order-${params.orderId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders',
        filter: `id=eq.${params.orderId}`
      }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.orderId, supabase]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!order) return <div className="text-center mt-5 text-danger">Order not found.</div>;

  return (
    <div className="container-xl py-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h1 className="h4 fw-bold mb-1">Order #{order.order_number}</h1>
          <p className="text-muted mb-4">Shop: {order.shops?.name}</p>
          
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item d-flex justify-content-between align-items-center px-0">
              <span className="fw-bold">Status:</span>
              <span className="text-uppercase fw-bold text-primary">{order.print_status}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center px-0">
              <span className="fw-bold">Amount to Pay:</span>
              <span className="fw-bold fs-5">₹{order.total_amount}</span>
            </li>
          </ul>

          <div className="alert alert-info small mb-0">
            Please show this screen or your order number to the shop counter to collect your print.
          </div>
        </div>
      </div>
    </div>
  );
}

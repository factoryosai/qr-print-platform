'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, shops(name)')
        .eq('id', params.orderId)
        .single();
        
      if (data) setOrder(data);
      setLoading(false);
    };

    fetchOrder();

    // Setup real-time subscription
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

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!order) return <div className="text-center mt-20 text-red-500">Order not found.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Order #{order.order_number}</h1>
      <p className="text-gray-600 mb-6">Shop: {order.shops?.name}</p>
      
      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Status:</span>
          <span className="uppercase font-bold text-blue-600">{order.print_status}</span>
        </div>
        
        <div className="flex justify-between border-b pb-2">
          <span>Amount to Pay:</span>
          <span className="font-bold">₹{order.total_amount}</span>
        </div>

        <div className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded">
          <p>Please show this screen or your order number to the shop counter to collect your print.</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const STATUS_STEPS = [
  { key: 'queued', label: 'Queued', icon: 'bi-clock', desc: 'Your job is in the queue' },
  { key: 'sending_to_printer', label: 'Sending', icon: 'bi-arrow-right-circle', desc: 'Sending to printer' },
  { key: 'printing', label: 'Printing', icon: 'bi-printer', desc: 'Currently printing...' },
  { key: 'printed', label: 'Printed ✓', icon: 'bi-check-circle-fill', desc: 'Ready for collection!' },
];

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase.from('orders').select('*, shops(name, address)').eq('id', params.orderId).single();
      if (data) setOrder(data);
      setLoading(false);
    };
    fetchOrder();

    const channel = supabase.channel(`order-${params.orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${params.orderId}` }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [params.orderId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#9ca3af' }}>Loading order...</div>
    </div>
  );

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
        <h3>Order not found</h3>
        <p style={{ color: '#9ca3af' }}>This order may have expired or been deleted.</p>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.findIndex(s => s.key === order.print_status);
  const isCancelled = order.print_status === 'cancelled';
  const isFailed = order.print_status === 'failed';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pulse { animation: pulse 2s infinite; }
        .track-step { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px; }
        .track-step-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 15px; }
        .track-step-line { width: 2px; background: #e5e7eb; flex-shrink: 0; height: 20px; margin-left: 17px; }
      `}} />

      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>QP</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{(order.shops as any)?.name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Order Tracking</div>
          </div>
        </div>

        <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
          {/* Status Hero */}
          <div style={{
            background: isCancelled ? '#fef2f2' : isFailed ? '#fef2f2' : order.print_status === 'printed' ? '#f0fdf4' : '#eff6ff',
            border: `2px solid ${isCancelled || isFailed ? '#fecaca' : order.print_status === 'printed' ? '#bbf7d0' : '#bfdbfe'}`,
            borderRadius: 16, padding: '24px', textAlign: 'center', marginBottom: 24,
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {isCancelled ? '🚫' : isFailed ? '❌' : order.print_status === 'printed' ? '✅' : order.print_status === 'printing' ? '🖨️' : '⏳'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 4 }}>Order {order.order_number}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {isCancelled ? 'Cancelled' : isFailed ? 'Print Failed' : order.print_status === 'printed' ? 'Ready to Collect!' : order.print_status === 'printing' ? 'Printing Now...' : 'In Queue'}
            </div>
            {order.print_status === 'printing' && <div className="pulse" style={{ fontSize: 12, color: '#2563eb' }}>Live update • refreshing automatically</div>}
            {order.print_status === 'printed' && <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>Collect from the shop counter</div>}
            {isFailed && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 4 }}>{order.failure_reason || 'Print job failed. Please inform the shop staff.'}</div>}
          </div>

          {/* Progress Steps */}
          {!isCancelled && !isFailed && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: '20px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Progress</div>
              {STATUS_STEPS.map((s, i) => {
                const isDone = i < currentStep || order.print_status === 'printed';
                const isCurrent = i === currentStep && order.print_status !== 'printed';
                return (
                  <div key={s.key}>
                    <div className="track-step">
                      <div className="track-step-icon" style={{ background: isDone || isCurrent ? '#2563eb' : '#f3f4f6', color: isDone || isCurrent ? 'white' : '#9ca3af' }}>
                        <i className={`bi ${isDone ? 'bi-check-lg' : s.icon}`}></i>
                      </div>
                      <div style={{ paddingTop: 6 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: isDone || isCurrent ? '#111' : '#9ca3af' }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.desc}</div>
                      </div>
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div className="track-step-line"></div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Order Details */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Order Details</div>
            {[
              ['Customer', order.customer_name],
              ['Mobile', order.mobile],
              ['Service', order.service_type],
              ['Color', order.print_settings?.color_mode === 'bw' ? 'Black & White' : 'Color'],
              ['Paper', order.print_settings?.paper_size],
              ['Copies', order.print_settings?.copies],
              ['Amount to Pay', `₹${order.total_amount}`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, marginBottom: 8, borderBottom: '1px solid #f9fafb' }}>
                <span style={{ color: '#6b7280' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{String(v || '—')}</span>
              </div>
            ))}
          </div>

          {/* Pay note */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', textAlign: 'center', fontSize: 13, color: '#92400e' }}>
            💵 Pay <strong>₹{order.total_amount}</strong> at the counter when collecting
          </div>
        </div>
      </div>
    </>
  );
}

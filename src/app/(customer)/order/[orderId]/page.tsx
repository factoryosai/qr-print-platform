'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderTracking({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/order-status/${params.orderId}`);
        const data = await response.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const intervalId = setInterval(fetchOrder, 5000);
    return () => clearInterval(intervalId);
  }, [params.orderId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ color: '#111827', fontSize: '24px', margin: 0 }}>Order Not Found</h2>
        <p style={{ color: '#6b7280' }}>The requested order could not be found.</p>
      </div>
    );
  }

  const steps = ['queued', 'printing', 'printed'];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;
  
  const isFailed = order.status === 'failed' || order.status === 'cancelled';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f8', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        
        <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
            Order {order.order_number || `#${order.id.substring(0,6)}`}
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            {order.customer_name} • {order.service_type || 'Print Service'}
          </p>
        </div>

        <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 24px' }}>Status</h2>
          
          {isFailed ? (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', textAlign: 'center', fontWeight: 500 }}>
              Order {order.status === 'failed' ? 'Failed' : 'Cancelled'}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: '#e5e7eb', zIndex: 0 }}></div>
              <div style={{ position: 'absolute', top: '16px', left: '10%', width: `${(currentStepIndex / (steps.length - 1)) * 80}%`, height: '2px', background: '#f43f64', zIndex: 1, transition: 'width 0.5s ease' }}></div>
              
              {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isActive ? '#f43f64' : '#f3f4f6', color: isActive ? 'white' : '#9ca3af', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '14px', border: `2px solid ${isActive ? '#f43f64' : '#e5e7eb'}`, transition: 'all 0.3s ease' }}>
                      {isActive ? <i className="bi bi-check"></i> : index + 1}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: isCurrent ? 600 : 500, color: isCurrent ? '#111827' : '#6b7280', textTransform: 'capitalize' }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>Print Settings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {order.print_settings && Object.entries(order.print_settings).map(([key, value]) => (
              <div key={key}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{key}</div>
                <div style={{ fontSize: '15px', color: '#111827', fontWeight: 500 }}>{String(value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Amount to pay</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>₹{order.total_amount || 0}</div>
          </div>
          <Link href={`/${order.shop_id}`} style={{ padding: '12px 24px', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

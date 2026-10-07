'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalShops: 0, totalOrders: 0, printedJobs: 0, agentsOnline: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentShops, setRecentShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          { count: shopsCount },
          { count: ordersCount },
          { count: printedCount },
          { count: agentsCount },
          { data: ordersData },
          { data: shopsData }
        ] = await Promise.all([
          supabase.from('shops').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'printed'),
          supabase.from('agent_status').select('*', { count: 'exact', head: true }).eq('status', 'online'),
          supabase.from('orders').select('*, shops(name)').order('created_at', { ascending: false }).limit(10),
          supabase.from('shops').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        setStats({
          totalShops: shopsCount || 0,
          totalOrders: ordersCount || 0,
          printedJobs: printedCount || 0,
          agentsOnline: agentsCount || 0
        });
        setRecentOrders(ordersData || []);
        setRecentShops(shopsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

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

  if (loading) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading overview...</div>;
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
              <i className="bi bi-shop"></i>
            </div>
            <div>
              <div className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Shops</div>
              <div className="stat-val" style={{ color: '#111827', fontSize: '24px', fontWeight: 700 }}>{stats.totalShops}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
              <i className="bi bi-receipt"></i>
            </div>
            <div>
              <div className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Total Orders</div>
              <div className="stat-val" style={{ color: '#111827', fontSize: '24px', fontWeight: 700 }}>{stats.totalOrders}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
              <i className="bi bi-printer"></i>
            </div>
            <div>
              <div className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Printed Jobs</div>
              <div className="stat-val" style={{ color: '#111827', fontSize: '24px', fontWeight: 700 }}>{stats.printedJobs}</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
              <i className="bi bi-pc-display"></i>
            </div>
            <div>
              <div className="stat-label" style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>Agents Online</div>
              <div className="stat-val" style={{ color: '#111827', fontSize: '24px', fontWeight: 700 }}>{stats.agentsOnline}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="table-card" style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div className="table-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: '14px', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>View all</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Order#</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Shop</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Customer</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No recent orders</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '12px 20px', color: '#111827', fontWeight: 500 }}>{order.order_number || order.id.substring(0,8)}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{order.shops?.name || order.shop_id}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{order.customer_name || 'Anonymous'}</td>
                    <td style={{ padding: '12px 20px' }}>{getStatusBadge(order.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-card" style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div className="table-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Recent Shops</h3>
            <Link href="/admin/shops" style={{ fontSize: '14px', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>View all</Link>
          </div>
          <div style={{ padding: '12px 20px' }}>
            {recentShops.length === 0 ? (
              <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>No shops found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentShops.map((shop) => (
                  <div key={shop.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{shop.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{shop.owner_name}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(shop.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

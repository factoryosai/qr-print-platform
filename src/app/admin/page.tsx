/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminOverview() {
  const [stats, setStats] = useState({ shops: 0, orders: 0 });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { count: shopCount } = await supabase.from('shops').select('*', { count: 'exact', head: true });
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      
      setStats({
        shops: shopCount || 0,
        orders: orderCount || 0
      });
    };
    fetchStats();
  }, [supabase]);

  return (
    <div>
      <h1 className="h3 mb-4 fw-bold">Platform Overview</h1>
      
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-uppercase text-white-50 fs-6">Total Shops</h5>
              <p className="card-text fs-2 fw-bold">{stats.shops}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-uppercase text-white-50 fs-6">Total Orders</h5>
              <p className="card-text fs-2 fw-bold">{stats.orders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-uppercase text-white-50 fs-6">Active Agents</h5>
              <p className="card-text fs-2 fw-bold">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('agent_status').select('*, shops(name)').order('last_heartbeat', { ascending: false });
      if (data) setAgents(data);
    };
    load();
  }, []);

  const onlineCount = agents.filter(a => a.is_online).length;

  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-label">Admin Panel</div>
          <h1>Print Agents <span style={{ fontSize: 16, fontWeight: 500, color: '#6b7280' }}>({agents.length} total · {onlineCount} online)</span></h1>
        </div>
      </div>
      <div className="admin-content">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="stat-card"><div className="stat-icon" style={{ background: '#ecfdf5' }}><i className="bi bi-circle-fill text-success" style={{ fontSize: 12 }}></i></div><div><div className="stat-val">{onlineCount}</div><div className="stat-label">Online Now</div></div></div>
          </div>
          <div className="col-md-3">
            <div className="stat-card"><div className="stat-icon" style={{ background: '#f3f4f6' }}><i className="bi bi-pc-display" style={{ color: '#374151' }}></i></div><div><div className="stat-val">{agents.length}</div><div className="stat-label">Total Agents</div></div></div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h6 style={{ margin: 0, fontWeight: 700 }}>Agent Status</h6>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>Shop ID</th><th>Shop Name</th><th>Agent Version</th><th>Last Heartbeat</th><th>Status</th></tr>
              </thead>
              <tbody>
                {agents.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-5">No agents registered yet.</td></tr>}
                {agents.map(a => (
                  <tr key={a.shop_id}>
                    <td className="fw-bold font-monospace" style={{ fontSize: 12 }}>{a.shop_id}</td>
                    <td style={{ fontWeight: 600 }}>{(a.shops as any)?.name || '—'}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{a.agent_version || 'Unknown'}</td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{a.last_heartbeat ? new Date(a.last_heartbeat).toLocaleString('en-IN') : '—'}</td>
                    <td>
                      <span className={`badge ${a.is_online ? 'bg-success' : 'bg-secondary'}`}>
                        <i className={`bi ${a.is_online ? 'bi-circle-fill' : 'bi-circle'} me-1`} style={{ fontSize: 8 }}></i>
                        {a.is_online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

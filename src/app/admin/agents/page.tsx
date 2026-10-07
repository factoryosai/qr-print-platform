'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminAgents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const supabase = createClient();

  const fetchAgents = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from('agent_status').select('*').order('last_heartbeat', { ascending: false });
    if (!error && data) {
      setAgents(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAgents();
  }, [supabase]);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Print Agents</h1>
        <button 
          onClick={fetchAgents} 
          disabled={refreshing}
          style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#374151', cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className={`bi bi-arrow-clockwise ${refreshing ? 'spin' : ''}`}></i>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Shop ID</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Last Heartbeat</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Version</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Hostname</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading agents...</td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No print agents connected</td></tr>
              ) : (
                agents.map((agent) => {
                  const isOnline = agent.status === 'online';
                  return (
                    <tr key={agent.id || agent.shop_id} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                      <td style={{ padding: '12px 20px', color: '#111827', fontWeight: 500, fontFamily: 'monospace', fontSize: '13px' }}>{agent.shop_id}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#10b981' : '#ef4444' }}></div>
                          <span style={{ color: isOnline ? '#059669' : '#dc2626', fontWeight: 500 }}>{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', color: '#6b7280' }}>{new Date(agent.last_heartbeat).toLocaleString()}</td>
                      <td style={{ padding: '12px 20px', color: '#4b5563' }}>{agent.version || 'Unknown'}</td>
                      <td style={{ padding: '12px 20px', color: '#4b5563' }}>{agent.hostname || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PrintersPage() {
  const [printers, setPrinters] = useState<any[]>([]);
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [newPrinterName, setNewPrinterName] = useState('');
  const [adding, setAdding] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: s } = await supabase.from('shops').select('id').eq('owner_user_id', user.id).single();
      if (!s) return;
      setShop(s);
      
      const load = async () => {
        const { data: p } = await supabase.from('printers').select('*').eq('shop_id', s.id);
        if (p) setPrinters(p);
        const { data: a } = await supabase.from('agent_status').select('*').eq('shop_id', s.id).single();
        if (a) setAgentStatus(a);
      };
      load();

      const channel = supabase.channel('printer-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_status', filter: `shop_id=eq.${s.id}` }, () => load())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    };
    init();
  }, []);

  const addPrinter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrinterName || !shop) return;
    setAdding(true);
    await supabase.from('printers').insert({
      shop_id: shop.id,
      name: newPrinterName,
      is_color: true,
      can_duplex: true
    });
    const { data: p } = await supabase.from('printers').select('*').eq('shop_id', shop.id);
    if (p) setPrinters(p);
    setNewPrinterName('');
    setAdding(false);
  };

  const deletePrinter = async (id: string) => {
    if (!confirm('Remove this printer?')) return;
    await supabase.from('printers').delete().eq('id', id);
    setPrinters(printers.filter(p => p.id !== id));
  };

  const toggleCapability = async (id: string, field: 'is_color' | 'can_duplex', current: boolean) => {
    await supabase.from('printers').update({ [field]: !current }).eq('id', id);
    setPrinters(printers.map(p => p.id === id ? { ...p, [field]: !current } : p));
  };

  const isOnline = agentStatus?.is_online;

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Connected Printers</h1></div>
      </div>
      
      <div className="sp-body">
        {/* Agent Status Card */}
        <div className="info-card">
          <div className="info-card-header">
            <span style={{ background: '#f3f4f6', color: '#374151', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>AGENT</span>
            <div>Windows Print Agent</div>
          </div>
          <div className="info-card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Agent Status</div>
                <div style={{ fontSize: 13, color: '#687080', marginTop: 4 }}>
                  {isOnline ? 'Connected and ready to print' : 'Not connected. Run the agent on your PC.'}
                </div>
              </div>
              <span className={`agent-status-pill ${isOnline ? 'agent-online' : 'agent-offline'}`}>
                <i className={`bi ${isOnline ? 'bi-circle-fill' : 'bi-circle'}`} style={{ fontSize: 8 }}></i>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            {isOnline && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #dfe3e8', fontSize: 12, color: '#687080' }}>
                <strong>Last heartbeat:</strong> {new Date(agentStatus.last_heartbeat).toLocaleString('en-IN')} <br />
                <strong>PC User:</strong> {agentStatus.hostname || 'Unknown'} <br />
                <strong>Version:</strong> {agentStatus.agent_version || '1.0.0'}
              </div>
            )}
          </div>
        </div>

        {/* Add Printer */}
        <div className="table-card">
          <div className="table-card-header">
            <h2>Add Windows Printer</h2>
          </div>
          <div style={{ padding: 20 }}>
            <form onSubmit={addPrinter} style={{ display: 'flex', gap: 12, maxWidth: 500 }}>
              <input 
                type="text" 
                className="form-control-sp" 
                placeholder="Exact printer name as shown in Windows (e.g., EPSON L3150)" 
                value={newPrinterName} 
                onChange={e => setNewPrinterName(e.target.value)} 
                required 
              />
              <button type="submit" className="btn-sp btn-sp-dark" disabled={adding} style={{ whiteSpace: 'nowrap' }}>
                {adding ? 'Adding…' : 'Add Printer'}
              </button>
            </form>
            <div className="form-text">Must exactly match the printer name in Windows Settings &gt; Devices &gt; Printers &amp; scanners.</div>
          </div>
        </div>

        {/* Printer List */}
        <div className="table-card">
          <div className="table-card-header">
            <h2>Configured Printers</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f5f7f8' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>Printer Name</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>Capabilities</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>Added On</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#687080', borderBottom: '1px solid #dfe3e8' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {printers.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                      No printers configured yet. Add one above.
                    </td>
                  </tr>
                )}
                {printers.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f5f7f8' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>
                      <i className="bi bi-printer" style={{ marginRight: 8, color: '#687080' }}></i>
                      {p.name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          onClick={() => toggleCapability(p.id, 'is_color', p.is_color)}
                          className="btn-sp btn-sp-outline" 
                          style={{ padding: '4px 8px', fontSize: 11, background: p.is_color ? '#f0fdf4' : '#fff', borderColor: p.is_color ? '#bbf7d0' : '#dfe3e8' }}>
                          <i className={`bi bi-check2 ${p.is_color ? 'text-success' : ''}`}></i> Color
                        </button>
                        <button 
                          onClick={() => toggleCapability(p.id, 'can_duplex', p.can_duplex)}
                          className="btn-sp btn-sp-outline" 
                          style={{ padding: '4px 8px', fontSize: 11, background: p.can_duplex ? '#f0fdf4' : '#fff', borderColor: p.can_duplex ? '#bbf7d0' : '#dfe3e8' }}>
                          <i className={`bi bi-check2 ${p.can_duplex ? 'text-success' : ''}`}></i> Duplex
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#687080', fontSize: 12 }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => deletePrinter(p.id)} className="btn-sp btn-sp-outline" style={{ color: '#dc2626', borderColor: '#fecaca', padding: '6px 12px' }}>
                        <i className="bi bi-trash"></i>
                      </button>
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

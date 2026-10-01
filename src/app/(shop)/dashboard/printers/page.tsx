'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PrintersPage() {
  const [shop, setShop] = useState<any>(null);
  const [printers, setPrinters] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPrinter, setNewPrinter] = useState({ name: '', capability: 'bw_color', supports_duplex: false });
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: s } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (!s) return;
      setShop(s);
      const { data: p } = await supabase.from('printers').select('*').eq('shop_id', s.id);
      if (p) setPrinters(p);
    };
    init();
  }, []);

  const addPrinter = async () => {
    if (!shop || !newPrinter.name) return;
    const { data, error } = await supabase.from('printers').insert({
      shop_id: shop.id,
      name: newPrinter.name,
      capability: newPrinter.capability,
      supports_duplex: newPrinter.supports_duplex,
    }).select().single();
    if (!error && data) {
      setPrinters([...printers, data]);
      setNewPrinter({ name: '', capability: 'bw_color', supports_duplex: false });
      setShowAdd(false);
    }
  };

  const deletePrinter = async (id: string) => {
    await supabase.from('printers').delete().eq('id', id);
    setPrinters(printers.filter(p => p.id !== id));
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Printers</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-dark btn-sm fw-bold px-3">
          <i className="bi bi-plus-lg me-1"></i> Add Printer
        </button>
      </div>

      <div className="shop-content">
        {/* Agent status */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body d-flex align-items-center gap-3 py-3">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }}></div>
            <div>
              <div className="fw-semibold" style={{ fontSize: 14 }}>Print Agent — Offline</div>
              <div className="text-muted" style={{ fontSize: 12 }}>Download and install the Print Agent from the Downloads tab to connect your Windows PC.</div>
            </div>
          </div>
        </div>

        {/* Add Printer Modal */}
        {showAdd && (
          <div className="card border-0 shadow-sm mb-4" style={{ borderLeft: '3px solid #2563eb' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3">Add New Printer</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Windows Printer Name *</label>
                  <input className="form-control" placeholder="e.g. HP LaserJet M1005" value={newPrinter.name} onChange={e => setNewPrinter({ ...newPrinter, name: e.target.value })} />
                  <div className="form-text">Must match exactly as shown in Windows Printers list</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Capability</label>
                  <select className="form-select" value={newPrinter.capability} onChange={e => setNewPrinter({ ...newPrinter, capability: e.target.value })}>
                    <option value="bw">Black & White only</option>
                    <option value="color">Color only</option>
                    <option value="bw_color">B&W + Color</option>
                  </select>
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="duplex" checked={newPrinter.supports_duplex} onChange={e => setNewPrinter({ ...newPrinter, supports_duplex: e.target.checked })} />
                    <label className="form-check-label" htmlFor="duplex">Supports Duplex (double-sided printing)</label>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button onClick={addPrinter} className="btn btn-dark fw-bold">Save Printer</button>
                <button onClick={() => setShowAdd(false)} className="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Printers List */}
        {printers.length === 0 && !showAdd ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <i className="bi bi-printer" style={{ fontSize: 48, color: '#d1d5db', display: 'block', marginBottom: 12 }}></i>
              <h5 className="fw-bold text-muted">No printers added yet</h5>
              <p className="text-muted">Add your Windows printer to enable automatic job routing.</p>
              <button onClick={() => setShowAdd(true)} className="btn btn-dark fw-bold">
                <i className="bi bi-plus-lg me-1"></i> Add Your First Printer
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {printers.map((p) => (
              <div key={p.id} className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 40, height: 40, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-printer" style={{ fontSize: 18 }}></i>
                        </div>
                        <div>
                          <div className="fw-bold">{p.name}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>{p.capability === 'bw' ? 'B&W Only' : p.capability === 'color' ? 'Color Only' : 'B&W + Color'}</div>
                        </div>
                      </div>
                      <span className={`badge ${p.is_online ? 'bg-success' : 'bg-secondary'}`}>
                        {p.is_online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      {p.supports_duplex && <span className="badge bg-light text-dark border">Duplex</span>}
                      {p.is_auto_detected && <span className="badge bg-info-subtle text-info">Auto-detected</span>}
                    </div>
                    <button onClick={() => deletePrinter(p.id)} className="btn btn-sm btn-outline-danger mt-3 w-100">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

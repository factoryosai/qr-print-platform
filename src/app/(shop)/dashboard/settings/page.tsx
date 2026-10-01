'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [shop, setShop] = useState<any>(null);
  const [form, setForm] = useState({ file_size_limit_mb: 20, retention_hours: 24, min_order_amount: 0, is_active: true });
  const [services, setServices] = useState(['document', 'aadhaar', 'pan', 'photo', 'resume', 'xerox']);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const allServices = [
    { id: 'document', label: 'Document Printing', icon: 'bi-file-earmark-text' },
    { id: 'aadhaar', label: 'Aadhaar / ID Cards', icon: 'bi-credit-card-2-front' },
    { id: 'pan', label: 'PAN Card', icon: 'bi-credit-card' },
    { id: 'photo', label: 'Passport Photos', icon: 'bi-person-bounding-box' },
    { id: 'resume', label: 'Resume Printing', icon: 'bi-file-earmark-person' },
    { id: 'xerox', label: 'Xerox / Photocopy', icon: 'bi-copy' },
    { id: 'custom', label: 'Custom Jobs', icon: 'bi-star' },
  ];

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (data) {
        setShop(data);
        setForm({ file_size_limit_mb: data.file_size_limit_mb || 20, retention_hours: data.retention_hours || 24, min_order_amount: data.min_order_amount || 0, is_active: data.is_active ?? true });
        setServices(data.services_enabled || ['document', 'aadhaar', 'pan', 'photo', 'resume', 'xerox']);
      }
    };
    init();
  }, []);

  const toggleService = (id: string) => {
    setServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const save = async () => {
    if (!shop) return;
    await supabase.from('shops').update({ ...form, services_enabled: services }).eq('id', shop.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="shop-content">
        {saved && <div className="alert alert-success py-2 mb-3">Settings saved!</div>}

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 fw-bold">Shop Settings</div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Max File Size (MB)</label>
                  <input type="number" className="form-control" value={form.file_size_limit_mb} onChange={e => setForm({ ...form, file_size_limit_mb: +e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">File Retention (Hours)</label>
                  <input type="number" className="form-control" value={form.retention_hours} onChange={e => setForm({ ...form, retention_hours: +e.target.value })} />
                  <div className="form-text">Files are auto-deleted after order completes or after this many hours.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Min Order Amount (₹)</label>
                  <input type="number" className="form-control" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: +e.target.value })} />
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="shopActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  <label className="form-check-label" htmlFor="shopActive">Shop Active (accepting orders)</label>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 fw-bold">Enabled Services</div>
              <div className="card-body p-4">
                <p className="text-muted" style={{ fontSize: 13 }}>Toggle which print services customers can select on your print page.</p>
                {allServices.map(s => (
                  <div key={s.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${s.icon}`} style={{ fontSize: 16, color: '#6b7280' }}></i>
                      <span style={{ fontSize: 14 }}>{s.label}</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" checked={services.includes(s.id)} onChange={() => toggleService(s.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={save} className="btn btn-dark fw-bold mt-4 px-4">Save All Settings</button>
      </div>
    </>
  );
}

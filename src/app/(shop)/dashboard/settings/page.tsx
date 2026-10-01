'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [shop, setShop] = useState<any>(null);
  const [form, setForm] = useState({ file_size_limit_mb: 20, retention_hours: 24, min_order_amount: 0, is_active: true });
  const [services, setServices] = useState(['document', 'aadhaar', 'pan', 'photo', 'resume', 'xerox']);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const allServices = [
    { id: 'document', label: 'Document Printing', icon: 'bi-file-earmark-text' },
    { id: 'aadhaar', label: 'Aadhaar / ID Cards', icon: 'bi-credit-card-2-front' },
    { id: 'pan', label: 'PAN Card', icon: 'bi-credit-card' },
    { id: 'photo', label: 'Passport Photos', icon: 'bi-person-bounding-box' },
    { id: 'resume', label: 'Resume Printing', icon: 'bi-file-earmark-person' },
    { id: 'xerox', label: 'Xerox / Photocopy', icon: 'bi-copy' },
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
    setSaving(true);
    await supabase.from('shops').update({ ...form, services_enabled: services }).eq('id', shop.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Settings</h1></div>
        <button onClick={save} disabled={saving} className="btn-sp btn-sp-dark">
          {saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>

      <div className="sp-body">
        {saved && <div className="alert-success" style={{ marginBottom: 20 }}>Settings saved successfully!</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          
          <div className="info-card">
            <div className="info-card-header">Shop Configuration</div>
            <div className="info-card-body">
              <div className="form-group">
                <label className="form-label">Max File Size (MB)</label>
                <input type="number" className="form-control-sp" value={form.file_size_limit_mb} onChange={e => setForm({ ...form, file_size_limit_mb: +e.target.value })} />
                <div className="form-text">Maximum size per file uploaded by customer.</div>
              </div>
              <div className="form-group">
                <label className="form-label">File Retention (Hours)</label>
                <input type="number" className="form-control-sp" value={form.retention_hours} onChange={e => setForm({ ...form, retention_hours: +e.target.value })} />
                <div className="form-text">Files are auto-deleted after order completes or after this duration.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Min Order Amount (₹)</label>
                <input type="number" className="form-control-sp" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: +e.target.value })} />
              </div>
              
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #dfe3e8' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 18, height: 18, accentColor: '#f43f64' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Shop Active</div>
                    <div style={{ fontSize: 12, color: '#687080' }}>Accepting print orders from customers</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-header">Enabled Services</div>
            <div className="info-card-body" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', fontSize: 13, color: '#687080', borderBottom: '1px solid #dfe3e8', background: '#f5f7f8' }}>
                Toggle which print services customers can select on your print page.
              </div>
              {allServices.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < allServices.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f7f8', display: 'grid', placeItems: 'center', color: '#687080' }}>
                      <i className={`bi ${s.icon}`}></i>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#171821' }}>{s.label}</span>
                  </div>
                  <label style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={services.includes(s.id)} onChange={() => toggleService(s.id)} style={{ width: 20, height: 20, accentColor: '#f43f64' }} />
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

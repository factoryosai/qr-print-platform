'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [shop, setShop] = useState<any>(null);
  const [form, setForm] = useState({ name: '', owner_name: '', mobile: '', email: '', address: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (data) {
        setShop(data);
        setForm({ name: data.name || '', owner_name: data.owner_name || '', mobile: data.mobile || '', email: data.email || '', address: data.address || '' });
      }
    };
    init();
  }, []);

  const save = async () => {
    if (!shop) return;
    setSaving(true);
    await supabase.from('shops').update(form).eq('id', shop.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Profile</h1></div>
      </div>

      <div className="sp-body">
        <div className="info-card" style={{ maxWidth: 640 }}>
          <div className="info-card-header">Shop Information</div>
          <div className="info-card-body">
            {saved && <div className="alert-success">Profile saved successfully!</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Shop Name *</label>
                <input className="form-control-sp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Owner Name</label>
                <input className="form-control-sp" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} placeholder="e.g. Kaushik Savaliya" />
              </div>
              <div>
                <label className="form-label">Mobile Number</label>
                <input className="form-control-sp" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit number" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control-sp" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Shop Address</label>
                <textarea className="form-control-sp" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full shop address..." style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ borderTop: '1px solid #dfe3e8', margin: '24px -20px -20px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f7f8' }}>
              <div style={{ fontSize: 12, color: '#687080' }}>Shop ID: <strong style={{ fontFamily: 'monospace', color: '#171821' }}>{shop?.id}</strong></div>
              <button onClick={save} disabled={saving} className="btn-sp btn-sp-dark">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

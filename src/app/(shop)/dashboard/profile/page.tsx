'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [shop, setShop] = useState<any>(null);
  const [form, setForm] = useState({ name: '', owner_name: '', mobile: '', email: '', address: '' });
  const [saved, setSaved] = useState(false);
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
    await supabase.from('shops').update(form).eq('id', shop.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Profile</h1>
        </div>
      </div>

      <div className="shop-content">
        <div className="card border-0 shadow-sm" style={{ maxWidth: 640 }}>
          <div className="card-header bg-white py-3 fw-bold">Shop Information</div>
          <div className="card-body p-4">
            {saved && <div className="alert alert-success py-2">Profile saved successfully!</div>}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold">Shop Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Owner Name</label>
                <input className="form-control" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} placeholder="Kaushik Savaliya" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Mobile Number</label>
                <input className="form-control" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Shop Address</label>
                <textarea className="form-control" rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Shop address..." />
              </div>
            </div>

            <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
              <div className="text-muted" style={{ fontSize: 12 }}>Shop ID: <strong className="font-monospace">{shop?.id}</strong></div>
              <button onClick={save} className="btn btn-dark fw-bold">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
      if (data) setShops(data);
    };
    load();
  }, []);

  const filtered = shops.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.id?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('shops').update({ is_active: !current }).eq('id', id);
    setShops(shops.map(s => s.id === id ? { ...s, is_active: !current } : s));
  };

  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-label">Admin Panel</div>
          <h1>All Shops <span style={{ fontSize: 16, fontWeight: 500, color: '#6b7280' }}>({shops.length})</span></h1>
        </div>
      </div>
      <div className="admin-content">
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <input className="form-control form-control-sm" style={{ maxWidth: 300 }} placeholder="Search shops..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>Shop ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Created</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-5">No shops found.</td></tr>}
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td className="fw-bold font-monospace" style={{ fontSize: 12 }}>{s.id}</td>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{s.email}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{s.mobile || '—'}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>{new Date(s.created_at).toLocaleDateString('en-IN')}</td>
                    <td><span className={`badge ${s.is_active ? 'bg-success' : 'bg-secondary'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button onClick={() => toggleActive(s.id, s.is_active)} className={`btn btn-sm ${s.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}>
                        {s.is_active ? 'Disable' : 'Enable'}
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

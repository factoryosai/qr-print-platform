'use client';

import Link from 'next/link';

export default function AdminUsers() {
  return (
    <>
      <div className="admin-topbar">
        <div>
          <div className="admin-topbar-label">Admin Panel</div>
          <h1>Users</h1>
        </div>
      </div>
      <div className="admin-content">
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32, textAlign: 'center' }}>
          <i className="bi bi-people" style={{ fontSize: 48, color: '#d1d5db', display: 'block', marginBottom: 12 }}></i>
          <h5 style={{ fontWeight: 700 }}>User Management</h5>
          <p style={{ color: '#6b7280' }}>User accounts are managed through Supabase Auth dashboard.</p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="btn btn-dark fw-bold">Open Supabase Dashboard →</a>
        </div>
      </div>
    </>
  );
}

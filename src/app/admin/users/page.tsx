'use client';

export default function AdminUsers() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>Users Management</h1>
      </div>

      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
        <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', margin: '0 auto 24px' }}>
          <i className="bi bi-people"></i>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: '0 0 12px' }}>Manage Users in Supabase</h2>
        <p style={{ color: '#4b5563', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.5 }}>
          For security reasons and advanced user management, please manage user accounts, roles, and authentication settings directly in the Supabase Dashboard.
        </p>
        <a 
          href="https://supabase.com/dashboard" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#7c3aed', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}
        >
          Open Supabase Dashboard <i className="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
    </div>
  );
}

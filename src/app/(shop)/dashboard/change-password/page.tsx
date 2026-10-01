'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      setStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    if (form.newPass.length < 6) {
      setStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.newPass });
    setLoading(false);
    if (error) {
      setStatus({ type: 'error', msg: error.message });
    } else {
      setStatus({ type: 'success', msg: 'Password changed successfully!' });
      setForm({ current: '', newPass: '', confirm: '' });
    }
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Change Password</h1>
        </div>
      </div>

      <div className="shop-content">
        <div className="card border-0 shadow-sm" style={{ maxWidth: 480 }}>
          <div className="card-header bg-white py-3 fw-bold">Update Password</div>
          <div className="card-body p-4">
            {status && (
              <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} py-2`}>{status.msg}</div>
            )}
            <form onSubmit={handleChange}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">New Password</label>
                <input type="password" className="form-control" required minLength={6} value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirm New Password</label>
                <input type="password" className="form-control" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-dark fw-bold w-100">
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

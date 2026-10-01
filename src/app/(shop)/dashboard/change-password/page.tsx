'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ newPass: '', confirm: '' });
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
      setForm({ newPass: '', confirm: '' });
    }
  };

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Change Password</h1></div>
      </div>

      <div className="sp-body">
        <div className="info-card" style={{ maxWidth: 480 }}>
          <div className="info-card-header">Update Password</div>
          <div className="info-card-body">
            {status && (
              <div className={status.type === 'success' ? 'alert-success' : 'alert-error'} style={{ marginBottom: 20 }}>
                {status.msg}
              </div>
            )}
            <form onSubmit={handleChange}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-control-sp" 
                  required 
                  minLength={6} 
                  value={form.newPass} 
                  onChange={e => setForm({ ...form, newPass: e.target.value })} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control-sp" 
                  required 
                  value={form.confirm} 
                  onChange={e => setForm({ ...form, confirm: e.target.value })} 
                />
              </div>
              <button type="submit" disabled={loading} className="btn-sp btn-sp-dark" style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

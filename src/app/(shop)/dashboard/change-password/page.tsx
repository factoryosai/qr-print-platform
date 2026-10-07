'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase.auth.updateUser({ password });

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Security</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Update your account password</p>
        </div>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          
          {message.text && (
            <div style={{ padding: '16px', borderRadius: '8px', marginBottom: '24px', background: message.type === 'success' ? '#dcfce3' : '#fee2e2', color: message.type === 'success' ? '#16a34a' : '#dc2626', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
              {message.text}
            </div>
          )}

          <div className="info-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Change Password</h3>
            
            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '500', color: '#334155', fontSize: '14px', marginBottom: '8px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontWeight: '500', color: '#334155', fontSize: '14px', marginBottom: '8px' }}>Confirm New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit"
                disabled={saving}
                style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

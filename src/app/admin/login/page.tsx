'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const ADMIN_EMAIL = 'kaushiksavaliya909@gmail.com';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (email !== ADMIN_EMAIL) { setError('Access denied. This panel is for admin only.'); setLoading(false); return; }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); }
    else { router.push('/admin'); }
  };

  return (
    <>
      <header className="auth-header">
        <Link href="/" className="auth-brand"><span style={{ background: '#7c3aed' }}>A</span><b>Admin Panel</b></Link>
        <Link href="/">Back to website</Link>
      </header>
      <main className="auth-shell">
        <section className="auth-form">
          <div className="form-heading">
            <p>Super admin access</p>
            <h1>Admin login</h1>
            <span>Restricted to platform administrators only.</span>
          </div>
          {error && <div className="alert-error" style={{ marginTop: 16 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Admin email</label>
            <input id="email" type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
            <button className="auth-submit" type="submit" disabled={loading} style={{ background: '#7c3aed' }}>
              {loading ? 'Signing in…' : 'Sign in to Admin Panel'}
            </button>
          </form>
        </section>
        <aside className="auth-context">
          <div className="context-mark" style={{ background: '#7c3aed' }}>A</div>
          <h2>Platform control center.</h2>
          <div className="context-list">
            <div><b>01</b><span>View all shops and orders</span></div>
            <div><b>02</b><span>Monitor print agents</span></div>
            <div><b>03</b><span>Platform-wide stats</span></div>
          </div>
        </aside>
      </main>
    </>
  );
}

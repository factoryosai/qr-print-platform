'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push('/dashboard'); }
  };

  return (
    <>
      <header className="auth-header">
        <Link href="/" className="auth-brand">
          <span>QP</span><b>Qr To Print</b>
        </Link>
        <Link href="/">Back to website</Link>
      </header>

      <main className="auth-shell">
        <section className="auth-form">
          <div className="form-heading">
            <p>Official Qr To Print access</p>
            <h1>Shop owner login</h1>
            <span>Use the email and password you registered with. We never ask for your Google password.</span>
          </div>

          {error && <div className="alert-error" style={{ marginTop: 16 }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" required autoFocus
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="owner@yourshop.com" />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" type={showPw ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in to Shop Panel'}
            </button>
          </form>

          <div className="auth-switch">
            <span>New print shop?</span>
            <Link href="/signup">Create Qr To Print account</Link>
          </div>
        </section>

        <aside className="auth-context">
          <div className="context-mark">QP</div>
          <h2>Your own print-shop control panel.</h2>
          <div className="context-list">
            <div><b>01</b><span>Monitor customer print jobs</span></div>
            <div><b>02</b><span>Manage your connected printers</span></div>
            <div><b>03</b><span>Review wallet and print reports</span></div>
          </div>
        </aside>
      </main>
    </>
  );
}

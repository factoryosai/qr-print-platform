'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    if (authData.user) {
      const res = await fetch('/api/shop/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authData.user.id, shopName, ownerName, email }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to create shop'); setLoading(false); return; }
      router.push('/dashboard/downloads?welcome=1');
    }
  };

  return (
    <>
      <header className="auth-header">
        <Link href="/" className="auth-brand"><span>QP</span><b>Qr To Print</b></Link>
        <Link href="/">Back to website</Link>
      </header>

      <main className="auth-shell" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(300px,0.8fr)' }}>
        <section className="auth-form">
          <div className="form-heading">
            <p>Get started for free</p>
            <h1>Create your shop account</h1>
            <span>Set up your print shop in under 2 minutes. 5-day free demo included.</span>
          </div>

          {error && <div className="alert-error" style={{ marginTop: 16 }}>{error}</div>}

          <form onSubmit={handleSignup}>
            <label htmlFor="shopName">Shop name</label>
            <input id="shopName" type="text" required autoFocus
              value={shopName} onChange={e => setShopName(e.target.value)}
              placeholder="e.g. Raj Print Center" />

            <label htmlFor="ownerName">Owner name</label>
            <input id="ownerName" type="text"
              value={ownerName} onChange={e => setOwnerName(e.target.value)}
              placeholder="e.g. Kaushik Savaliya" />

            <label htmlFor="email">Email address</label>
            <input id="email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="owner@yourshop.com" />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" type={showPw ? 'text' : 'password'} required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Qr To Print account'}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link href="/login">Sign in to Shop Panel</Link>
          </div>
        </section>

        <aside className="auth-context">
          <div className="context-mark">QP</div>
          <h2>Everything your print shop needs.</h2>
          <div className="context-list">
            <div><b>01</b><span>Personal shop QR code poster</span></div>
            <div><b>02</b><span>Windows Print Agent for automatic printing</span></div>
            <div><b>03</b><span>Live queue, reports and wallet</span></div>
            <div><b>04</b><span>5-day free demo — no card required</span></div>
          </div>
        </aside>
      </main>
    </>
  );
}

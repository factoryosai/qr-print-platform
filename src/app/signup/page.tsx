'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const res = await fetch('/api/shop/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authData.user.id,
          shopName,
          email,
        }),
      });

      const json = await res.json();
      
      if (!res.ok) {
        setError(json.error || 'Failed to create shop profile');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 font-weight-bold">Register Your Shop</h2>
        
        {error && <div className="alert alert-danger p-2">{error}</div>}
        
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label font-weight-bold">Shop Name</label>
            <input 
              type="text" 
              required
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label font-weight-bold">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label font-weight-bold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-success w-100 mt-3 font-weight-bold"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-muted">
          Already have an account? <Link href="/login" className="text-decoration-none">Log In</Link>
        </p>
      </div>
    </div>
  );
}

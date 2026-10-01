'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ReferPage() {
  const [shop, setShop] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('shops').select('id,name').eq('owner_user_id', user.id).single();
      if (data) setShop(data);
    };
    init();
  }, []);

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/signup?ref=${shop?.id}` : '';

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Refer &amp; Earn</h1>
        </div>
      </div>

      <div className="shop-content">
        <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #111 0%, #1e293b 100%)', color: 'white' }}>
          <div className="card-body p-5 text-center">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
            <h3 className="fw-bold mb-2">Refer a shop, earn rewards</h3>
            <p style={{ color: '#9ca3af', maxWidth: 400, margin: '0 auto 24px' }}>
              Share your referral link with other print shop owners. When they sign up and activate a plan, you earn wallet credits.
            </p>
            {shop && (
              <div className="d-flex gap-2 justify-content-center" style={{ maxWidth: 500, margin: '0 auto' }}>
                <input readOnly value={referralLink} className="form-control bg-white text-dark font-monospace" style={{ fontSize: 12 }} />
                <button onClick={copy} className="btn btn-light fw-bold flex-shrink-0">
                  <i className={`bi ${copied ? 'bi-check' : 'bi-copy'} me-1`}></i>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            { icon: '👥', label: 'Total Referrals', value: 0 },
            { icon: '✅', label: 'Active Referrals', value: 0 },
            { icon: '💰', label: 'Credits Earned', value: '₹0' },
          ].map(s => (
            <div key={s.label} className="col-md-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 fw-bold">Referral History</div>
          <div className="card-body text-center text-muted py-5">
            <i className="bi bi-people" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
            No referrals yet. Share your link to start earning!
          </div>
        </div>
      </div>
    </>
  );
}

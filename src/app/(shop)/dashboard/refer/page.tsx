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
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Refer &amp; Earn</h1></div>
      </div>

      <div className="sp-body">
        <div className="shop-id-box" style={{ background: 'linear-gradient(135deg, #f43f64 0%, #db2777 100%)', textAlign: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>Refer a shop, earn rewards</h2>
            <p style={{ color: '#fbcfe8', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>
              Share your referral link with other print shop owners. When they sign up and activate a plan, you both earn wallet credits.
            </p>
            {shop && (
              <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 12, alignItems: 'center' }}>
                <input 
                  readOnly 
                  value={referralLink} 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, fontFamily: 'monospace', padding: '0 12px', outline: 'none' }} 
                />
                <button onClick={copy} className="btn-sp" style={{ background: '#fff', color: '#db2777' }}>
                  <i className={`bi ${copied ? 'bi-check' : 'bi-copy'}`}></i>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="stat-row" style={{ marginTop: 24 }}>
          {[
            { icon: 'bi-people', label: 'Total Referrals', value: 0, color: '#2563eb', bg: '#eff6ff' },
            { icon: 'bi-check-circle', label: 'Active Referrals', value: 0, color: '#059669', bg: '#f0fdf4' },
            { icon: 'bi-coin', label: 'Credits Earned', value: '₹0', color: '#d97706', bg: '#fffbeb' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ padding: '24px 20px', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="stat-icon" style={{ background: s.bg, width: 56, height: 56, fontSize: 24, marginBottom: 8 }}><i className={`bi ${s.icon}`} style={{ color: s.color }}></i></div>
              <div className="stat-val" style={{ fontSize: 28 }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <div className="table-card-header">
            <h2>Referral History</h2>
          </div>
          <div style={{ padding: 60, textAlign: 'center', color: '#687080' }}>
            <i className="bi bi-gift" style={{ fontSize: 32, display: 'block', marginBottom: 12, opacity: 0.4 }}></i>
            No referrals yet. Share your link to start earning!
          </div>
        </div>
      </div>
    </>
  );
}

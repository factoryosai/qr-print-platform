'use client';
import { useState } from 'react';

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://qrtoprint.com/register?ref=SHOP123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Refer & Earn</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Invite other shops and earn rewards</p>
        </div>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)', borderRadius: '16px', padding: '40px', color: '#fff', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', marginTop: 0 }}>Get 1 Month Free for Every Referral</h2>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px', lineHeight: 1.5 }}>
                Share Qr To Print with other shop owners. When they subscribe to a paid plan, both of you get 1 month added to your subscription completely free!
              </p>
              
              <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink} 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0 16px', fontSize: '16px', outline: 'none' }}
                />
                <button 
                  onClick={handleCopy}
                  style={{ padding: '12px 24px', background: '#fff', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
            <i className="bi bi-gift-fill" style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', fontSize: '120px', opacity: 0.2, zIndex: 0 }}></i>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total Referrals</div>
              <div style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>0</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Successful Conversions</div>
              <div style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>0</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Months Earned</div>
              <div style={{ color: '#0f172a', fontSize: '32px', fontWeight: 'bold' }}>0</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>Referral History</h3>
            <div className="table-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Shop Name</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Date Joined</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <i className="bi bi-people" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
                        <div>
                          <h4 style={{ margin: 0, color: '#0f172a', fontWeight: '600', fontSize: '18px' }}>No referrals yet</h4>
                          <p style={{ margin: '8px 0 0', color: '#64748b' }}>Share your link to start earning rewards.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

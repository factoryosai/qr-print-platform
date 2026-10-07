'use client';
import { useState } from 'react';

export default function WalletPage() {
  const plans = [
    { name: 'Demo', price: '₹0', duration: '5 days', features: ['50 Print Jobs', 'Basic Support', 'Standard Quality'], active: false },
    { name: 'Starter', price: '₹49', duration: '/mo', features: ['400 Print Jobs', 'Email Support', 'Standard Quality'], active: false },
    { name: 'Monthly', price: '₹99', duration: '/mo', features: ['Unlimited Jobs', 'Priority Support', 'Premium Features'], active: true, highlight: true },
    { name: 'Yearly', price: '₹599', duration: '/yr', features: ['Unlimited Jobs', '24/7 Phone Support', 'All Premium Features', 'Free Updates'], active: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Wallet & Plans</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your subscription and billing</p>
        </div>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>Subscription Plans</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {plans.map((plan, idx) => (
                <div key={idx} style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  boxShadow: plan.highlight ? '0 10px 25px rgba(239, 68, 68, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)', 
                  border: plan.highlight ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {plan.highlight && (
                    <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontWeight: '600', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a' }}>{plan.price}</span>
                    <span style={{ color: '#64748b' }}>{plan.duration}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1 }}>
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#334155', fontSize: '14px' }}>
                        <i className="bi bi-check-circle-fill" style={{ color: '#22c55e', fontSize: '16px' }}></i>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    border: plan.highlight ? 'none' : '1px solid #cbd5e1', 
                    background: plan.highlight ? '#ef4444' : '#fff', 
                    color: plan.highlight ? '#fff' : '#0f172a',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    {plan.active ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>Transaction History</h2>
            <div className="table-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Description</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '500', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <i className="bi bi-receipt" style={{ fontSize: '48px', color: '#cbd5e1' }}></i>
                        <div>
                          <h4 style={{ margin: 0, color: '#0f172a', fontWeight: '600', fontSize: '18px' }}>No transactions yet</h4>
                          <p style={{ margin: '8px 0 0', color: '#64748b' }}>Your billing history will appear here once you subscribe to a plan.</p>
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

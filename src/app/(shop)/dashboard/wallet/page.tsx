'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function WalletPage() {
  const plans = [
    { name: 'Demo', price: 0, period: '5 days', jobs: '10 demo jobs', highlight: false },
    { name: 'Starter', price: 49, period: 'per month', jobs: '400 print jobs', highlight: false },
    { name: 'Monthly', price: 99, period: 'per month', jobs: 'Unlimited jobs', highlight: true },
    { name: 'Yearly', price: 599, period: '365 days', jobs: 'Unlimited jobs', highlight: false },
  ];

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left"><small>Shop Panel</small><h1>Wallet &amp; Plans</h1></div>
      </div>

      <div className="sp-body">
        {/* Wallet Balance */}
        <div className="shop-id-box" style={{ background: '#1d4ed8' }}>
          <div>
            <div className="shop-id-label" style={{ color: '#bfdbfe' }}>Wallet Balance</div>
            <div className="shop-id-value">₹0.00</div>
            <div className="shop-id-sub" style={{ color: '#bfdbfe' }}>Add funds to activate your subscription plan.</div>
          </div>
          <div>
            <button className="btn-sp" style={{ background: '#fff', color: '#1d4ed8' }}>Add Funds</button>
          </div>
        </div>

        {/* Plans */}
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#171821' }}>Available Plans</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          {plans.map((plan) => (
            <div key={plan.name} className="info-card" style={{ marginBottom: 0, border: plan.highlight ? '2px solid #2563eb' : '1px solid #dfe3e8', display: 'flex', flexDirection: 'column' }}>
              <div className="info-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {plan.highlight && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800, alignSelf: 'flex-start', marginBottom: 12 }}>MOST POPULAR</span>}
                <div style={{ fontWeight: 700, fontSize: 15, color: '#687080' }}>{plan.name}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#171821', margin: '4px 0' }}>₹{plan.price}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 20 }}>{plan.period}</div>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: 13, color: '#171821' }}>
                  <li style={{ marginBottom: 8 }}><i className="bi bi-check2 text-success" style={{ marginRight: 8, fontSize: 16 }}></i>{plan.jobs}</li>
                  <li style={{ marginBottom: 8 }}><i className="bi bi-check2 text-success" style={{ marginRight: 8, fontSize: 16 }}></i>No per-print fee</li>
                  <li><i className="bi bi-check2 text-success" style={{ marginRight: 8, fontSize: 16 }}></i>Print Agent access</li>
                </ul>
                
                <button className={plan.highlight ? 'btn-sp btn-sp-primary' : 'btn-sp btn-sp-outline'} style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>
                  {plan.price === 0 ? 'Current Plan' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="table-card">
          <div className="table-card-header">
            <h2>Transaction History</h2>
          </div>
          <div style={{ padding: 40, textAlign: 'center', color: '#687080' }}>
            <i className="bi bi-clock-history" style={{ fontSize: 32, display: 'block', marginBottom: 8, opacity: 0.4 }}></i>
            No transactions yet.
          </div>
        </div>
      </div>
    </>
  );
}

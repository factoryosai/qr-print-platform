'use client';

export default function WalletPage() {
  const plans = [
    { name: 'Demo', price: 0, period: '5 days', jobs: '10 demo jobs', highlight: false },
    { name: 'Starter', price: 49, period: 'per month', jobs: '400 print jobs', highlight: false },
    { name: 'Monthly', price: 99, period: 'per month', jobs: 'Unlimited jobs', highlight: true },
    { name: 'Yearly', price: 599, period: '365 days', jobs: 'Unlimited jobs', highlight: false },
  ];

  return (
    <>
      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Wallet &amp; Plans</h1>
        </div>
      </div>

      <div className="shop-content">
        {/* Wallet Balance */}
        <div className="card border-0 shadow-sm mb-4" style={{ background: '#111', color: 'white' }}>
          <div className="card-body p-4">
            <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wallet Balance</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 4 }}>₹0.00</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Add funds to activate your subscription plan.</div>
            <button className="btn btn-light btn-sm fw-bold mt-3">Add Funds</button>
          </div>
        </div>

        {/* Plans */}
        <h5 className="fw-bold mb-3">Available Plans</h5>
        <div className="row g-3">
          {plans.map((plan) => (
            <div key={plan.name} className="col-md-6 col-xl-3">
              <div className={`card border-0 shadow-sm h-100 ${plan.highlight ? 'border-primary' : ''}`} style={plan.highlight ? { borderWidth: 2, borderStyle: 'solid', borderColor: '#2563eb' } : {}}>
                <div className="card-body p-4 d-flex flex-column">
                  {plan.highlight && <span className="badge bg-primary mb-2 align-self-start">Most Popular</span>}
                  <div className="fw-bold mb-1" style={{ fontSize: 15 }}>{plan.name}</div>
                  <div style={{ fontSize: 30, fontWeight: 800 }}>₹{plan.price}</div>
                  <div className="text-muted" style={{ fontSize: 12, marginBottom: 12 }}>{plan.period}</div>
                  <ul className="list-unstyled mb-4" style={{ fontSize: 13 }}>
                    <li className="mb-1"><i className="bi bi-check2 text-success me-1"></i>{plan.jobs}</li>
                    <li className="mb-1"><i className="bi bi-check2 text-success me-1"></i>No per-print fee</li>
                    <li><i className="bi bi-check2 text-success me-1"></i>Print Agent access</li>
                  </ul>
                  <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline-dark'} fw-bold mt-auto`}>
                    {plan.price === 0 ? 'Current Plan' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-white py-3 fw-bold">Transaction History</div>
          <div className="card-body text-center text-muted py-5">
            <i className="bi bi-clock-history" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
            No transactions yet.
          </div>
        </div>
      </div>
    </>
  );
}

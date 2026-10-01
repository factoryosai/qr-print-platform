'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DownloadsPage() {
  const [shop, setShop] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchShop = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (data) setShop(data);
    };
    fetchShop();
  }, []);

  const printUrl = shop ? `${typeof window !== 'undefined' ? window.location.origin : ''}/print/${shop.id}` : '';

  const copyShopId = () => {
    if (!shop) return;
    navigator.clipboard.writeText(shop.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shop) return <div className="p-4 text-muted">Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .dl-card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 20px; overflow: hidden; }
        .dl-card-header { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 10px; }
        .dl-card-header .badge-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .dl-card-body { padding: 20px; }
        .shop-id-box { background: #111; color: white; border-radius: 10px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .shop-id-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 4px; }
        .shop-id-box h2 { font-size: 28px; font-weight: 800; margin: 0; letter-spacing: 1px; }
        .shop-id-box .sub { font-size: 13px; color: #9ca3af; margin-top: 4px; }
        .agent-info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
        .agent-info-row:last-child { border-bottom: none; }
        .agent-info-row .key { color: #6b7280; }
        .agent-info-row .val { font-weight: 600; color: #111; }
        .agent-info-row .val a { color: #2563eb; text-decoration: none; }
        .qr-preview { width: 120px; height: 120px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb; }
        .welcome-banner { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; color: #166534; font-size: 13px; }
        .welcome-banner strong { font-weight: 700; }
      `}} />

      <div className="shop-topbar">
        <div>
          <div className="shop-topbar-label">Shop Panel</div>
          <h1>Downloads &amp; Shop ID</h1>
        </div>
        <Link href={`/print/${shop.id}`} target="_blank" className="btn btn-dark btn-sm fw-bold px-3">
          Open Print Page
        </Link>
      </div>

      <div className="shop-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <strong>Your shop is ready.</strong> Save your Shop ID, add a printer, then download the personalized Print Agent.
        </div>

        {/* Shop ID Box */}
        <div className="shop-id-box">
          <div>
            <div className="label">Permanent Shop ID</div>
            <h2>{shop.id}</h2>
            <div className="sub">Use this ID to log in and identify this shop&apos;s Print Agent package.</div>
            <button onClick={copyShopId} className="btn btn-sm btn-outline-light mt-3">
              <i className={`bi ${copied ? 'bi-check' : 'bi-clipboard'} me-1`}></i>
              {copied ? 'Copied!' : 'Copy Shop ID'}
            </button>
          </div>
          <div className="text-end">
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Agent package</div>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 16 }}>Printer required</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Add a printer before installation</div>
          </div>
        </div>

        <div className="row g-4">
          {/* QR Code Poster Card */}
          <div className="col-md-6">
            <div className="dl-card">
              <div className="dl-card-header">
                <div className="badge-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>QR</div>
                <div>
                  <div style={{ fontWeight: 700 }}>QR To Print Poster</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Download a personalized shop poster with your customer QR code.</div>
                </div>
              </div>
              <div className="dl-card-body">
                <div className="d-flex justify-content-center mb-4">
                  <div className="qr-preview">
                    <div className="text-center text-muted small p-2">
                      <i className="bi bi-qr-code" style={{ fontSize: 48, color: '#d1d5db' }}></i>
                      <div style={{ fontSize: 10 }}>QR Preview</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success fw-bold px-3">
                    <i className="bi bi-download me-1"></i> Download Poster PNG
                  </button>
                  <button className="btn btn-outline-secondary">
                    Preview Poster
                  </button>
                </div>

                <div className="mt-4">
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Shop logo</label>
                  <div className="text-muted" style={{ fontSize: 12, marginBottom: 8 }}>Optional. If no logo is uploaded, the poster downloads without a shop logo.</div>
                  <div className="d-flex align-items-center gap-2">
                    <label className="btn btn-outline-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      Choose File
                      <input type="file" accept=".jpg,.jpeg,.png,.webp" className="d-none" />
                    </label>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>No file chosen</span>
                    <button className="btn btn-dark btn-sm ms-auto fw-bold">Save Logo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Print Agent Card */}
          <div className="col-md-6">
            <div className="dl-card">
              <div className="dl-card-header">
                <div className="badge-icon" style={{ background: '#f3f4f6', color: '#374151' }}>PC</div>
                <div>
                  <div style={{ fontWeight: 700 }}>Personalized Print Agent</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>The ZIP includes your private configuration, agent script, start command and setup notes.</div>
                </div>
              </div>
              <div className="dl-card-body">
                <div className="agent-info-row">
                  <span className="key">Shop ID</span>
                  <span className="val">{shop.id}</span>
                </div>
                <div className="agent-info-row">
                  <span className="key">Printer</span>
                  <span className="val" style={{ color: '#6b7280' }}>Not selected</span>
                </div>
                <div className="agent-info-row">
                  <span className="key">Server</span>
                  <span className="val"><a href={typeof window !== 'undefined' ? window.location.origin : '#'}>{typeof window !== 'undefined' ? window.location.origin : 'your-site.vercel.app'}</a></span>
                </div>

                <div className="mt-4">
                  <button className="btn btn-dark w-100 fw-bold py-2" disabled>
                    Add Printer First
                  </button>
                  <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Go to Printers tab to add a printer. Then return here to download the agent.
                  </div>
                </div>

                <div className="mt-3 p-3 rounded" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Your Print URL</div>
                  <div className="d-flex gap-2">
                    <input readOnly value={printUrl} className="form-control form-control-sm bg-white font-monospace" style={{ fontSize: 11 }} />
                    <button onClick={() => navigator.clipboard.writeText(printUrl)} className="btn btn-sm btn-outline-secondary flex-shrink-0">
                      <i className="bi bi-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

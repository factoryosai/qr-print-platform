'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function DownloadsPage() {
  const [shop, setShop] = useState<any>(null);
  const [printers, setPrinters] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoDone, setLogoDone] = useState(false);
  const supabase = createClient();
  const isWelcome = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('welcome') === '1';

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: s } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (!s) return;
      setShop(s);
      const { data: p } = await supabase.from('printers').select('*').eq('shop_id', s.id);
      setPrinters(p || []);

      // Generate QR code
      const printUrl = `${window.location.origin}/print/${s.id}`;
      const qr = await QRCode.toDataURL(printUrl, { width: 200, margin: 1, color: { dark: '#171821', light: '#ffffff' } });
      setQrDataUrl(qr);
    };
    init();
  }, []);

  const copyShopId = () => {
    if (!shop) return;
    navigator.clipboard.writeText(shop.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPoster = async () => {
    if (!qrDataUrl || !shop) return;
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 850;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 600, 850);

    // Header band
    ctx.fillStyle = '#f43f64';
    ctx.fillRect(0, 0, 600, 90);

    // Logo text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Qr To Print', 300, 58);

    // QR code
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise(r => { qrImg.onload = r; });
    ctx.drawImage(qrImg, 150, 130, 300, 300);

    // Shop info
    ctx.fillStyle = '#171821';
    ctx.font = 'bold 28px Inter, Arial';
    ctx.fillText(shop.name, 300, 490);

    ctx.fillStyle = '#687080';
    ctx.font = '18px Inter, Arial';
    ctx.fillText('Scan to upload & print your documents', 300, 525);
    ctx.fillText('No app needed · Pay at counter', 300, 555);

    ctx.fillStyle = '#f43f64';
    ctx.font = 'bold 16px Inter, Arial';
    ctx.fillText(`Shop ID: ${shop.id}`, 300, 600);

    // QR URL
    ctx.fillStyle = '#687080';
    ctx.font = '13px Inter, Arial';
    ctx.fillText(`${window.location.origin}/print/${shop.id}`, 300, 640);

    // Footer
    ctx.fillStyle = '#f5f7f8';
    ctx.fillRect(0, 790, 600, 60);
    ctx.fillStyle = '#687080';
    ctx.font = '13px Inter, Arial';
    ctx.fillText('Powered by Qr To Print · qrtoprint.in', 300, 825);

    const a = document.createElement('a');
    a.download = `QRToPrint-Poster-${shop.id}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const saveLogoHandler = async () => {
    if (!logoFile || !shop) return;
    setLogoSaving(true);
    const path = `logos/${shop.id}/${logoFile.name}`;
    await supabase.storage.from('print-files').upload(path, logoFile, { upsert: true });
    const { data: urlData } = supabase.storage.from('print-files').getPublicUrl(path);
    await supabase.from('shops').update({ logo_url: urlData.publicUrl }).eq('id', shop.id);
    setLogoSaving(false);
    setLogoDone(true);
  };

  const printUrl = shop && typeof window !== 'undefined' ? `${window.location.origin}/print/${shop.id}` : '';

  if (!shop) return (
    <div className="sp-body" style={{ color: '#687080' }}>Loading…</div>
  );

  return (
    <>
      <div className="sp-topbar">
        <div className="sp-topbar-left">
          <small>Shop Panel</small>
          <h1>Downloads &amp; Shop ID</h1>
        </div>
        <Link href={`/print/${shop.id}`} target="_blank" className="btn-sp btn-sp-dark">
          Open Print Page <i className="bi bi-arrow-up-right"></i>
        </Link>
      </div>

      <div className="sp-body">
        {/* Welcome */}
        {isWelcome && (
          <div className="alert-success" style={{ marginBottom: 20 }}>
            <strong>Your shop is ready.</strong> Save your Shop ID, add a printer, then download the personalized Print Agent.
          </div>
        )}

        {/* Shop ID Box */}
        <div className="shop-id-box">
          <div>
            <div className="shop-id-label">Permanent Shop ID</div>
            <div className="shop-id-value">{shop.id}</div>
            <div className="shop-id-sub">Use this ID to log in and identify this shop&apos;s Print Agent package.</div>
            <button onClick={copyShopId} className="btn-copy" style={{ marginTop: 12 }}>
              <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`}></i> {copied ? 'Copied!' : 'Copy Shop ID'}
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Agent package</div>
            {printers.length === 0
              ? <><div style={{ color: '#f59e0b', fontWeight: 800 }}>Printer required</div><div style={{ fontSize: 12, color: '#9ca3af' }}>Add a printer before installation</div></>
              : <><div style={{ color: '#4ade80', fontWeight: 800 }}>Ready to download</div><div style={{ fontSize: 12, color: '#9ca3af' }}>{printers.length} printer(s) configured</div></>
            }
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* QR Code Poster Card */}
          <div className="info-card">
            <div className="info-card-header">
              <span style={{ background: '#dbeafe', color: '#1e40af', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>QR</span>
              <div>
                <div style={{ fontWeight: 700 }}>QR To Print Poster</div>
                <div style={{ fontSize: 12, color: '#687080', fontWeight: 400 }}>Download a personalized shop poster with your customer QR code.</div>
              </div>
            </div>
            <div className="info-card-body">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                {qrDataUrl
                  ? <img src={qrDataUrl} alt="Shop QR Code" style={{ width: 140, height: 140, border: '1px solid #dfe3e8', borderRadius: 8, padding: 8 }} />
                  : <div style={{ width: 140, height: 140, border: '1px solid #dfe3e8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12 }}>Generating…</div>
                }
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button onClick={downloadPoster} className="btn-sp btn-sp-success" disabled={!qrDataUrl}>
                  <i className="bi bi-download"></i> Download Poster PNG
                </button>
                {qrDataUrl && <a href={qrDataUrl} target="_blank" rel="noopener noreferrer" className="btn-sp btn-sp-outline">Preview</a>}
              </div>

              <div style={{ borderTop: '1px solid #dfe3e8', paddingTop: 16 }}>
                <div className="form-label">Shop logo</div>
                <div style={{ fontSize: 12, color: '#687080', marginBottom: 8 }}>Optional. If no logo is uploaded, the poster downloads without a shop logo.</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <label className="btn-sp btn-sp-outline" style={{ cursor: 'pointer' }}>
                    Choose File <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => setLogoFile(e.target.files?.[0] || null)} />
                  </label>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{logoFile ? logoFile.name : 'No file chosen'}</span>
                  {logoFile && (
                    <button onClick={saveLogoHandler} className="btn-sp btn-sp-dark" disabled={logoSaving} style={{ marginLeft: 'auto' }}>
                      {logoDone ? '✓ Saved' : logoSaving ? 'Saving…' : 'Save Logo'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Print Agent Card */}
          <div className="info-card">
            <div className="info-card-header">
              <span style={{ background: '#f3f4f6', color: '#374151', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>PC</span>
              <div>
                <div style={{ fontWeight: 700 }}>Personalized Print Agent</div>
                <div style={{ fontSize: 12, color: '#687080', fontWeight: 400 }}>The ZIP includes your private configuration, agent script, start command and setup notes.</div>
              </div>
            </div>
            <div className="info-card-body">
              {[
                ['Shop ID', shop.id],
                ['Printer', printers[0]?.name || 'Not selected'],
                ['Server', typeof window !== 'undefined' ? window.location.origin : ''],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                  <span style={{ color: '#687080' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <button className="btn-sp btn-sp-dark" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} disabled={printers.length === 0}>
                {printers.length === 0 ? 'Add Printer First' : <><i className="bi bi-download"></i> Download Print Agent ZIP</>}
              </button>
              {printers.length === 0 && (
                <div style={{ fontSize: 12, color: '#687080', marginTop: 8, textAlign: 'center' }}>
                  <Link href="/dashboard/printers" style={{ color: '#1d4ed8', fontWeight: 600 }}>Go to Printers tab</Link> to add a printer first.
                </div>
              )}

              <div style={{ background: '#f5f7f8', borderRadius: 8, padding: '12px 14px', marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Your Print Page URL</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input readOnly value={printUrl} style={{ flex: 1, background: '#fff', border: '1px solid #dfe3e8', borderRadius: 5, padding: '7px 10px', fontSize: 11, fontFamily: 'monospace', outline: 'none' }} />
                  <button onClick={() => navigator.clipboard.writeText(printUrl)} className="btn-sp btn-sp-outline" style={{ flexShrink: 0 }}>
                    <i className="bi bi-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

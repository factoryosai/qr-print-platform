'use client';

import { useEffect, useState } from 'react';

type Step = 'service' | 'upload' | 'settings' | 'details' | 'confirm';

const SERVICES = [
  { id: 'document', label: 'Document', icon: 'bi-file-earmark-text', desc: 'PDF, Word, images' },
  { id: 'aadhaar', label: 'Aadhaar Card', icon: 'bi-credit-card-2-front', desc: 'Front + back composite' },
  { id: 'pan', label: 'PAN Card', icon: 'bi-credit-card', desc: 'Single or composite' },
  { id: 'photo', label: 'Passport Photo', icon: 'bi-person-bounding-box', desc: 'Up to 25 per A4' },
  { id: 'resume', label: 'Resume', icon: 'bi-file-earmark-person', desc: 'PDF or image' },
  { id: 'xerox', label: 'Xerox / Copy', icon: 'bi-copy', desc: 'Photocopy job' },
];

export default function PrintPage({ params }: { params: { shopId: string } }) {
  const [shop, setShop] = useState<any>(null);
  const [step, setStep] = useState<Step>('service');
  const [service, setService] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({ paper_size: 'A4', color_mode: 'bw', duplex: false, copies: 1, orientation: 'portrait' });
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNum, setOrderNum] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/shop-info/${params.shopId}`).then(r => r.json()).then(d => setShop(d.shop)).catch(() => {});
  }, [params.shopId]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setFile(e.target.files[0]); setStep('settings'); }
  };

  const submitOrder = async () => {
    if (!file) return;
    setLoading(true); setError('');
    try {
      const urlRes = await fetch('/api/upload-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId: params.shopId, fileName: file.name }) });
      const { signedUrl, path } = await urlRes.json();
      await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      const orderRes = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shopId: params.shopId, customer, settings: { ...settings, service_type: service }, file: { fileName: file.name, path } }) });
      const json = await orderRes.json();
      if (!orderRes.ok) throw new Error(json.error || 'Order failed');
      setOrderId(json.orderId); setOrderNum(json.orderNumber); setStep('confirm');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const pricePerPage = settings.color_mode === 'color' ? 10 : 2;
  const estimatedPages = file ? Math.max(1, Math.ceil(file.size / 50000)) : 1;
  const estimatedPrice = estimatedPages * pricePerPage * settings.copies;

  const stepLabels: Record<Step, string> = { service: 'Choose Service', upload: 'Upload File', settings: 'Print Settings', details: 'Your Details', confirm: 'Confirmed' };
  const stepOrder: Step[] = ['service', 'upload', 'settings', 'details', 'confirm'];
  const stepIndex = stepOrder.indexOf(step);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .print-page { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .print-header { background: white; border-bottom: 1px solid #e5e7eb; padding: 14px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 10; }
        .print-header-icon { width: 36px; height: 36px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px; }
        .print-header h2 { margin: 0; font-size: 16px; font-weight: 700; }
        .print-header p { margin: 0; font-size: 12px; color: #6b7280; }
        .print-body { max-width: 520px; margin: 0 auto; padding: 24px 16px; }
        .step-bar { display: flex; gap: 4px; margin-bottom: 24px; }
        .step-dot { height: 4px; border-radius: 2px; flex: 1; background: #e5e7eb; transition: background 0.3s; }
        .step-dot.done { background: #2563eb; }
        .service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .service-card { border: 2px solid #e5e7eb; border-radius: 12px; padding: 14px; cursor: pointer; transition: all 0.2s; background: white; text-align: left; }
        .service-card:hover { border-color: #93c5fd; background: #eff6ff; }
        .service-card.selected { border-color: #2563eb; background: #eff6ff; }
        .service-card i { font-size: 22px; color: #2563eb; display: block; margin-bottom: 6px; }
        .service-card strong { font-size: 13px; display: block; }
        .service-card span { font-size: 11px; color: #9ca3af; }
        .upload-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 40px 20px; text-align: center; cursor: pointer; background: white; transition: all 0.2s; }
        .upload-zone:hover { border-color: #93c5fd; background: #f0f9ff; }
        .form-label-custom { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px; display: block; }
        .settings-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .price-badge { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; text-align: center; margin-bottom: 20px; }
        .price-badge strong { font-size: 22px; color: #166534; font-weight: 800; }
        .price-badge span { font-size: 12px; color: #4ade80; display: block; }
        .btn-primary-custom { width: 100%; background: #2563eb; color: white; border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-primary-custom:hover { background: #1d4ed8; }
        .btn-primary-custom:disabled { opacity: 0.6; cursor: not-allowed; }
        .confirm-card { background: white; border-radius: 16px; border: 2px solid #bbf7d0; padding: 32px 24px; text-align: center; }
        .confirm-icon { width: 64px; height: 64px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; }
        .section-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #111827; }
      `}} />
      <div className="print-page">
        <div className="print-header">
          <div className="print-header-icon">QP</div>
          <div>
            <h2>{shop?.name || params.shopId}</h2>
            <p><i className="bi bi-geo-alt"></i> {shop?.address || 'Print Shop'}</p>
          </div>
          {step !== 'confirm' && <div style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af' }}>{stepLabels[step]}</div>}
        </div>

        <div className="print-body">
          {/* Progress bar */}
          <div className="step-bar">
            {stepOrder.slice(0, -1).map((s, i) => (
              <div key={s} className={`step-dot ${i <= stepIndex ? 'done' : ''}`}></div>
            ))}
          </div>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>{error}</div>}

          {/* STEP 1: Choose Service */}
          {step === 'service' && (
            <div>
              <h3 className="section-title">What do you want to print?</h3>
              <div className="service-grid">
                {SERVICES.map(s => (
                  <button key={s.id} className={`service-card ${service === s.id ? 'selected' : ''}`} onClick={() => { setService(s.id); setStep('upload'); }}>
                    <i className={`bi ${s.icon}`}></i>
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Upload */}
          {step === 'upload' && (
            <div>
              <h3 className="section-title">Upload your file</h3>
              <label className="upload-zone">
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: 40, color: '#93c5fd', display: 'block', marginBottom: 12 }}></i>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Tap to choose file</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>PDF, JPG, PNG · Max 20MB</div>
                <input type="file" className="d-none" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
              </label>
              <button onClick={() => setStep('service')} style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', marginTop: 16, fontSize: 13, cursor: 'pointer' }}>
                ← Back to services
              </button>
            </div>
          )}

          {/* STEP 3: Settings */}
          {step === 'settings' && (
            <div>
              <h3 className="section-title">Print Settings</h3>
              {file && (
                <div style={{ background: '#f0f9ff', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="bi bi-file-earmark-check" style={{ color: '#2563eb', fontSize: 20 }}></i>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
              )}
              <div className="settings-row">
                <div>
                  <label className="form-label-custom">Color Mode</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['bw', 'color'].map(m => (
                      <button key={m} onClick={() => setSettings({ ...settings, color_mode: m })}
                        style={{ flex: 1, padding: '8px', borderRadius: 8, border: `2px solid ${settings.color_mode === m ? '#2563eb' : '#e5e7eb'}`, background: settings.color_mode === m ? '#eff6ff' : 'white', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                        {m === 'bw' ? '⬛ B&W' : '🌈 Color'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label-custom">Paper Size</label>
                  <select className="form-select form-select-sm" value={settings.paper_size} onChange={e => setSettings({ ...settings, paper_size: e.target.value })}>
                    <option>A4</option><option>A3</option><option>Letter</option><option>Legal</option>
                  </select>
                </div>
              </div>
              <div className="settings-row">
                <div>
                  <label className="form-label-custom">Copies</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setSettings({ ...settings, copies: Math.max(1, settings.copies - 1) })} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontWeight: 700, cursor: 'pointer' }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{settings.copies}</span>
                    <button onClick={() => setSettings({ ...settings, copies: settings.copies + 1 })} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontWeight: 700, cursor: 'pointer' }}>+</button>
                  </div>
                </div>
                <div>
                  <label className="form-label-custom">Orientation</label>
                  <select className="form-select form-select-sm" value={settings.orientation} onChange={e => setSettings({ ...settings, orientation: e.target.value })}>
                    <option value="portrait">Portrait</option><option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.duplex} onChange={e => setSettings({ ...settings, duplex: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 13 }}>Double-sided printing (Duplex)</span>
                </label>
              </div>
              <div className="price-badge">
                <strong>≈ ₹{estimatedPrice}</strong>
                <span>Estimated amount · Pay at counter</span>
              </div>
              <button className="btn-primary-custom" onClick={() => setStep('details')}>Continue →</button>
            </div>
          )}

          {/* STEP 4: Customer Details */}
          {step === 'details' && (
            <div>
              <h3 className="section-title">Your Details</h3>
              <div style={{ marginBottom: 14 }}>
                <label className="form-label-custom">Your Name</label>
                <input className="form-control" placeholder="e.g. Rahul Sharma" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label-custom">Mobile Number</label>
                <input className="form-control" type="tel" placeholder="10-digit mobile" value={customer.mobile} onChange={e => setCustomer({ ...customer, mobile: e.target.value })} maxLength={10} />
              </div>

              {/* Order Summary */}
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: '#6b7280', textTransform: 'uppercase' }}>Order Summary</div>
                {[
                  ['Service', service.charAt(0).toUpperCase() + service.slice(1)],
                  ['File', file?.name],
                  ['Color', settings.color_mode === 'bw' ? 'Black & White' : 'Color'],
                  ['Paper', settings.paper_size],
                  ['Copies', settings.copies],
                  ['Est. Amount', `₹${estimatedPrice}`],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{String(v)}</span>
                  </div>
                ))}
              </div>

              <button className="btn-primary-custom" onClick={submitOrder} disabled={loading || !customer.name || !customer.mobile || customer.mobile.length < 10}>
                {loading ? 'Submitting...' : '✓ Submit Print Job'}
              </button>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 'confirm' && (
            <div className="confirm-card">
              <div className="confirm-icon">✅</div>
              <h3 style={{ fontWeight: 800, marginBottom: 4 }}>Order Placed!</h3>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>Your print job has been sent to the shop queue.</p>

              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#111' }}>{orderNum}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Order Number — show this at counter</div>
              </div>

              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
                <p>✓ File uploaded securely</p>
                <p>✓ Job sent to printer queue</p>
                <p>💵 Pay <strong>₹{estimatedPrice}</strong> at the counter</p>
              </div>

              <a href={`/order/${orderId}`} style={{ display: 'block', background: '#111', color: 'white', borderRadius: 10, padding: '12px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                Track Order Status →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

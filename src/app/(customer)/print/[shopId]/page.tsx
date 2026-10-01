'use client';

import { useEffect, useState } from 'react';

const PRICING = { bw: 3, color: 8 };
const PAPER_FACTOR: Record<string, number> = { A4: 1, A3: 2, A2: 4, A1: 8 };

const SERVICES = [
  { value: 'document', label: 'Document Print', desc: 'PDF, JPG or PNG with page controls', multi: true, accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'passport_photo', label: 'Passport Photos', desc: '35 × 45 mm photos arranged on A4', multi: false, accept: '.jpg,.jpeg,.png' },
  { value: 'id_card', label: 'ID / Aadhaar Card', desc: 'Front and back arranged on A4 sheet', multi: true, accept: '.jpg,.jpeg,.png' },
  { value: 'resume', label: 'Resume Print', desc: 'Clean PDF or image resume printing', multi: false, accept: '.pdf,.jpg,.jpeg,.png' },
];

const SERVICE_HELP: Record<string, string> = {
  document: 'Upload one or more PDF or image documents below.',
  passport_photo: 'Upload one clear portrait photo. A 35 × 45 mm A4 photo sheet will be generated.',
  id_card: 'Upload the front image first and back image second. Both are placed on one A4 sheet.',
  resume: 'Upload your resume as a PDF, JPG or PNG.',
};

export default function PrintPage({ params }: { params: { shopId: string } }) {
  const [shop, setShop] = useState<any>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [service, setService] = useState('document');
  const [files, setFiles] = useState<FileList | null>(null);
  const [colorMode, setColorMode] = useState('bw');
  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState('A4');
  const [pageRange, setPageRange] = useState('');
  const [orientation, setOrientation] = useState('portrait');
  const [duplex, setDuplex] = useState(false);
  const [mobile, setMobile] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderNum, setOrderNum] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/shop-info/${params.shopId}`)
      .then(r => r.json())
      .then(d => { if (d.shop) setShop(d.shop); })
      .catch(() => {})
      .finally(() => setShopLoading(false));
  }, [params.shopId]);

  const fileCount = files?.length || 0;
  const estimate = fileCount > 0
    ? (fileCount * copies * PRICING[colorMode as 'bw' | 'color'] * (PAPER_FACTOR[paperSize] || 1)).toFixed(2)
    : (1 * copies * PRICING[colorMode as 'bw' | 'color'] * (PAPER_FACTOR[paperSize] || 1)).toFixed(2);

  const currentService = SERVICES.find(s => s.value === service)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) { setError('Please select at least one file.'); return; }
    if (!customerName.trim()) { setError('Please enter your name.'); return; }
    setSubmitting(true); setError('');
    try {
      // Upload file
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: params.shopId, fileName: files[0].name }),
      });
      const { signedUrl, path } = await urlRes.json();
      await fetch(signedUrl, { method: 'PUT', body: files[0], headers: { 'Content-Type': files[0].type } });

      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: params.shopId,
          customer: { name: customerName, mobile },
          settings: { paper_size: paperSize, color_mode: colorMode, duplex, orientation, copies, page_range: pageRange, service_type: service },
          file: { fileName: files[0].name, path },
        }),
      });
      const json = await orderRes.json();
      if (!orderRes.ok) throw new Error(json.error || 'Failed to create order');
      setOrderId(json.orderId);
      setOrderNum(json.orderNumber);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  if (shopLoading) return (
    <div style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#687080' }}>Loading shop…</div>
  );

  if (!shop) return (
    <div style={{ minHeight: '100vh', background: '#f5f7f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
        <h2 style={{ fontWeight: 800 }}>Shop not found</h2>
        <p style={{ color: '#687080' }}>This print link may be incorrect or the shop is inactive.</p>
      </div>
    </div>
  );

  if (submitted) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <header className="print-header">
        <a className="print-brand" href="/"><span>QP</span><b>QR Print</b></a>
        <div className="shop-state"><span>{shop.name}</span></div>
      </header>
      <main className="print-shell">
        <div className="confirm-box">
          <div className="confirm-icon">✅</div>
          <h2>Print Request Sent!</h2>
          <p>Your job is in the shop queue. Collect from the counter when ready.</p>
          <div className="confirm-order-num">{orderNum}</div>
          <div className="confirm-sub">Order Number — show this at the counter</div>
          <div className="confirm-amount">Pay <strong>₹{estimate}</strong> at the counter</div>
          <a href={`/order/${orderId}`} className="btn-track">Track Order Status →</a>
          <a href={`/print/${params.shopId}`} className="btn-another">Submit another print</a>
        </div>
      </main>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <header className="print-header">
        <a className="print-brand" href="/"><span>QP</span><b>QR Print</b></a>
        <div className="shop-state"><span>{shop.name}</span></div>
      </header>

      <main className="print-shell">
        <div className="rate-summary">
          <span>B&amp;W <b>Rs {PRICING.bw}.00</b></span>
          <span>Color <b>Rs {PRICING.color}.00</b></span>
          <small>A4 per page</small>
        </div>

        {error && <div className="print-error">{error}</div>}

        <form id="printForm" className="print-form" onSubmit={handleSubmit}>

          {/* Section 1: Service */}
          <section className="print-panel service-panel">
            <div className="panel-title">
              <span>1</span>
              <div><h2>Choose print service</h2><p>Select what you want the shop to prepare</p></div>
            </div>
            <div className="service-grid">
              {SERVICES.map(s => (
                <label key={s.value} className={service === s.value ? 'selected' : ''}>
                  <input type="radio" name="service_type" value={s.value} checked={service === s.value} onChange={() => setService(s.value)} />
                  <span><b>{s.label}</b><small>{s.desc}</small></span>
                </label>
              ))}
            </div>
            <p className="service-help">{SERVICE_HELP[service]}</p>
          </section>

          {/* Section 2: Upload */}
          <section className="print-panel upload-panel">
            <div className="panel-title">
              <span>2</span>
              <div><h2>Select documents</h2><p>PDF, JPG or PNG · Up to 20 MB each</p></div>
            </div>
            <label className="upload-zone" htmlFor="files">
              <input id="files" type="file" name="files[]"
                multiple={currentService.multi}
                accept={currentService.accept}
                onChange={e => setFiles(e.target.files)}
                required />
              <span className="upload-symbol">↑</span>
              <strong>Choose files</strong>
              <small>Tap to browse from your phone or computer</small>
            </label>
            <div className={`file-status ${fileCount > 0 ? 'ready' : ''}`}>
              {fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected` : 'No files selected'}
            </div>
          </section>

          {/* Section 3: Print Settings */}
          <section className="print-panel">
            <div className="panel-title">
              <span>3</span>
              <div><h2>Print settings</h2><p>Options apply to every selected file</p></div>
            </div>

            <div className="option-block">
              <label>Print mode</label>
              <div className="segment two">
                <label className={colorMode === 'bw' ? 'checked' : ''}>
                  <input type="radio" name="color_mode" value="bw" checked={colorMode === 'bw'} onChange={() => setColorMode('bw')} />
                  <span><b>Black &amp; White</b><small>Rs {PRICING.bw}.00 / A4 page</small></span>
                </label>
                <label className={colorMode === 'color' ? 'checked' : ''}>
                  <input type="radio" name="color_mode" value="color" checked={colorMode === 'color'} onChange={() => setColorMode('color')} />
                  <span><b>Color</b><small>Rs {PRICING.color}.00 / A4 page</small></span>
                </label>
              </div>
            </div>

            <div className="option-grid">
              <div>
                <label htmlFor="copies">Copies</label>
                <div className="stepper">
                  <button type="button" onClick={() => setCopies(Math.max(1, copies - 1))}>−</button>
                  <input id="copies" type="number" value={copies} min={1} max={99} onChange={e => setCopies(Math.max(1, +e.target.value))} />
                  <button type="button" onClick={() => setCopies(copies + 1)}>+</button>
                </div>
              </div>
              <div>
                <label htmlFor="paper_size">Paper size</label>
                <select id="paper_size" value={paperSize} onChange={e => setPaperSize(e.target.value)}>
                  <option>A4</option><option>A3</option><option>A2</option><option>A1</option>
                </select>
              </div>
              <div>
                <label htmlFor="page_range">Pages</label>
                <input id="page_range" value={pageRange} onChange={e => setPageRange(e.target.value)} placeholder="All or 1-3,5" />
              </div>
              <div>
                <label htmlFor="customer_mobile">Mobile number</label>
                <input id="customer_mobile" type="tel" inputMode="numeric" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <div className="option-block">
              <label>Orientation</label>
              <div className="segment two compact">
                <label className={orientation === 'portrait' ? 'checked' : ''}>
                  <input type="radio" name="orientation" value="portrait" checked={orientation === 'portrait'} onChange={() => setOrientation('portrait')} />
                  <span><b>Portrait</b></span>
                </label>
                <label className={orientation === 'landscape' ? 'checked' : ''}>
                  <input type="radio" name="orientation" value="landscape" checked={orientation === 'landscape'} onChange={() => setOrientation('landscape')} />
                  <span><b>Landscape</b></span>
                </label>
              </div>
            </div>

            <label className="check-row">
              <input type="checkbox" checked={duplex} onChange={e => setDuplex(e.target.checked)} />
              <span><b>Print on both sides</b><small>Duplex printing</small></span>
            </label>
          </section>

          {/* Section 4: Customer name + Submit */}
          <section className="print-panel">
            <div className="panel-title">
              <span>4</span>
              <div><h2>Payment and submit</h2><p>Review the request before sending</p></div>
            </div>

            <div className="option-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <label htmlFor="customerName">Your name <span style={{ color: '#f43f64' }}>*</span></label>
                <input id="customerName" type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Rahul Sharma" required />
              </div>
            </div>

            <div className="single-payment">
              <span>Payment</span><b>Cash at counter</b>
            </div>

            <div className="submit-summary">
              <div>
                <span>Estimated minimum</span>
                <strong id="estimate">Rs {estimate}</strong>
                <small>Based on {fileCount || 1} page{fileCount > 1 ? 's' : ''} per selected file</small>
              </div>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Print Request'}
              </button>
            </div>
            <p className="print-note">Status becomes Picked when sent to Windows and Printed after the shop confirms the paper output.</p>
          </section>
        </form>
      </main>
    </>
  );
}

const printCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, 'Segoe UI', Arial, sans-serif; background: #f5f7f8; color: #171821; }
  
  .print-header {
    height: 58px; background: #fff; border-bottom: 1px solid #dfe3e8;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; position: sticky; top: 0; z-index: 50;
  }
  .print-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: #171821; font-weight: 800; font-size: 16px; }
  .print-brand span { width: 30px; height: 30px; background: #f43f64; border-radius: 6px; display: grid; place-items: center; color: #fff; font-size: 11px; font-weight: 900; }
  .shop-state { font-size: 13px; font-weight: 600; color: #687080; }
  
  .print-shell { max-width: 540px; margin: 0 auto; padding: 20px 16px 40px; }
  
  .rate-summary { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 10px 16px; margin-bottom: 16px; font-size: 14px; }
  .rate-summary b { color: #171821; font-weight: 700; }
  .rate-summary small { margin-left: auto; color: #687080; font-size: 12px; }

  .print-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-bottom: 12px; }

  .print-form { display: flex; flex-direction: column; gap: 16px; }

  .print-panel { background: #fff; border: 1px solid #dfe3e8; border-radius: 10px; padding: 20px; }
  
  .panel-title { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
  .panel-title > span { width: 28px; height: 28px; border-radius: 50%; background: #171821; color: #fff; font-size: 13px; font-weight: 800; display: grid; place-items: center; flex-shrink: 0; }
  .panel-title h2 { font-size: 16px; font-weight: 800; margin-bottom: 2px; }
  .panel-title p { font-size: 12px; color: #687080; }
  
  .service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .service-grid label { display: flex; align-items: flex-start; gap: 10px; border: 1.5px solid #dfe3e8; border-radius: 8px; padding: 12px; cursor: pointer; transition: border-color 0.2s; }
  .service-grid label:hover { border-color: #f43f64; }
  .service-grid label.selected, .service-grid label:has(input:checked) { border-color: #f43f64; background: #fff5f7; }
  .service-grid input[type=radio] { margin-top: 2px; accent-color: #f43f64; flex-shrink: 0; }
  .service-grid span b { display: block; font-size: 13px; font-weight: 700; }
  .service-grid span small { color: #687080; font-size: 11px; }
  .service-help { font-size: 13px; color: #687080; }

  .upload-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #dfe3e8; border-radius: 10px; padding: 36px 20px; cursor: pointer; transition: all 0.2s; text-align: center; margin-bottom: 10px; }
  .upload-zone:hover { border-color: #f43f64; background: #fff5f7; }
  .upload-zone input { display: none; }
  .upload-symbol { font-size: 32px; color: #dfe3e8; margin-bottom: 8px; display: block; }
  .upload-zone strong { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .upload-zone small { color: #687080; font-size: 12px; }
  
  .file-status { font-size: 13px; color: #687080; min-height: 20px; }
  .file-status.ready { color: #059669; font-weight: 600; }

  .option-block { margin-bottom: 16px; }
  .option-block > label, .option-grid label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #171821; }
  
  .segment { display: flex; gap: 8px; }
  .segment label { flex: 1; display: flex; align-items: flex-start; gap: 8px; border: 1.5px solid #dfe3e8; border-radius: 8px; padding: 10px 12px; cursor: pointer; transition: all 0.2s; }
  .segment label:hover { border-color: #f43f64; }
  .segment label.checked, .segment label:has(input:checked) { border-color: #f43f64; background: #fff5f7; }
  .segment input { margin-top: 3px; accent-color: #f43f64; flex-shrink: 0; }
  .segment span b { display: block; font-size: 13px; font-weight: 700; }
  .segment span small { display: block; color: #687080; font-size: 11px; margin-top: 1px; }
  .segment.compact label { padding: 8px 12px; }
  .segment.compact span b { font-size: 13px; }

  .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .option-grid input, .option-grid select { width: 100%; padding: 9px 10px; border: 1px solid #dfe3e8; border-radius: 6px; font-size: 13px; background: #fff; color: #171821; outline: none; font-family: inherit; }
  .option-grid input:focus, .option-grid select:focus { border-color: #f43f64; }
  
  .stepper { display: flex; align-items: center; border: 1px solid #dfe3e8; border-radius: 6px; overflow: hidden; }
  .stepper button { width: 34px; height: 38px; background: #f5f7f8; border: none; font-size: 18px; cursor: pointer; font-weight: 700; color: #171821; flex-shrink: 0; }
  .stepper button:hover { background: #eee; }
  .stepper input { flex: 1; border: none; border-left: 1px solid #dfe3e8; border-right: 1px solid #dfe3e8; text-align: center; font-size: 15px; font-weight: 700; padding: 0; height: 38px; outline: none; font-family: inherit; }

  .check-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; padding: 10px 0; }
  .check-row input { margin-top: 2px; accent-color: #f43f64; width: 16px; height: 16px; flex-shrink: 0; }
  .check-row span b { display: block; font-size: 13px; font-weight: 700; }
  .check-row span small { color: #687080; font-size: 12px; }

  .single-payment { display: flex; align-items: center; justify-content: space-between; background: #f5f7f8; border-radius: 8px; padding: 12px 14px; margin: 16px 0; font-size: 14px; }
  .single-payment span { color: #687080; }
  .single-payment b { font-weight: 700; }

  .submit-summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .submit-summary span { font-size: 12px; color: #687080; display: block; margin-bottom: 2px; }
  .submit-summary strong { font-size: 22px; font-weight: 900; display: block; }
  .submit-summary small { font-size: 11px; color: #9ca3af; display: block; }
  .submit-summary button { background: #171821; color: #fff; border: none; border-radius: 8px; padding: 13px 24px; font-size: 15px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
  .submit-summary button:hover { background: #2d3140; }
  .submit-summary button:disabled { opacity: 0.6; cursor: not-allowed; }

  .print-note { font-size: 12px; color: #9ca3af; margin-top: 12px; }

  /* Confirmation */
  .confirm-box { background: #fff; border: 1px solid #dfe3e8; border-radius: 12px; padding: 40px 28px; text-align: center; }
  .confirm-icon { font-size: 44px; margin-bottom: 16px; }
  .confirm-box h2 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .confirm-box p { color: #687080; font-size: 14px; margin-bottom: 20px; }
  .confirm-order-num { font-size: 28px; font-weight: 900; font-family: monospace; color: #171821; }
  .confirm-sub { font-size: 12px; color: #9ca3af; margin-top: 4px; margin-bottom: 16px; }
  .confirm-amount { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px; font-size: 14px; color: #166534; margin-bottom: 20px; }
  .confirm-amount strong { font-size: 18px; font-weight: 800; }
  .btn-track { display: block; background: #171821; color: #fff; border-radius: 8px; padding: 13px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 10px; }
  .btn-another { display: block; color: #687080; font-size: 13px; text-decoration: none; }
  .btn-another:hover { text-decoration: underline; }

  @media (max-width: 480px) {
    .service-grid { grid-template-columns: 1fr; }
    .option-grid { grid-template-columns: 1fr; }
    .print-shell { padding: 16px 12px 40px; }
    .submit-summary { flex-direction: column; align-items: stretch; }
    .submit-summary button { width: 100%; }
  }
`;

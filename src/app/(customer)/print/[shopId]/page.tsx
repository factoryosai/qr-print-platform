/* eslint-disable */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ShopPrintPage({ params }: { params: { shopId: string } }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    paper_size: 'A4',
    color_mode: 'bw',
    duplex: false,
    copies: 1,
  });
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStep(2);
    }
  };

  const submitOrder = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: params.shopId, fileName: file.name }),
      });
      const { signedUrl, path } = await urlRes.json();

      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
      });

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: params.shopId,
          customer,
          settings,
          file: { fileName: file.name, path }
        }),
      });
      const { orderId } = await orderRes.json();

      router.push(`/order/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xl py-5" style={{ maxWidth: '600px' }}>
      <h1 className="h3 font-weight-bold mb-4 text-center">Print at {params.shopId}</h1>
      
      {step === 1 && (
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <h2 className="h5 mb-4">Upload Document</h2>
            <input 
              type="file" 
              className="form-control form-control-lg"
              onChange={handleUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card shadow-sm border-0">
          <div className="card-body bg-light rounded">
            <h3 className="h6 fw-bold mb-3">File: {file?.name}</h3>
            
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label fw-bold small">Color Mode</label>
                <select 
                  value={settings.color_mode}
                  onChange={e => setSettings({...settings, color_mode: e.target.value as any})}
                  className="form-select"
                >
                  <option value="bw">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>
              
              <div className="col-6">
                <label className="form-label fw-bold small">Copies</label>
                <input 
                  type="number" 
                  min="1" 
                  value={settings.copies}
                  onChange={e => setSettings({...settings, copies: parseInt(e.target.value)})}
                  className="form-control"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)}
              className="btn btn-primary w-100 mt-4 fw-bold"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card shadow-sm border-0">
          <div className="card-body bg-light rounded space-y-4">
            <h2 className="h5 fw-bold mb-3">Your Details</h2>
            <div className="mb-3">
              <label className="form-label fw-bold small">Name</label>
              <input 
                type="text" 
                value={customer.name}
                onChange={e => setCustomer({...customer, name: e.target.value})}
                className="form-control"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold small">Mobile Number</label>
              <input 
                type="tel" 
                value={customer.mobile}
                onChange={e => setCustomer({...customer, mobile: e.target.value})}
                className="form-control"
                placeholder="Your Mobile Number"
              />
            </div>
            
            <button 
              onClick={submitOrder}
              disabled={loading || !customer.name || !customer.mobile}
              className="btn btn-success w-100 mt-2 py-2 fw-bold"
            >
              {loading ? 'Submitting...' : 'Submit Print Job'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

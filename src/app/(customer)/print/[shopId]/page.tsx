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
      // 1. Get signed upload URL
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: params.shopId, fileName: file.name }),
      });
      const { signedUrl, path } = await urlRes.json();

      // 2. Upload file directly to Supabase storage
      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
      });

      // 3. Create Order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: params.shopId,
          customer,
          settings,
          file: {
            fileName: file.name,
            path,
          }
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
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Print at {params.shopId}</h1>
      
      {step === 1 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <h2 className="text-xl mb-4">Upload Document</h2>
          <input 
            type="file" 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
            onChange={handleUpload}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">File: {file?.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color Mode</label>
                <select 
                  value={settings.color_mode}
                  onChange={e => setSettings({...settings, color_mode: e.target.value as any})}
                  className="w-full border rounded p-2"
                >
                  <option value="bw">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Copies</label>
                <input 
                  type="number" 
                  min="1" 
                  value={settings.copies}
                  onChange={e => setSettings({...settings, copies: parseInt(e.target.value)})}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setStep(3)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold">Your Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              value={customer.name}
              onChange={e => setCustomer({...customer, name: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input 
              type="tel" 
              value={customer.mobile}
              onChange={e => setCustomer({...customer, mobile: e.target.value})}
              className="w-full border rounded p-2"
              placeholder="Your Mobile Number"
            />
          </div>
          
          <button 
            onClick={submitOrder}
            disabled={loading || !customer.name || !customer.mobile}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Print Job'}
          </button>
        </div>
      )}
    </div>
  );
}

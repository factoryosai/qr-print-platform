/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DownloadsPage() {
  const [shop, setShop] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchShop = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('shops').select('*').eq('owner_user_id', user.id).single();
      if (data) setShop(data);
    };
    fetchShop();
  }, [supabase]);

  if (!shop) return <div>Loading...</div>;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const printUrl = `${appUrl}/print/${shop.id}`;

  const downloadAgent = () => {
    alert("This would download the personalized Print Agent ZIP containing your Shop ID and Agent Secret.");
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 className="h3 mb-4 fw-bold">Downloads & Integration</h1>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="h5 fw-bold">1. Your Shop Print Link</h2>
          <p className="text-muted">Customers can visit this link directly to print at your shop.</p>
          <div className="input-group">
            <input type="text" readOnly value={printUrl} className="form-control bg-light" />
            <button 
              onClick={() => navigator.clipboard.writeText(printUrl)}
              className="btn btn-secondary fw-bold"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="h5 fw-bold">2. Print Agent (Windows)</h2>
          <p className="text-muted">
            Download and install this on the Windows PC connected to your printer. 
            It runs silently in the background and automatically prints paid orders.
          </p>
          <button 
            onClick={downloadAgent}
            className="btn btn-primary fw-bold"
          >
            Download Print Agent (.zip)
          </button>
          <div className="small text-muted mt-2">
            <strong>Shop ID:</strong> <span className="font-monospace bg-light p-1 rounded border">{shop.id}</span>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h2 className="h5 fw-bold">3. QR Code Poster</h2>
          <p className="text-muted">
            Print this QR code and stick it on your shop counter. Customers scan it with their phone camera to open the print link.
          </p>
          <div className="bg-light d-flex align-items-center justify-content-center border rounded mb-3" style={{ width: '200px', height: '200px', borderStyle: 'dashed !important' }}>
            [ QR Code Image ]
          </div>
          <button className="btn btn-success fw-bold">
            Download A4 Poster (PNG)
          </button>
        </div>
      </div>

    </div>
  );
}

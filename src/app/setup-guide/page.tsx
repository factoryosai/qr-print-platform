'use client'

import React from 'react'

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="sp-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <div className="sp-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontWeight: 800, fontSize: '20px', color: '#f43f64' }}>
            <i className="bi bi-qr-code" style={{ marginRight: '8px' }}></i>
            Qr To Print
          </div>
        </div>
        <div style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>
          <span>Home</span> &gt; <span style={{ color: '#333' }}>Setup Guide</span>
        </div>
      </header>

      <main className="sp-body" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Windows Print Agent Setup Guide</h1>
          <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Follow these simple steps to install the Windows Print Agent and start receiving print jobs automatically from your QR code.
          </p>
        </div>

        {/* Prerequisites */}
        <section className="info-card" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#222', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-info-circle-fill" style={{ color: '#f43f64' }}></i> Prerequisites
          </h2>
          <div className="info-card-body">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="bi bi-windows" style={{ color: '#0078d7', marginTop: '2px' }}></i>
                <div>
                  <strong style={{ display: 'block', color: '#333' }}>Windows 10 or 11</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>The print agent requires a Windows machine to communicate with your printers.</span>
                </div>
              </li>
              <li style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="bi bi-file-earmark-pdf" style={{ color: '#e2574c', marginTop: '2px' }}></i>
                <div>
                  <strong style={{ display: 'block', color: '#333' }}>SumatraPDF Reader</strong>
                  <span style={{ color: '#666', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Required for silent PDF printing in the background.</span>
                  <a href="https://www.sumatrapdfreader.org/download-free-pdf-viewer" target="_blank" rel="noreferrer" className="btn-sp btn-sp-dark" style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#222', color: '#fff', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                    Download SumatraPDF
                  </a>
                </div>
              </li>
              <li style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="bi bi-hdd-network" style={{ color: '#107c41', marginTop: '2px' }}></i>
                <div>
                  <strong style={{ display: 'block', color: '#333' }}>.NET Framework 4.8+</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>Usually pre-installed on Windows 10/11.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Step by step */}
        <section className="info-card" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#222', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-list-ol" style={{ color: '#f43f64' }}></i> Installation Steps
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f43f64', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>Download the Print Agent</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Download the latest version of the Qr To Print Windows Agent from your dashboard.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f43f64', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>Extract and Run</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Extract the downloaded ZIP file to a folder on your computer. Run the <code>QrPrintAgent.exe</code> file.</p>
                <div className="alert-success" style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '12px', borderRadius: '6px', fontSize: '13px', marginTop: '12px', display: 'inline-block' }}>
                  <i className="bi bi-shield-check" style={{ marginRight: '6px' }}></i>
                  If Windows SmartScreen appears, click &quot;More info&quot; and then &quot;Run anyway&quot;.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f43f64', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>Login with your Shop Key</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Enter the Shop Key provided in your Qr To Print dashboard to authenticate your computer.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f43f64', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>4</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>Select Default Printer</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Choose the printer you want to use for incoming print jobs from the dropdown menu.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f43f64', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>5</div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>Keep it Running!</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Minimize the app. It will run in the system tray and process jobs automatically as long as your computer is on and connected to the internet.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting FAQ */}
        <section className="info-card" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid #eaeaea' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#222', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-question-circle" style={{ color: '#f43f64' }}></i> Troubleshooting FAQ
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#222', fontWeight: 600 }}>1. The app says &quot;SumatraPDF not found&quot;</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>You need to download and install SumatraPDF from the prerequisites section. Ensure it is installed in the default location.</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#222', fontWeight: 600 }}>2. Print jobs are arriving but not printing</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Check if your printer is turned on and selected correctly in the agent. Open Windows Settings &gt; Printers and verify the printer is not offline.</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#222', fontWeight: 600 }}>3. &quot;Invalid Shop Key&quot; error</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Copy the key directly from your dashboard and paste it to avoid typos. Make sure there are no extra spaces.</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#222', fontWeight: 600 }}>4. The agent disconnects frequently</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Ensure your internet connection is stable. The agent will automatically attempt to reconnect when the connection drops.</p>
            </div>
            
            <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#222', fontWeight: 600 }}>5. How to run automatically on startup?</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Check the &quot;Run on Startup&quot; box in the agent settings so it launches silently when you turn on your PC.</p>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '24px' }}>
          <p style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>Still need help setting up your printing system?</p>
          <a 
            href="https://wa.me/917069525795?text=Hi%2C%20I%20need%20help%20setting%20up%20the%20Qr%20To%20Print%20Windows%20Agent" 
            target="_blank" 
            rel="noreferrer"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              backgroundColor: '#25D366', 
              color: '#fff', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
            }}
          >
            <i className="bi bi-whatsapp" style={{ fontSize: '20px' }}></i>
            Contact Support via WhatsApp
          </a>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '12px' }}>+91 7069525795</p>
        </div>

      </main>
    </div>
  )
}

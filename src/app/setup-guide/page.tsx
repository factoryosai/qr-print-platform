import Link from 'next/link';

export default function PrintAgentPage() {
  const steps = [
    { num: '01', title: 'Download the ZIP', desc: 'Go to your Shop Dashboard → Downloads tab and click "Download Print Agent ZIP". The ZIP contains your shop ID, secret key, and setup scripts already configured.' },
    { num: '02', title: 'Check SumatraPDF', desc: 'The agent uses SumatraPDF for silent printing. If not installed, download it free from sumatrapdfreader.org and note the install path (default: C:\\Program Files\\SumatraPDF\\SumatraPDF.exe).' },
    { num: '03', title: 'Run the Installer', desc: 'Extract the ZIP and double-click "Install Print Agent.cmd". Right-click → Run as Administrator for best results. The installer copies files to %LocalAppData%\\QRPrintAgent\\.' },
    { num: '04', title: 'Verify Connection', desc: 'The agent starts automatically. Go to your Dashboard → Printers page. Within 30 seconds you should see "Agent Online" and your Windows printers listed automatically.' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .guide-page { min-height: 100vh; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .guide-header { background: #111; color: white; padding: 60px 24px; text-align: center; }
        .guide-body { max-width: 860px; margin: 0 auto; padding: 40px 24px; }
        .step-card { display: flex; gap: 20px; background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 16px; }
        .step-num { font-size: 36px; font-weight: 900; color: #e5e7eb; font-family: monospace; flex-shrink: 0; width: 56px; }
        .req-card { background: white; border-radius: 14px; border: 1px solid #e5e7eb; padding: 24px; margin-bottom: 32px; }
        .code-block { background: #111; color: #a3e635; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; margin: 12px 0; overflow-x: auto; }
      `}} />

      <div className="guide-page">
        <div className="guide-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: '#2563eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>QP</div>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Qr To Print</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Print Agent Setup Guide</h1>
          <p style={{ color: '#9ca3af', maxWidth: 540, margin: '0 auto', fontSize: 15 }}>
            Install the Windows Print Agent to automatically receive and print customer orders directly to your connected printer — no manual work needed.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/login" style={{ display: 'inline-block', background: '#2563eb', color: 'white', borderRadius: 8, padding: '12px 28px', fontWeight: 700, textDecoration: 'none', marginRight: 12 }}>
              Go to Dashboard →
            </Link>
          </div>
        </div>

        <div className="guide-body">
          {/* Requirements */}
          <div className="req-card">
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>Requirements</h3>
            <div className="row g-3">
              {[
                { icon: '🪟', label: 'Windows 10 or 11', sub: '64-bit recommended' },
                { icon: '🖨️', label: 'USB or Network Printer', sub: 'Installed in Windows' },
                { icon: '📄', label: 'SumatraPDF', sub: 'Free — sumatrapdfreader.org' },
                { icon: '🌐', label: 'Internet Connection', sub: 'Always-on or periodic' },
              ].map(r => (
                <div key={r.label} className="col-6 col-md-3">
                  <div style={{ textAlign: 'center', padding: '16px 8px', background: '#f9fafb', borderRadius: 10 }}>
                    <div style={{ fontSize: 28 }}>{r.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6 }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Installation Steps</h3>
          {steps.map(s => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>{s.title}</h4>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}

          {/* How it works */}
          <div style={{ background: '#111', borderRadius: 14, padding: 28, color: 'white', marginTop: 32 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>How the Agent Works</h3>
            <div className="code-block">
              # Agent loop (every 10 seconds):
              <br/>1. POST /api/agent/heartbeat  ← Reports online + printer list
              <br/>2. GET  /api/agent/next-job   ← Checks for new print jobs
              <br/>3. Downloads file via secure signed URL (expires in 5 min)
              <br/>4. SumatraPDF.exe -print-to "PrinterName" -silent file.pdf
              <br/>5. POST /api/agent/job-status ← Reports printed / failed
            </div>
            <p style={{ color: '#9ca3af', fontSize: 13 }}>
              The agent runs as a hidden background process and starts automatically when Windows logs in. It uses your unique shop credentials so no other shop can access your queue.
            </p>
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Common Questions</h3>
            {[
              { q: 'Does the agent need to run continuously?', a: 'Yes, it should run while your shop is open. It starts automatically on Windows login and runs hidden in the background.' },
              { q: 'What if SumatraPDF is in a different location?', a: 'Edit the agent-config.json file inside %LocalAppData%\\QRPrintAgent\\<YourShopID>\\ and update the sumatraPath value.' },
              { q: 'Can I add multiple printers?', a: 'Yes. Add printers in Dashboard → Printers. The agent will detect all installed Windows printers and report them. You can then set routing rules for B&W and Color jobs.' },
              { q: 'How do I stop or uninstall the agent?', a: 'Open Task Scheduler, find QRPrintAgent and delete it. Then delete the folder at %LocalAppData%\\QRPrintAgent\\.' },
            ].map(f => (
              <div key={f.q} style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: '20px', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Q: {f.q}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>A: {f.a}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/login" style={{ display: 'inline-block', background: '#111', color: 'white', borderRadius: 10, padding: '14px 32px', fontWeight: 700, textDecoration: 'none' }}>
              Back to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
      // Fetch shop including agent_secret
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

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 600, 850);
    ctx.fillStyle = '#f43f64';
    ctx.fillRect(0, 0, 600, 90);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Qr To Print', 300, 58);

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise(r => { qrImg.onload = r; });
    ctx.drawImage(qrImg, 150, 130, 300, 300);

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
    ctx.fillStyle = '#687080';
    ctx.font = '13px Inter, Arial';
    ctx.fillText(`${window.location.origin}/print/${shop.id}`, 300, 640);

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

  const generateAgentZip = async () => {
    if (!shop || printers.length === 0) return;
    
    // Fallback if agent_secret is empty for some reason
    const agentSecret = shop.agent_secret || 'default_secret';

    const zip = new JSZip();
    
    const configData = {
      shop_id: shop.id,
      agent_secret: agentSecret,
      api_url: window.location.origin,
      default_printer: printers[0].name
    };
    zip.file("config.json", JSON.stringify(configData, null, 2));

    const batContent = `@echo off
echo ========================================================
echo   QR To Print - Windows Agent
echo ========================================================
echo.
echo Starting agent in background...
echo Please leave this window open to receive print jobs.
echo.
powershell.exe -ExecutionPolicy Bypass -File "%~dp0qr-agent.ps1"
pause
`;
    zip.file("Start-Agent.bat", batContent);

    const ps1Content = `$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ConfigFile = Join-Path $ScriptDir "config.json"

if (-Not (Test-Path $ConfigFile)) {
    Write-Host "ERROR: config.json not found in the folder!"
    Start-Sleep -Seconds 10
    exit
}

$Config = Get-Content $ConfigFile | ConvertFrom-Json
$ShopId = $Config.shop_id
$AgentSecret = $Config.agent_secret
$BaseUrl = $Config.api_url
$DefaultPrinter = $Config.default_printer

$Headers = @{
    "x-shop-id" = $ShopId
    "x-agent-secret" = $AgentSecret
    "Content-Type" = "application/json"
}

# Locate SumatraPDF
$SumatraPaths = @(
    "C:\\Program Files\\SumatraPDF\\SumatraPDF.exe",
    "C:\\Program Files (x86)\\SumatraPDF\\SumatraPDF.exe",
    "$env:LOCALAPPDATA\\SumatraPDF\\SumatraPDF.exe"
)
$SumatraExe = $null
foreach ($path in $SumatraPaths) {
    if (Test-Path $path) {
        $SumatraExe = $path
        break
    }
}

Write-Host "========================================="
Write-Host " QR To Print - Auto Print Agent"
Write-Host " Shop ID: $ShopId"
Write-Host " Target Printer: $DefaultPrinter"
Write-Host " Press Ctrl+C to stop the agent."
Write-Host "========================================="

if (-Not $SumatraExe) {
    Write-Host "WARNING: SumatraPDF.exe was not found!"
    Write-Host "Please install it from https://www.sumatrapdfreader.org/"
    Write-Host "The agent will run, but printing will fail."
    Write-Host "========================================="
} else {
    Write-Host "SumatraPDF found at: $SumatraExe"
    Write-Host "Agent is READY and waiting for jobs..."
    Write-Host "========================================="
}

while ($true) {
    try {
        # 1. Send Heartbeat
        $hbUrl = "$BaseUrl/api/agent/heartbeat"
        $hbBody = @{ agent_version = "1.0.0" } | ConvertTo-Json
        Invoke-RestMethod -Uri $hbUrl -Method Post -Body $hbBody -Headers $Headers -ErrorAction SilentlyContinue | Out-Null

        # 2. Check for Jobs
        $jobUrl = "$BaseUrl/api/agent/next-job"
        $response = Invoke-RestMethod -Uri $jobUrl -Method Get -Headers $Headers -ErrorAction Stop

        if ($response.job -and $response.job.print_job_id) {
            $job = $response.job
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] New Print Job Detected! ID: $($job.print_job_id)"
            
            # 3. Download the PDF file
            $filePath = "$env:TEMP\\$($job.print_job_id).pdf"
            Write-Host " -> Downloading file..."
            Invoke-WebRequest -Uri $job.download_url -OutFile $filePath
            
            if ($SumatraExe -and (Test-Path $filePath)) {
                Write-Host " -> Sending to printer: $DefaultPrinter"
                
                # Setup silent print arguments
                $args = "-print-to `"$DefaultPrinter`" -silent `"$filePath`""
                $proc = Start-Process -FilePath $SumatraExe -ArgumentList $args -Wait -PassThru
                
                if ($proc.ExitCode -eq 0) {
                    Write-Host " -> Print Success!"
                    $statusUrl = "$BaseUrl/api/agent/job-status"
                    $statusBody = @{ print_job_id = $job.print_job_id; status = "printed" } | ConvertTo-Json
                    Invoke-RestMethod -Uri $statusUrl -Method Post -Body $statusBody -Headers $Headers | Out-Null
                } else {
                    Write-Host " -> Print Failed! Exit Code: $($proc.ExitCode)"
                    $statusUrl = "$BaseUrl/api/agent/job-status"
                    $statusBody = @{ print_job_id = $job.print_job_id; status = "failed"; failure_reason = "SumatraPDF exited with code $($proc.ExitCode)" } | ConvertTo-Json
                    Invoke-RestMethod -Uri $statusUrl -Method Post -Body $statusBody -Headers $Headers | Out-Null
                }
            } else {
                Write-Host " -> ERROR: SumatraPDF not found or file download failed."
                $statusUrl = "$BaseUrl/api/agent/job-status"
                $statusBody = @{ print_job_id = $job.print_job_id; status = "failed"; failure_reason = "Missing SumatraPDF" } | ConvertTo-Json
                Invoke-RestMethod -Uri $statusUrl -Method Post -Body $statusBody -Headers $Headers | Out-Null
            }
            
            if (Test-Path $filePath) { Remove-Item $filePath -Force }
        }
    } catch {
        # Ignore silent network/timeout errors
    }
    
    Start-Sleep -Seconds 3
}
`;
    zip.file("qr-agent.ps1", ps1Content);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `QR-Print-Agent-${shop.id}.zip`);
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
        {isWelcome && (
          <div className="alert-success" style={{ marginBottom: 20 }}>
            <strong>Your shop is ready.</strong> Save your Shop ID, add a printer, then download the personalized Print Agent.
          </div>
        )}

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
            </div>
          </div>

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
                ['Target Printer', printers[0]?.name || 'Not selected'],
                ['Server', typeof window !== 'undefined' ? window.location.origin : ''],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                  <span style={{ color: '#687080' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}

              <button 
                onClick={generateAgentZip}
                className="btn-sp btn-sp-dark" 
                style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} 
                disabled={printers.length === 0}
              >
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

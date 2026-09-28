# manage.ps1
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$configFile = Join-Path $scriptDir "agent-config.json"
$heartbeatScript = Join-Path $scriptDir "heartbeat.ps1"

if (-not (Test-Path $configFile)) {
    Write-Error "Config file not found: $configFile"
    exit
}

$config = Get-Content $configFile | ConvertFrom-Json
$shopId = $config.shop_id
$agentSecret = $config.agent_secret
$serverUrl = $config.server_url.TrimEnd('/')

$headers = @{
    "x-shop-id" = $shopId
    "x-agent-secret" = $agentSecret
    "Content-Type" = "application/json"
}

# Start heartbeat job in background
Start-Job -FilePath $heartbeatScript -ArgumentList $configFile

# Local log of processed jobs to prevent double-printing
$processedJobsFile = Join-Path $scriptDir "processed_jobs.txt"
if (-not (Test-Path $processedJobsFile)) {
    New-Item -ItemType File -Path $processedJobsFile -Force | Out-Null
}

function HasJobBeenProcessed($printJobId) {
    $content = Get-Content $processedJobsFile -ErrorAction SilentlyContinue
    if ($null -ne $content -and $content -contains $printJobId) {
        return $true
    }
    return $false
}

function MarkJobProcessed($printJobId) {
    Add-Content -Path $processedJobsFile -Value $printJobId
    # Keep only last 100 to save space
    $content = Get-Content $processedJobsFile
    if ($content.Count -gt 100) {
        $content | Select-Object -Last 100 | Set-Content $processedJobsFile
    }
}

function ReportJobStatus($printJobId, $status, $failureReason = "") {
    $body = @{
        print_job_id = $printJobId
        status = $status
        failure_reason = $failureReason
    } | ConvertTo-Json

    try {
        Invoke-RestMethod -Uri "$serverUrl/api/agent/job-status" -Method Post -Headers $headers -Body $body
    } catch {
        Write-Warning "Failed to report status for $printJobId : $_"
    }
}

function PrintJob($job) {
    $printJobId = $job.print_job_id
    $downloadUrl = $job.download_url
    $printerName = $job.printer_name
    $settings = $job.settings # Custom settings object if needed, or Sumatra args

    if (HasJobBeenProcessed $printJobId) {
        # Already processed, skip printing, just notify server it's done
        ReportJobStatus $printJobId "printed"
        return
    }

    $tempPdf = Join-Path $env:TEMP "$printJobId.pdf"
    
    try {
        # Download file
        Invoke-WebRequest -Uri $downloadUrl -OutFile $tempPdf

        # Use SumatraPDF for silent printing
        # Assumes SumatraPDF is installed or in PATH, or you specify direct path
        $sumatraPath = Join-Path $env:LocalAppData "SumatraPDF\SumatraPDF.exe"
        if (-not (Test-Path $sumatraPath)) {
            $sumatraPath = "SumatraPDF.exe" # Fallback to PATH
        }

        # Example settings map from JSON: 
        # Paper size, duplex, copies. Sumatra format: "paper=A4,duplex=short,copies=2"
        $sumatraSettings = ""
        if ($null -ne $settings) {
            $settingsList = @()
            if ($settings.paper_size) { $settingsList += "paper=$($settings.paper_size)" }
            if ($settings.duplex -eq $true) { $settingsList += "duplex=long" }
            if ($settings.copies) { $settingsList += "copies=$($settings.copies)" }
            if ($settingsList.Count -gt 0) {
                $sumatraSettings = $settingsList -join ","
            }
        }

        $args = @("-print-to", "`"$printerName`"", "-silent", "`"$tempPdf`"")
        if ($sumatraSettings -ne "") {
            $args += @("-print-settings", "`"$sumatraSettings`"")
        }

        $process = Start-Process -FilePath $sumatraPath -ArgumentList $args -Wait -NoNewWindow -PassThru
        
        if ($process.ExitCode -eq 0) {
            MarkJobProcessed $printJobId
            ReportJobStatus $printJobId "printed"
        } else {
            ReportJobStatus $printJobId "failed" "SumatraPDF exited with code $($process.ExitCode)"
        }
    } catch {
        ReportJobStatus $printJobId "failed" $_.Exception.Message
    } finally {
        if (Test-Path $tempPdf) {
            Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue
        }
    }
}

# Main Loop
while ($true) {
    try {
        $response = Invoke-RestMethod -Uri "$serverUrl/api/agent/next-job" -Method Get -Headers $headers
        
        if ($null -ne $response -and $null -ne $response.job) {
            PrintJob $response.job
        } else {
            # No jobs, wait
            Start-Sleep -Seconds 5
        }
    } catch {
        # Network error or server error
        Start-Sleep -Seconds 10
    }
}

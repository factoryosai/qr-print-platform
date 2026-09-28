# heartbeat.ps1
param (
    [string]$ConfigFile
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ConfigFile)) {
    exit
}

$config = Get-Content $ConfigFile | ConvertFrom-Json
$shopId = $config.shop_id
$agentSecret = $config.agent_secret
$serverUrl = $config.server_url.TrimEnd('/')

$headers = @{
    "x-shop-id" = $shopId
    "x-agent-secret" = $agentSecret
    "Content-Type" = "application/json"
}

function Get-PrintersList {
    $printers = Get-Printer | Select-Object Name, DriverName, PortName, Shared
    $list = @()
    foreach ($p in $printers) {
        $list += @{
            name = $p.Name
            model = $p.DriverName
            connection = if ($p.PortName -match "USB") { "USB" } else { "Network/Other" }
        }
    }
    return $list
}

while ($true) {
    try {
        $printers = Get-PrintersList
        $body = @{
            printers = $printers
            agent_version = "1.0.0"
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "$serverUrl/api/agent/heartbeat" -Method Post -Headers $headers -Body $body
    } catch {
        # Ignore network errors on heartbeat
    }

    Start-Sleep -Seconds 60
}

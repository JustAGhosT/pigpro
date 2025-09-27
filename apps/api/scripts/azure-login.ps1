param(
    [string]$SubscriptionId
)

$ErrorActionPreference = "Stop"

try {
    az account show | Out-Null
}
catch {
    Write-Host "Not logged in to Azure. Launching 'az login'..."
    az login | Out-Null
}

if ($SubscriptionId) {
    Write-Host ("Setting Azure subscription to {0}" -f $SubscriptionId)
    az account set --subscription $SubscriptionId | Out-Null
}

Write-Host "Azure CLI login complete."



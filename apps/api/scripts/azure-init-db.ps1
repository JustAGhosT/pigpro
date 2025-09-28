<#
.SYNOPSIS
    Creates Azure PostgreSQL Flexible Server and initializes database schema.

.PARAMETER PersistEnv
    If specified, persists environment variables to system registry for future PowerShell sessions.
    Default: false (variables are set for current session only).

.EXAMPLE
    .\azure-init-db.ps1 -SubscriptionId "12345" -PersistEnv
#>

param(
    [string]$ResourceGroup,
    [string]$Location,
    [string]$ServerName,
    [string]$AdminUser,
    [string]$AdminPassword,
    [string]$Database,
    [string]$SubscriptionId,
    [switch]$PersistEnv
)

$ErrorActionPreference = "Stop"

if (-not $Location) { $Location = "eastus" }
if (-not $AdminUser) { $AdminUser = "pgadmin" }
if (-not $Database) { $Database = "livestockdb" }

# Helpers
function New-RandomLower {
    param([int]$Length = 8)
    $chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    $sb = ""
    for ($i = 0; $i -lt $Length; $i++) { $sb += $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] }
    return $sb
}

function New-StrongPassword {
    param([int]$Length = 20)
    $lower = "abcdefghijklmnopqrstuvwxyz"
    $upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    $digits = "0123456789"
    $special = "@#$%!-_"
    $all = ($lower + $upper + $digits + $special)
    $req = @(
        $lower[(Get-Random -Minimum 0 -Maximum $lower.Length)],
        $upper[(Get-Random -Minimum 0 -Maximum $upper.Length)],
        $digits[(Get-Random -Minimum 0 -Maximum $digits.Length)],
        $special[(Get-Random -Minimum 0 -Maximum $special.Length)]
    )
    $remaining = @()
    for ($i = 0; $i -lt ($Length - 4); $i++) { $remaining += $all[(Get-Random -Minimum 0 -Maximum $all.Length)] }
    $chars = $req + $remaining
    $shuffled = ($chars | Get-Random -Count $chars.Count) -join ''
    return $shuffled
}

# Auto-populate values if omitted
if (-not $ResourceGroup) { $ResourceGroup = "livestock-rg" }
if (-not $ServerName) { $ServerName = ("livestock-pg-" + (New-RandomLower -Length 8)) }
if (-not $AdminPassword) { $AdminPassword = (New-StrongPassword -Length 20) }

# Canonicalize names to meet Azure requirements
$ResourceGroup = $ResourceGroup.ToLower()
$ServerName = $ServerName.ToLower()

# Validate/sanitize names to avoid Azure CLI errors
# Resource group must be 1-90 characters, alphanumeric, underscore, parentheses, hyphen, period
if ($ResourceGroup -notmatch '^[a-zA-Z0-9_().-]{1,90}$') {
  throw "Invalid ResourceGroup '$ResourceGroup'. Must be 1-90 characters: letters, numbers, underscore, parentheses, hyphen, period."
}
# Server name must be 3-63 characters, lowercase letters, numbers, and hyphens
if ($ServerName -notmatch '^[a-z0-9-]{3,63}$') {
  throw "Invalid ServerName '$ServerName'. Must be 3-63 characters: lowercase letters, numbers, hyphens."
}
# Admin user must start with a letter and contain only letters and numbers
if ($AdminUser -notmatch '^[A-Za-z][A-Za-z0-9]*$') {
  Write-Host "Invalid admin user '$AdminUser'. Falling back to 'pgadmin'."
  $AdminUser = 'pgadmin'
}
# Database must start with a letter and contain only letters, numbers, and underscore
if ($Database -notmatch '^[A-Za-z][A-Za-z0-9_]*$') {
  Write-Host "Invalid database name '$Database'. Falling back to 'livestockdb'."
  $Database = 'livestockdb'
}

Write-Host "Creating resource group $ResourceGroup in $Location (if not exists)"
# Ensure logged in and subscription is set
& "$PSScriptRoot/azure-login.ps1" -SubscriptionId $SubscriptionId

# Ensure provider registration for PostgreSQL
Write-Host "Ensuring provider 'Microsoft.DBforPostgreSQL' is registered on this subscription..."
try {
    az provider register --namespace Microsoft.DBforPostgreSQL | Out-Null
}
catch {}
# Wait until Registered
for ($i = 0; $i -lt 30; $i++) {
    $state = az provider show --namespace Microsoft.DBforPostgreSQL --query registrationState -o tsv 2>$null
    if ($state -eq "Registered") { break }
    Start-Sleep -Seconds 2
}

az group create --name $ResourceGroup --location $Location | Out-Null

# Check if server exists
$serverExists = $false
$adminLogin = $AdminUser
try {
    $srv = az postgres flexible-server show --resource-group $ResourceGroup --name $ServerName -o json 2>$null
    if ($srv) {
        $serverExists = $true
        $srvObj = $srv | ConvertFrom-Json
        if ($srvObj.properties.administratorLogin) { $adminLogin = $srvObj.properties.administratorLogin }
    }
} catch {}

if (-not $serverExists) {
    Write-Host "Creating Azure Database for PostgreSQL Flexible Server: $ServerName"
    az postgres flexible-server create `
        --resource-group $ResourceGroup `
        --name $ServerName `
        --location $Location `
        --admin-user $AdminUser `
        --admin-password $AdminPassword `
        --tier Burstable --sku-name Standard_B1ms --storage-size 32 `
        --version 13 `
        --yes | Out-Null
} else {
    Write-Host "Server $ServerName already exists. Reusing it."
    if ($AdminPassword -and $AdminPassword.Length -ge 8) {
        Write-Host "Resetting admin password for $ServerName ..."
        az postgres flexible-server update -g $ResourceGroup -n $ServerName -p $AdminPassword | Out-Null
    }
}

# Ensure database exists
$dbExists = $false
try {
    $dbProbe = az postgres flexible-server db show --resource-group $ResourceGroup --server-name $ServerName --database-name $Database -o json 2>$null
    if ($dbProbe) { $dbExists = $true }
} catch {}
if (-not $dbExists) {
    Write-Host "Creating database $Database on $ServerName"
    az postgres flexible-server db create `
        --resource-group $ResourceGroup `
        --server-name $ServerName `
        --database-name $Database | Out-Null
} else {
    Write-Host "Database $Database already exists on $ServerName."
}

Write-Host "Allowing public access from current IP"

# First, reliably detect the client IP (or fall back to the Azure-services-only token)
try {
    $clientIp = (Invoke-RestMethod -Uri 'https://api.ipify.org?format=json').ip
} catch {
    Write-Host "Warning: Failed to detect client IP. Allowing Azure services only."
    $clientIp = "0.0.0.0"
}

# Then apply the firewall rule using the determined IP
try {
    az postgres flexible-server firewall-rule create `
        --resource-group $ResourceGroup `
        --name "$ServerName-allow-ip" `
        --server $ServerName `
        --start-ip-address $clientIp `
        --end-ip-address $clientIp | Out-Null
} catch {
    # Fallback to --server-name with the same client IP
    az postgres flexible-server firewall-rule create `
        --resource-group $ResourceGroup `
        --name "$ServerName-allow-ip" `
        --server-name $ServerName `
        --start-ip-address $clientIp `
        --end-ip-address $clientIp | Out-Null
}

Write-Host "Done. Use these env vars:"
Write-Host "PGHOST=$ServerName.postgres.database.azure.com"
Write-Host "PGUSER=$adminLogin"
Write-Host "PGPASSWORD=<REDACTED>"
Write-Host "PGDATABASE=$Database"
Write-Host "Note: PGPASSWORD is set in environment. Use a secure method to access it (e.g., secret manager or secure env export)."
Write-Host "PGPORT=5432"
Write-Host "PGSSLMODE=require"

# Set env vars for current session
$env:PGHOST = "$ServerName.postgres.database.azure.com"
$env:PGUSER = "$adminLogin"
$env:PGPASSWORD = $AdminPassword
$env:PGDATABASE = $Database
$env:PGPORT = "5432"
$env:PGSSLMODE = "require"

# Persist env vars for future sessions (opt-in only)
if ($PersistEnv) {
  try {
    setx PGHOST "$ServerName.postgres.database.azure.com" | Out-Null
    setx PGUSER "$adminLogin" | Out-Null
    setx PGPASSWORD "$AdminPassword" | Out-Null
    setx PGDATABASE "$Database" | Out-Null
    setx PGPORT "5432" | Out-Null
    setx PGSSLMODE "require" | Out-Null
    Write-Host "Environment variables set for current session and persisted for future sessions (open a new shell to pick up persisted values)."
  } catch {
    Write-Host "Warning: Failed to persist env vars with setx. They are set for current session only."
  }
} else {
  Write-Host "Environment variables set for current session only. Use -PersistEnv flag to persist for future sessions."
}

# Automatically initialize DB schema via Node script
try {
  Write-Host "Initializing schema on $($env:PGHOST) ..."
  node "$PSScriptRoot/../scripts/init-db.cjs"
} catch {
  Write-Host "Warning: Automatic schema initialization failed. You can run 'npm run db:init:ps' manually."
}



param(
  [string]$ResourceGroup,
  [string]$Location,
  [string]$ServerName,
  [string]$AdminUser,
  [string]$AdminPassword,
  [string]$Database,
  [string]$SubscriptionId,
  [switch]$ForceDeleteRg,
  [int]$BackendPort = 7073
)

$ErrorActionPreference = "Stop"

# Capture original SubscriptionId param (may contain DB name due to positional binding)
$originalSubscriptionParam = $SubscriptionId

# Handle positional args passed via npm that bind out of order
# Pattern of actual invocation: subId, location, resourceGroup, serverName, adminUser, adminPassword, database, backendPort
$guidRegex = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
$firstLooksLikeSub = ($ResourceGroup -match $guidRegex)
$subLooksLikeGuid = ($SubscriptionId -match $guidRegex)
if ($firstLooksLikeSub -and -not $subLooksLikeGuid) {
  # Realign
  $SubscriptionId = $ResourceGroup
  $ResourceGroup = $ServerName
  $ServerName = $AdminUser
  $AdminUser = $AdminPassword
  $AdminPassword = $Database
  # Database: prefer originally bound SubscriptionId token if it looks like a DB name
  if ($originalSubscriptionParam -and $originalSubscriptionParam -notmatch $guidRegex) {
    $Database = $originalSubscriptionParam
  } elseif (-not $Database) {
    $Database = 'livestockdb'
  }
  if ($args.Count -ge 8) { $BackendPort = [int]$args[7] }
}

if (-not $ResourceGroup) { $ResourceGroup = "livestock-rg" }
if (-not $AdminUser) { $AdminUser = "pgadmin" }
if (-not $Database) { $Database = "livestockdb" }

# Provision server + DB, set env vars, and init schema
& "$PSScriptRoot/azure-init-db.ps1" `
  -ResourceGroup $ResourceGroup `
  -Location $Location `
  -ServerName $ServerName `
  -AdminUser $AdminUser `
  -AdminPassword $AdminPassword `
  -Database $Database `
  -SubscriptionId $SubscriptionId `
  -ForceDeleteRg:$ForceDeleteRg

Write-Host "Starting Azure Functions host on port $BackendPort ..."
Push-Location "$PSScriptRoot/.."
try {
  Write-Host "Building backend functions..."
  npm run build | Write-Host
  if (-not $env:FUNCTIONS_WORKER_RUNTIME) { $env:FUNCTIONS_WORKER_RUNTIME = "node" }
  if (-not $env:AzureWebJobsStorage) { $env:AzureWebJobsStorage = "UseDevelopmentStorage=true" }
  npx -y azure-functions-core-tools@4 start --port $BackendPort
} finally {
  Pop-Location
}



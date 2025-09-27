param(
  [string]$SubscriptionId,
  [string]$ResourceGroup,
  [string]$Location,
  [string]$StorageAccountName,
  [string]$ContainerName = "livestock-images"
)

$ErrorActionPreference = "Stop"

function New-RandomLower {
  param([int]$Length = 8)
  $chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  $sb = ""
  for ($i=0; $i -lt $Length; $i++) { $sb += $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] }
  return $sb
}

if (-not $ResourceGroup) { $ResourceGroup = "pigpro-rg" }
if (-not $Location) { $Location = "eastus" }
if (-not $StorageAccountName) { $StorageAccountName = ("livestocksa" + (New-RandomLower -Length 8)) }

# Ensure login + subscription
& "$PSScriptRoot/azure-login.ps1" -SubscriptionId $SubscriptionId

# Ensure RG
az group create --name $ResourceGroup --location $Location | Out-Null

Write-Host "Creating storage account $StorageAccountName in $ResourceGroup/$Location (if not exists)"
az storage account create `
  --name $StorageAccountName `
  --resource-group $ResourceGroup `
  --location $Location `
  --sku Standard_LRS `
  --kind StorageV2 `
  --allow-blob-public-access true | Out-Null

# Get account key
$key = (az storage account keys list -g $ResourceGroup -n $StorageAccountName -o tsv --query "[0].value")

Write-Host "Creating container $ContainerName (public access: blob)"
$createResult = az storage container create `
  --name $ContainerName `
  --account-name $StorageAccountName `
  --account-key $key `
  --public-access blob 2>&1

if ($LASTEXITCODE -ne 0) {
  Write-Host "Container creation failed: $createResult"
  Write-Host "Trying to create without public access..."
  az storage container create `
    --name $ContainerName `
    --account-name $StorageAccountName `
    --account-key $key | Out-Null
}

# Resolve local images folder (repoRoot/public/images)
$imagesPath = Resolve-Path -Path (Join-Path $PSScriptRoot "../../../public/images") -ErrorAction SilentlyContinue
if (-not $imagesPath) {
  Write-Host "Warning: public/images not found; skipping upload."
} else {
  Write-Host "Uploading images from $imagesPath ..."
  az storage blob upload-batch `
    --destination $ContainerName `
    --source $imagesPath `
    --account-name $StorageAccountName `
    --account-key $key `
    --pattern "*.*" | Out-Null
}

$blobBase = "https://$StorageAccountName.blob.core.windows.net/$ContainerName"
Write-Host "BLOB_BASE_URL=$blobBase"

# Set for current session and persist
$env:BLOB_BASE_URL = $blobBase
try { setx BLOB_BASE_URL $blobBase | Out-Null } catch {}



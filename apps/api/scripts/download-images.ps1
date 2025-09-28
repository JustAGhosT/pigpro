param(
  [string]$ImagesDir = "../../frontend/public/images"
)

$ErrorActionPreference = "Stop"

# Resolve the images directory
$imagesPath = Resolve-Path -Path (Join-Path $PSScriptRoot $ImagesDir) -ErrorAction SilentlyContinue
if (-not $imagesPath) {
  Write-Host "Error: Images directory not found: $ImagesDir"
  exit 1
}

Write-Host "Downloading images to: $imagesPath"

# Image URLs for different livestock categories
$imageUrls = @{
  # Poultry
  "chicken-broiler.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  "chicken-pullets.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "chicken-sussex.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  
  # Goats
  "goat-kalahari-red.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "goat-saanen.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "goat-alpine.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  
  # Cattle
  "cattle-nguni.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "cattle-bonsmara.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "cattle-brahman.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  
  # Sheep
  "sheep-dorper.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "sheep-merino.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  
  # Pigs
  "pig-landrace.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "pig-tamworth.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  "pig-kunekune.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  
  # Rabbits
  "rabbit-newzealand.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "rabbit-californian.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
}

# Download each image
foreach ($imageName in $imageUrls.Keys) {
  $imagePath = Join-Path $imagesPath $imageName
  $imageUrl = $imageUrls[$imageName]
  
  Write-Host "Downloading $imageName from $imageUrl"
  
  try {
    Invoke-WebRequest -Uri $imageUrl -OutFile $imagePath -ErrorAction Stop
    Write-Host "Downloaded $imageName"
  } catch {
    Write-Host "Failed to download $imageName : $($_.Exception.Message)"
  }
}

Write-Host "Image download complete!"
Write-Host "Images in directory:"
Get-ChildItem $imagesPath | ForEach-Object { Write-Host "  - $($_.Name)" }
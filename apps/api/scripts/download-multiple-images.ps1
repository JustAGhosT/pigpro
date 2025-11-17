param(
  [string]$ImagesDir = "../../../public/images"
)

$ErrorActionPreference = "Stop"

# Resolve the images directory
$imagesPath = Resolve-Path -Path (Join-Path $PSScriptRoot $ImagesDir) -ErrorAction SilentlyContinue
if (-not $imagesPath) {
  Write-Host "Error: Images directory not found: $ImagesDir"
  exit 1
}

Write-Host "Downloading multiple images to: $imagesPath"

# Image sets for different livestock categories (multiple images per listing)
$imageSets = @{
  # Poultry - Rhode Island Red (multiple images)
  "rhode-island-red-chickens-1.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  "rhode-island-red-chickens-2.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "rhode-island-red-chickens-3.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "rhode-island-red-chickens-4.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "rhode-island-red-chickens-5.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  
  # Goats - Boer (multiple images)
  "boer-goat-1.webp" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "boer-goat-2.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "boer-goat-3.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "boer-goat-4.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "boer-goat-5.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  
  # Pigs - Large White (multiple images)
  "large-white-pigs-1.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "large-white-pigs-2.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  "large-white-pigs-3.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "large-white-pigs-4.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "large-white-pigs-5.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  
  # Rabbits - Angora (multiple images)
  "angora-rabbit-pair-1.jpeg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "angora-rabbit-pair-2.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "angora-rabbit-pair-3.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "angora-rabbit-pair-4.jpg" = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center"
  "angora-rabbit-pair-5.jpg" = "https://images.unsplash.com/photo-1548550023-5b21a00d2a95?w=800&h=600&fit=crop&crop=center"
  
  # Fish - Barbel
  "barbel-1.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "barbel-2.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "barbel-3.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "barbel-4.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "barbel-5.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  
  # Fish - Koi
  "koi-1.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "koi-2.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "koi-3.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "koi-4.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "koi-5.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  
  # Fish - Tilapia
  "tilapia-1.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "tilapia-2.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "tilapia-3.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "tilapia-4.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "tilapia-5.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
}

# Download each image
foreach ($imageName in $imageSets.Keys) {
  $imagePath = Join-Path $imagesPath $imageName
  $imageUrl = $imageSets[$imageName]
  
  Write-Host "Downloading $imageName"
  
  try {
    Invoke-WebRequest -Uri $imageUrl -OutFile $imagePath -ErrorAction Stop
    Write-Host "Downloaded $imageName"
  } catch {
    Write-Host "Failed to download $imageName : $($_.Exception.Message)"
  }
}

Write-Host "Multiple image download complete!"
Write-Host "Total images in directory:"
$imageCount = (Get-ChildItem $imagesPath).Count
Write-Host "  $imageCount images"

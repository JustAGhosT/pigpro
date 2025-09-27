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

Write-Host "Downloading insects and arachnids images to: $imagesPath"

# Image URLs for insects and arachnids
$imageUrls = @{
  # Insects - Superworms
  "superworms-1.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "superworms-2.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "superworms-3.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "superworms-4.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "superworms-5.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  
  # Insects - Mealworms
  "mealworms-1.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "mealworms-2.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "mealworms-3.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "mealworms-4.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "mealworms-5.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  
  # Arachnids - Tarantulas
  "tarantula-1.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "tarantula-2.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "tarantula-3.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "tarantula-4.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
  "tarantula-5.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  
  # Arachnids - Scorpions
  "scorpion-1.jpg" = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
  "scorpion-2.jpg" = "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop&crop=center"
  "scorpion-3.jpg" = "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=800&h=600&fit=crop&crop=center"
  "scorpion-4.jpg" = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=center"
  "scorpion-5.jpg" = "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center"
}

# Download each image
foreach ($imageName in $imageUrls.Keys) {
  $imagePath = Join-Path $imagesPath $imageName
  $imageUrl = $imageUrls[$imageName]
  
  Write-Host "Downloading $imageName"
  
  try {
    Invoke-WebRequest -Uri $imageUrl -OutFile $imagePath -ErrorAction Stop
    Write-Host "Downloaded $imageName"
  } catch {
    Write-Host "Failed to download $imageName : $($_.Exception.Message)"
  }
}

Write-Host "Insects and arachnids image download complete!"
Write-Host "Total images in directory:"
$imageCount = (Get-ChildItem $imagesPath).Count
Write-Host "  $imageCount images"

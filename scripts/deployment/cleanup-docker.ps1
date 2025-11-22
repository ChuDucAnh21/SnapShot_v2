# Clean up Docker resources (PowerShell)
# Usage: .\scripts\cleanup-docker.ps1

Write-Host "🧹 Cleaning up Docker resources..." -ForegroundColor Yellow

# Stop and remove containers
Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
docker-compose down

# Remove unused images
Write-Host "🗑️ Removing unused images..." -ForegroundColor Yellow
docker image prune -f

# Remove unused volumes
Write-Host "🗑️ Removing unused volumes..." -ForegroundColor Yellow
docker volume prune -f

Write-Host "✅ Docker cleanup completed!" -ForegroundColor Green

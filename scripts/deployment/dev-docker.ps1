# Local development script for Docker (PowerShell)
# Usage: .\scripts\dev-docker.ps1

Write-Host "🐳 Starting local Docker development environment" -ForegroundColor Green

# Build the Docker image
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
docker-compose build

# Start the services
Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose up

Write-Host "✅ Local development environment is running at http://localhost:8080" -ForegroundColor Green

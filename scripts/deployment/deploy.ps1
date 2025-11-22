# Deploy script for Iruka Next.js 15 to Firebase + Cloud Run (PowerShell)
# Usage: .\scripts\deploy.ps1 -ProjectId "your-project-id" -ServiceName "iruka-next15"

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "iruka-next15"
)

# Configuration
$Region = "asia-southeast1"
$Repository = "web-images"
$ImageName = "iruka-next15"

Write-Host "🚀 Starting deployment to Firebase + Cloud Run" -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Cyan
Write-Host "Service Name: $ServiceName" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan

# Check if gcloud is installed and authenticated
try {
    gcloud version | Out-Null
} catch {
    Write-Host "❌ gcloud CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if firebase CLI is installed
try {
    firebase --version | Out-Null
} catch {
    Write-Host "❌ Firebase CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "📋 Setting project to $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Create Artifact Registry repository if it doesn't exist
Write-Host "📦 Creating Artifact Registry repository..." -ForegroundColor Yellow
try {
    gcloud artifacts repositories create $Repository --repository-format=docker --location=$Region --quiet
} catch {
    Write-Host "Repository already exists or creation failed" -ForegroundColor Yellow
}

# Build and push Docker image
Write-Host "🔨 Building and pushing Docker image..." -ForegroundColor Yellow
$ImageUri = "$Region-docker.pkg.dev/$ProjectId/$Repository/$ImageName`:latest"

gcloud builds submit --tag $ImageUri

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName --image=$ImageUri --platform=managed --region=$Region --allow-unauthenticated --port=8080 --memory=512Mi --cpu=1 --min-instances=0 --max-instances=10

# Get Cloud Run service URL
$ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format="value(status.url)"
Write-Host "✅ Cloud Run service deployed at: $ServiceUrl" -ForegroundColor Green

# Deploy Firebase Hosting
Write-Host "🔥 Deploying Firebase Hosting..." -ForegroundColor Yellow
firebase use $ProjectId
firebase deploy --only hosting

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your app is now available at your Firebase Hosting URL" -ForegroundColor Cyan
Write-Host "🔗 Cloud Run service: $ServiceUrl" -ForegroundColor Cyan

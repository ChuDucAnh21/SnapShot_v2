#!/bin/bash

# Deploy script for Iruka Next.js 15 to Firebase + Cloud Run
# Usage: ./scripts/deploy.sh [PROJECT_ID] [SERVICE_NAME]

set -e

# Configuration
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME=${2:-"iruka-next15"}
REGION="asia-southeast1"
REPOSITORY="web-images"
IMAGE_NAME="iruka-next15"

echo "🚀 Starting deployment to Firebase + Cloud Run"
echo "Project ID: $PROJECT_ID"
echo "Service Name: $SERVICE_NAME"
echo "Region: $REGION"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first."
    exit 1
fi

# Set project
echo "📋 Setting project to $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Create Artifact Registry repository if it doesn't exist
echo "📦 Creating Artifact Registry repository..."
gcloud artifacts repositories create $REPOSITORY \
  --repository-format=docker \
  --location=$REGION \
  --quiet || echo "Repository already exists"

# Build and push Docker image
echo "🔨 Building and pushing Docker image..."
IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest"

gcloud builds submit --tag $IMAGE_URI

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image=$IMAGE_URI \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10

# Get Cloud Run service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
echo "✅ Cloud Run service deployed at: $SERVICE_URL"

# Deploy Firebase Hosting
echo "🔥 Deploying Firebase Hosting..."
firebase use $PROJECT_ID
firebase deploy --only hosting

echo "🎉 Deployment completed successfully!"
echo "🌐 Your app is now available at your Firebase Hosting URL"
echo "🔗 Cloud Run service: $SERVICE_URL"

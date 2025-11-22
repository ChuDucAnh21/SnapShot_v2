#!/bin/bash

# Local development script for Docker
# Usage: ./scripts/dev-docker.sh

set -e

echo "🐳 Starting local Docker development environment"

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up

echo "✅ Local development environment is running at http://localhost:8080"

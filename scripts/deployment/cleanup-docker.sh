#!/bin/bash

# Clean up Docker resources
# Usage: ./scripts/cleanup-docker.sh

set -e

echo "🧹 Cleaning up Docker resources..."

# Stop and remove containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove unused images
echo "🗑️ Removing unused images..."
docker image prune -f

# Remove unused volumes
echo "🗑️ Removing unused volumes..."
docker volume prune -f

echo "✅ Docker cleanup completed!"

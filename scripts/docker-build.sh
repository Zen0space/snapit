#!/bin/bash
# Build Docker image for Snap-It backend
# Usage: ./scripts/docker-build.sh [version]
# Example: ./scripts/docker-build.sh v1.0.0

set -e

VERSION=${1:-latest}
IMAGE_NAME="snapit-backend"

echo "============================================"
echo "Building Docker image: $IMAGE_NAME:$VERSION"
echo "============================================"
echo ""

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Build the image
echo "Building image..."
docker build \
  --platform linux/amd64 \
  --file packages/backend/Dockerfile \
  --tag $IMAGE_NAME:$VERSION \
  --tag $IMAGE_NAME:latest \
  --progress=plain \
  .

echo ""
echo "============================================"
echo "✓ Build complete!"
echo "============================================"
echo ""
echo "Image details:"
docker images | head -1
docker images | grep $IMAGE_NAME

echo ""
echo "To test the image locally:"
echo "  docker-compose up -d"
echo ""
echo "To export the image for VPS:"
echo "  ./scripts/docker-export.sh $VERSION"

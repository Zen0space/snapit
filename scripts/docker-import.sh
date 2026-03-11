#!/bin/bash
# Import Docker image from compressed tar archive
# This script is meant to be run on the VPS server
# Usage: ./scripts/docker-import.sh <image-file.tar.gz>
# Example: ./scripts/docker-import.sh snapit-backend-v1.0.0.tar.gz

set -e

IMAGE_TAR=${1}

if [ -z "$IMAGE_TAR" ]; then
  echo "ERROR: No image file specified"
  echo "Usage: $0 <image-file.tar.gz>"
  echo "Example: $0 snapit-backend-v1.0.0.tar.gz"
  exit 1
fi

if [ ! -f "$IMAGE_TAR" ]; then
  echo "ERROR: Image file not found: $IMAGE_TAR"
  exit 1
fi

echo "============================================"
echo "Importing Docker image: $IMAGE_TAR"
echo "============================================"
echo ""

# Check file size
FILE_SIZE=$(ls -lh "$IMAGE_TAR" | awk '{print $5}')
echo "File size: $FILE_SIZE"
echo ""

# Import the image
echo "Decompressing and loading image..."
gunzip -c "$IMAGE_TAR" | docker load

echo ""
echo "============================================"
echo "✓ Import complete!"
echo "============================================"
echo ""
echo "Available images:"
docker images | head -1
docker images | grep snapit-backend

echo ""
echo "Next steps:"
echo "1. Ensure you have a .env file configured:"
echo "   cp .env.production.example .env"
echo "   nano .env  # Edit with your values"
echo ""
echo "2. Start the services:"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "3. Check the logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f backend"
echo ""
echo "4. Verify health:"
echo "   curl http://localhost:9000/health"

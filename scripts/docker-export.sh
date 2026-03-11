#!/bin/bash
# Export Docker image as compressed tar archive
# Usage: ./scripts/docker-export.sh [version]
# Example: ./scripts/docker-export.sh v1.0.0

set -e

VERSION=${1:-latest}
IMAGE_NAME="snapit-backend"
OUTPUT_DIR="./docker-exports"
OUTPUT_FILE="$OUTPUT_DIR/$IMAGE_NAME-$VERSION.tar"
OUTPUT_GZ="$OUTPUT_FILE.gz"

echo "============================================"
echo "Exporting Docker image: $IMAGE_NAME:$VERSION"
echo "============================================"
echo ""

# Create output directory
mkdir -p $OUTPUT_DIR

# Check if image exists
if ! docker images | grep -q "$IMAGE_NAME.*$VERSION"; then
  echo "ERROR: Image $IMAGE_NAME:$VERSION not found"
  echo "Please build the image first:"
  echo "  ./scripts/docker-build.sh $VERSION"
  exit 1
fi

# Export the image
echo "Exporting image to tar archive..."
docker save -o $OUTPUT_FILE $IMAGE_NAME:$VERSION

# Get uncompressed size
UNCOMPRESSED_SIZE=$(ls -lh $OUTPUT_FILE | awk '{print $5}')
echo "✓ Export complete: $OUTPUT_FILE ($UNCOMPRESSED_SIZE)"

# Compress the archive
echo ""
echo "Compressing with gzip..."
gzip -f $OUTPUT_FILE

# Get compressed size
COMPRESSED_SIZE=$(ls -lh $OUTPUT_GZ | awk '{print $5}')

echo ""
echo "============================================"
echo "✓ Export complete!"
echo "============================================"
echo ""
echo "File: $OUTPUT_GZ"
echo "Size: $COMPRESSED_SIZE (compressed)"
echo ""
echo "To transfer to VPS:"
echo "  scp $OUTPUT_GZ user@your-vps:/opt/snapit/"
echo ""
echo "To import on VPS:"
echo "  gunzip -c $IMAGE_NAME-$VERSION.tar.gz | docker load"
echo ""
echo "Or use the automated deployment script:"
echo "  REMOTE_HOST=your-vps.com ./scripts/docker-deploy.sh"

#!/bin/bash
# Automated deployment script for Snap-It backend to VPS
# Usage: REMOTE_HOST=vps.example.com REMOTE_USER=ubuntu ./scripts/docker-deploy.sh [version]
# Example: REMOTE_HOST=192.168.1.100 REMOTE_USER=root ./scripts/docker-deploy.sh v1.0.0

set -e

VERSION=${1:-latest}
IMAGE_NAME="snapit-backend"

# Configuration from environment variables
REMOTE_USER=${REMOTE_USER:-root}
REMOTE_HOST=${REMOTE_HOST}
REMOTE_DIR=${REMOTE_DIR:-/opt/snapit}
REMOTE_PORT=${REMOTE_PORT:-22}

# Validate configuration
if [ -z "$REMOTE_HOST" ]; then
  echo "ERROR: REMOTE_HOST environment variable not set"
  echo ""
  echo "Usage:"
  echo "  REMOTE_HOST=your-vps.com REMOTE_USER=ubuntu $0 [version]"
  echo ""
  echo "Example:"
  echo "  REMOTE_HOST=192.168.1.100 REMOTE_USER=root $0 v1.0.0"
  exit 1
fi

echo "============================================"
echo "Snap-It Backend Deployment"
echo "============================================"
echo ""
echo "Version:     $VERSION"
echo "Remote host: $REMOTE_USER@$REMOTE_HOST"
echo "Remote dir:  $REMOTE_DIR"
echo ""

# Step 1: Build the Docker image
echo "Step 1/5: Building Docker image..."
./scripts/docker-build.sh $VERSION

# Step 2: Export the image
echo ""
echo "Step 2/5: Exporting image..."
./scripts/docker-export.sh $VERSION

# Step 3: Prepare VPS directory
echo ""
echo "Step 3/5: Preparing VPS directory..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_DIR"

# Step 4: Upload files to VPS
echo ""
echo "Step 4/5: Uploading files to VPS..."
echo "  - Docker image"
scp -P $REMOTE_PORT docker-exports/$IMAGE_NAME-$VERSION.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

echo "  - Docker Compose configuration"
scp -P $REMOTE_PORT docker-compose.prod.yml $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/docker-compose.yml

echo "  - Environment template (if .env doesn't exist)"
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
  if [ ! -f $REMOTE_DIR/.env ]; then
    echo "Creating .env from template..."
  fi
EOF
scp -P $REMOTE_PORT packages/backend/.env.production.example $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/.env.example

# Step 5: Import and deploy on VPS
echo ""
echo "Step 5/5: Deploying on VPS..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
  set -e
  cd $REMOTE_DIR

  echo "Importing Docker image..."
  gunzip -c $IMAGE_NAME-$VERSION.tar.gz | docker load

  echo "Checking environment configuration..."
  if [ ! -f .env ]; then
    echo ""
    echo "WARNING: .env file not found!"
    echo "Please create it from .env.example and configure your settings:"
    echo "  cd $REMOTE_DIR"
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    exit 1
  fi

  echo "Stopping existing containers..."
  docker-compose down || true

  echo "Starting services..."
  docker-compose up -d

  echo "Waiting for services to be healthy..."
  sleep 10

  echo ""
  echo "Deployment status:"
  docker-compose ps

  echo ""
  echo "Recent logs:"
  docker-compose logs --tail=50 backend
EOF

echo ""
echo "============================================"
echo "✓ Deployment complete!"
echo "============================================"
echo ""
echo "To view logs:"
echo "  ssh $REMOTE_USER@$REMOTE_HOST 'cd $REMOTE_DIR && docker-compose logs -f backend'"
echo ""
echo "To check health:"
echo "  curl http://$REMOTE_HOST:9000/health"
echo ""
echo "To access the server:"
echo "  ssh $REMOTE_USER@$REMOTE_HOST"

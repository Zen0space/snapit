#!/bin/sh
set -e

# Extract database host and port from DATABASE_URL if needed
# DATABASE_URL format: postgresql://user:password@host:port/database
if [ -n "$DATABASE_URL" ]; then
  DB_HOST=${DB_HOST:-$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')}
  DB_PORT=${DB_PORT:-$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')}
fi

# Default values
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "=== Snap-It Backend Startup ==="
echo "Node version: $(node --version)"
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-9000}"
echo "Database host: $DB_HOST:$DB_PORT"

# Wait for database to be ready
echo ""
echo "Waiting for database at $DB_HOST:$DB_PORT..."
MAX_RETRIES=30
RETRY_COUNT=0

until nc -z "$DB_HOST" "$DB_PORT" || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "  Attempt $RETRY_COUNT/$MAX_RETRIES - Database not ready yet..."
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "ERROR: Database did not become available after $MAX_RETRIES attempts"
  exit 1
fi

echo "✓ Database is ready!"

# Run Prisma migrations
echo ""
echo "Running database migrations..."
if npx prisma migrate deploy; then
  echo "✓ Migrations completed successfully"
else
  echo "ERROR: Migration failed"
  exit 1
fi

# Start the application
echo ""
echo "Starting Snap-It backend server..."
echo "==================================="
echo ""

exec node dist/index.js

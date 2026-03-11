# Installation Guide

Complete guide to installing and configuring Snap-It.

## Prerequisites

### Required

| Software | Version | Purpose              |
| -------- | ------- | -------------------- |
| Node.js  | 20+     | Runtime environment  |
| pnpm     | 10+     | Package manager      |
| Docker   | Latest  | PostgreSQL container |

### Verify Prerequisites

```bash
node --version   # Should be 20.x or higher
pnpm --version   # Should be 10.x or higher
docker --version # Should show Docker version
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd snap-it
```

## Step 2: Install Dependencies

```bash
pnpm install
```

This installs all dependencies for the monorepo using pnpm workspaces.

## Step 3: Set Up the Database

### Start PostgreSQL

```bash
docker compose up -d
```

The database credentials (defined in `docker-compose.yml`):

| Setting  | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| User     | snapit    |
| Password | snapit    |
| Database | snapit    |

### Verify Database Connection

```bash
docker compose ps
```

You should see `snapit-db` with status `running`.

## Step 4: Configure Environment Variables

### Backend (`packages/backend/.env`)

```bash
cp packages/backend/.env.example packages/backend/.env
```

Edit the file:

```env
# Database connection
DATABASE_URL="postgresql://snapit:snapit@localhost:5432/snapit"

# Server port (default: 9000)
PORT=9000

# Admin authentication password
ADMIN_PASSWORD="change-me-in-production"

# CORS allowed origins
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3002"

# Environment mode
NODE_ENV="development"
```

### Web App (`apps/web/.env.local`)

```bash
cp apps/web/.env.example apps/web/.env.local
```

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

### Admin App (`apps/admin/.env.local`)

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
ADMIN_PASSWORD=change-me-in-production
```

## Step 5: Initialize Database Schema

Create the initial migration and apply it:

```bash
pnpm --filter @snap-it/backend db:migrate --name init
```

This:

1. Creates migration files in `packages/backend/prisma/migrations/`
2. Applies the migration to create the `Event` table
3. Generates the Prisma client

## Step 6: Start the Development Servers

### All Apps at Once

```bash
pnpm dev
```

### Individual Apps

```bash
# Web editor only
pnpm --filter @snap-it/web dev

# Admin dashboard only
pnpm --filter @snap-it/admin dev

# Backend API only
pnpm --filter @snap-it/backend dev
```

## Verify Installation

| Check           | Command/URL                                |
| --------------- | ------------------------------------------ |
| Backend health  | `curl http://localhost:9000/health`        |
| Web editor      | Open http://localhost:3000                 |
| Admin dashboard | Open http://localhost:3002                 |
| Prisma Studio   | `pnpm --filter @snap-it/backend db:studio` |

## Troubleshooting

### Database Connection Failed

```
Error: Can't reach database server at `localhost:5432`
```

**Solution:** Ensure Docker is running and the container is up:

```bash
docker compose up -d
docker compose ps
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Kill the process using the port:

```bash
lsof -i :3000  # Find the process
kill -9 <PID>  # Kill it
```

### Prisma Client Not Generated

```
Error: Cannot find module '@prisma/client'
```

**Solution:** Regenerate the client:

```bash
pnpm --filter @snap-it/backend db:generate
```

## Next Steps

- [Quick Start](./quick-start.md) — 5-minute setup summary
- [Architecture Overview](../architecture/overview.md) — system design
- [Development Guide](../guides/development.md) — local dev workflow

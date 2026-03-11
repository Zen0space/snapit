# Quick Start

Get Snap-It running locally in 5 minutes.

## Prerequisites

- **Node.js** 20+
- **pnpm** 10+
- **Docker** (for PostgreSQL)

## 1. Clone and Install

```bash
git clone <repository-url>
cd snap-it
pnpm install
```

## 2. Start the Database

```bash
docker compose up -d
```

This starts PostgreSQL at `localhost:5432`.

## 3. Set Up Environment Variables

```bash
# Copy example files
cp packages/backend/.env.example packages/backend/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Edit `packages/backend/.env` and change `ADMIN_PASSWORD`:

```env
ADMIN_PASSWORD="your-secure-password"
```

## 4. Initialize the Database

```bash
pnpm --filter @snap-it/backend db:migrate --name init
```

## 5. Start All Apps

```bash
pnpm dev
```

## Access the Apps

| App             | URL                          |
| --------------- | ---------------------------- |
| Web Editor      | http://localhost:3000        |
| Admin Dashboard | http://localhost:3002        |
| Backend API     | http://localhost:9001        |
| Health Check    | http://localhost:9001/health |

## Next Steps

- [Full Installation Guide](./installation.md) — detailed setup options
- [Architecture Overview](../architecture/overview.md) — understand the system
- [Development Guide](../guides/development.md) — local dev workflow

# Snap-It

Screenshot beautifier with analytics. Monorepo: **Turborepo + pnpm**.

## Structure

```
apps/
  web/     → Next.js editor (port 3000) — deploy to Vercel
  admin/   → Next.js admin panel (port 3002) — deploy to Vercel
packages/
  backend/ → Express + tRPC + Prisma (port 3001) — deploy to VPS
  types/   → Shared TypeScript types
```

---

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
# Copy the example files
cp packages/backend/.env.example packages/backend/.env
cp apps/web/.env.example          apps/web/.env.local
cp apps/admin/.env.example        apps/admin/.env.local
```

Edit `packages/backend/.env` and set a real `ADMIN_PASSWORD`.

### 3. Start the database

PostgreSQL runs in Docker. The backend runs on your host.

```bash
docker compose up -d
# PostgreSQL is now available at localhost:5432
# credentials: snapit / snapit / snapit (user / password / db)
```

### 4. Set up the database schema

On first run, create the initial migration and apply it:

```bash
# Create migration files from the Prisma schema and apply them
pnpm --filter @snap-it/backend db:migrate --name init
```

On subsequent runs after a schema change:

```bash
# Create a new named migration
pnpm --filter @snap-it/backend db:migrate --name your_change_name
```

Prisma client is regenerated automatically after every `migrate dev`. To regenerate manually:

```bash
pnpm --filter @snap-it/backend db:generate
```

### 5. Start all apps

```bash
pnpm dev
# web     → http://localhost:3000
# admin   → http://localhost:3002
# backend → http://localhost:3001
```

Or run individually:

```bash
pnpm --filter @snap-it/web     dev
pnpm --filter @snap-it/admin   dev
pnpm --filter @snap-it/backend dev
```

---

## Prisma Workflow

| Command | When to use |
|---|---|
| `pnpm --filter @snap-it/backend db:migrate --name <name>` | Schema changed — creates migration files + applies them |
| `pnpm --filter @snap-it/backend db:generate` | Regenerate Prisma client without migrating |
| `pnpm --filter @snap-it/backend db:studio` | Open Prisma Studio GUI at `localhost:5555` |

> **Never** use `prisma db push` in this project — it skips migration files and is not safe for tracked schemas.

---

## Docker

Only PostgreSQL runs in Docker. The backend (`pnpm dev`) runs on your host machine.

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL (data persisted in pg_data volume)
docker compose down

# Stop and wipe all data
docker compose down -v

# View DB logs
docker compose logs -f db
```

The `pg_data` named volume persists your database between restarts.

---

## Deployment

### Web + Admin → Vercel

- Import `apps/web` and `apps/admin` as separate Vercel projects
- Set `NEXT_PUBLIC_BACKEND_URL` to your VPS backend URL on both
- Set `ADMIN_PASSWORD` on the admin Vercel project

### Backend → VPS

```bash
# Build
pnpm --filter @snap-it/backend build

# Apply migrations against production DB (non-interactive, safe for CI/CD)
DATABASE_URL="..." pnpm --filter @snap-it/backend exec prisma migrate deploy

# Start with pm2
pm2 start packages/backend/dist/index.js --name snap-it-backend
```

Set up nginx to reverse-proxy port 3001 to your domain.

---

## Features

**Web editor (`apps/web`)**
- Drag & drop / paste from clipboard (`⌘V`)
- 12 background gradient presets + custom color picker
- Rounded corners + drop shadow with blur/offset controls
- Text annotation (click to place, double-click to edit)
- Blur / redact tool (draw a rectangle to cover sensitive areas)
- Aspect ratio presets: Free, 1:1, 16:9, 4:3, 3:2, 2:1, 9:16
- Export as PNG at 2× resolution

**Admin panel (`apps/admin`)**
- Password-protected login (env var, httpOnly cookie, 7-day session)
- Dashboard: stat cards, 30-day events line chart, top countries bar chart, browser/device pie charts
- Events table with type filter and pagination

**Backend (`packages/backend`)**
- tRPC over Express — end-to-end type-safe API
- PostgreSQL + Prisma ORM with migration history
- Offline IP geolocation via `geoip-lite` (no API key required)
- User-agent parsing for browser / OS / device detection

---

> TODO: Add landing page — editor will move to `/editor`, `/` becomes the marketing page

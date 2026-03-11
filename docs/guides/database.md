# Database Guide

Prisma and PostgreSQL workflow for Snap-It.

## Overview

Snap-It uses:

- **PostgreSQL** as the database
- **Prisma** as the ORM
- **Docker** for local PostgreSQL

## Local Database Setup

### Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL with these credentials:

| Setting  | Value     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| User     | snapit    |
| Password | snapit    |
| Database | snapit    |

### Stop PostgreSQL

```bash
docker compose down
```

Data persists in the `pg_data` Docker volume.

### Wipe All Data

```bash
docker compose down -v
```

⚠️ This deletes the volume and all data.

## Prisma Commands

All Prisma commands should be run through pnpm:

```bash
pnpm --filter @snap-it/backend <command>
```

### Common Commands

| Command                      | Description                           |
| ---------------------------- | ------------------------------------- |
| `db:migrate --name <name>`   | Create and apply a migration          |
| `db:generate`                | Regenerate Prisma client              |
| `db:studio`                  | Open Prisma Studio GUI                |
| `exec prisma migrate deploy` | Apply migrations (production)         |
| `exec prisma migrate reset`  | Reset database + apply all migrations |

## Schema Changes Workflow

### 1. Edit the Schema

Edit `packages/backend/prisma/schema.prisma`:

```prisma
model Event {
  id        String   @id @default(cuid())
  type      String
  // Add new field
  sessionId String?
  createdAt DateTime @default(now())
}
```

### 2. Create Migration

```bash
pnpm --filter @snap-it/backend db:migrate --name add_session_id
```

This:

1. Creates a migration file in `prisma/migrations/`
2. Applies the migration to your local database
3. Regenerates the Prisma client

### 3. Verify in Studio

```bash
pnpm --filter @snap-it/backend db:studio
```

Opens http://localhost:5555 to browse data visually.

## Current Schema

```prisma
model Event {
  id        String   @id @default(cuid())
  type      String
  tool      String?
  meta      String?
  country   String?
  region    String?
  browser   String?
  os        String?
  device    String?
  createdAt DateTime @default(now())

  @@index([type])
  @@index([createdAt])
  @@index([country])
}
```

### Fields

| Field     | Type     | Required | Description                        |
| --------- | -------- | -------- | ---------------------------------- |
| id        | String   | Yes      | Unique identifier (cuid)           |
| type      | String   | Yes      | Event type                         |
| tool      | String   | No       | Tool name (for `tool_used` events) |
| meta      | String   | No       | Additional JSON metadata           |
| country   | String   | No       | ISO country code                   |
| region    | String   | No       | Region/state                       |
| browser   | String   | No       | Browser name                       |
| os        | String   | No       | Operating system                   |
| device    | String   | No       | desktop, mobile, or tablet         |
| createdAt | DateTime | Yes      | Event timestamp                    |

### Indexes

| Index     | Columns   | Purpose              |
| --------- | --------- | -------------------- |
| Primary   | id        | Unique lookups       |
| Secondary | type      | Filter by event type |
| Secondary | createdAt | Time range queries   |
| Secondary | country   | Country aggregations |

## Prisma Client Usage

### Import

```typescript
import { prisma } from "./prisma";
```

### Create

```typescript
const event = await prisma.event.create({
  data: {
    type: "exported",
    country: "US",
    browser: "Chrome",
    os: "macOS",
    device: "desktop",
  },
});
```

### Find Many

```typescript
const events = await prisma.event.findMany({
  where: { type: "exported" },
  orderBy: { createdAt: "desc" },
  take: 50,
});
```

### Count

```typescript
const count = await prisma.event.count({
  where: { type: "exported" },
});
```

### Group By

```typescript
const byCountry = await prisma.event.groupBy({
  by: ["country"],
  _count: { country: true },
  where: { country: { not: null } },
  orderBy: { _count: { country: "desc" } },
  take: 10,
});
```

## Production Migrations

In production, use `migrate deploy` (non-interactive):

```bash
DATABASE_URL="postgresql://..." pnpm --filter @snap-it/backend exec prisma migrate deploy
```

This:

- Applies pending migrations
- Does NOT create new migrations
- Safe for CI/CD pipelines

## Best Practices

### ✅ Do

- Use `migrate dev` for local development
- Name migrations descriptively: `add_user_table`, `fix_event_index`
- Commit migration files to git
- Back up before production migrations

### ❌ Don't

- Don't use `prisma db push` in this project (skips migration history)
- Don't edit migration files after they're applied
- Don't delete migration files
- Don't run `migrate reset` in production

## Troubleshooting

### Migration Fails

```bash
# Mark migration as applied (if it ran manually)
pnpm --filter @snap-it/backend exec prisma migrate resolve --applied <migration_name>
```

### Client Not Generated

```bash
pnpm --filter @snap-it/backend db:generate
```

### Connection Refused

1. Ensure Docker is running: `docker compose ps`
2. Check DATABASE_URL in `.env`
3. Verify PostgreSQL is accepting connections

### Reset Everything

⚠️ This deletes all data:

```bash
pnpm --filter @snap-it/backend exec prisma migrate reset
```

## Next Steps

- [API Reference](../api/trpc.md) — how Prisma is used in the API
- [Development Guide](./development.md) — local dev workflow
- [Deployment Guide](./deployment.md) — production migrations

# Development Guide

Local development workflow and best practices for Snap-It.

## Starting the Development Environment

### Start Everything

```bash
pnpm dev
```

This runs all apps in parallel via Turborepo:

| App     | Port | URL                   |
| ------- | ---- | --------------------- |
| Web     | 3000 | http://localhost:3000 |
| Admin   | 3002 | http://localhost:3002 |
| Backend | 9000 | http://localhost:9000 |

### Start Individual Apps

```bash
# Web editor only
pnpm --filter @snap-it/web dev

# Admin dashboard only
pnpm --filter @snap-it/admin dev

# Backend API only
pnpm --filter @snap-it/backend dev
```

### Start Database Only

```bash
docker compose up -d
```

## Common Commands

### Package Manager Commands

All commands should use pnpm filters to target specific packages:

```bash
# Install dependencies for all packages
pnpm install

# Add a dependency to web app
pnpm --filter @snap-it/web add <package>

# Add a dev dependency to backend
pnpm --filter @snap-it/backend add -D <package>

# Run a script in a specific package
pnpm --filter @snap-it/backend <script>
```

### Build Commands

```bash
# Build all packages
pnpm build

# Build specific app
pnpm --filter @snap-it/web build
pnpm --filter @snap-it/admin build
pnpm --filter @snap-it/backend build
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
pnpm --filter @snap-it/web lint
```

### Type Checking

```bash
# Type check backend
pnpm --filter @snap-it/backend typecheck

# Type check web
pnpm --filter @snap-it/web typecheck
```

## Database Development

### Prisma Studio

Visual database browser at http://localhost:5555:

```bash
pnpm --filter @snap-it/backend db:studio
```

### Create a Migration

After changing `schema.prisma`:

```bash
pnpm --filter @snap-it/backend db:migrate --name describe_your_change
```

### Regenerate Prisma Client

```bash
pnpm --filter @snap-it/backend db:generate
```

> **Note:** `migrate dev` automatically regenerates the client.

See [Database Guide](./database.md) for full Prisma workflow.

## Project Structure

### Adding a New Component (Web)

1. Create component in `apps/web/components/`
2. Export from component file
3. Import and use in page or other component

Example:

```tsx
// apps/web/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Adding a New API Endpoint

1. Add procedure to router in `packages/backend/src/routers/`
2. Export the router type is automatic

Example:

```typescript
// packages/backend/src/routers/analytics.ts
export const analyticsRouter = router({
  // ... existing procedures

  myNewProcedure: publicProcedure
    .input(z.object({ foo: z.string() }))
    .query(async ({ input }) => {
      return { result: input.foo };
    }),
});
```

### Adding a Shared Type

1. Add type to `packages/types/src/index.ts`
2. Rebuild types package (automatic with turborepo)
3. Import in any app/package

```typescript
// packages/types/src/index.ts
export interface MyNewType {
  id: string;
  name: string;
}
```

```typescript
// In any other package
import type { MyNewType } from "@snap-it/types";
```

## Debugging

### Backend Logs

The backend logs to console. Watch for errors:

```bash
pnpm --filter @snap-it/backend dev
```

### Database Queries

Enable Prisma query logging in development by editing `prisma.ts`:

```typescript
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

### Network Requests

Use browser DevTools → Network tab to inspect tRPC requests to `/trpc/*`.

## Hot Reload

All apps support hot reload:

- **Next.js apps**: Fast refresh for React components
- **Backend**: ts-node-dev with `--respawn` flag

Changes to shared types trigger rebuild of dependent packages automatically via Turborepo.

## Testing the Analytics Flow

1. Open http://localhost:3000
2. Upload an image
3. Change background
4. Export the image
5. Check Prisma Studio for recorded events:

```bash
pnpm --filter @snap-it/backend db:studio
```

## Environment Variables

Never commit `.env` files. Always use `.env.example` as a template:

```bash
cp packages/backend/.env.example packages/backend/.env
```

See [Environment Variables Reference](../reference/env-vars.md) for all options.

## Troubleshooting

### Port Conflicts

Find and kill processes using required ports:

```bash
# Find process on port 3000
lsof -i :3000

# Kill by PID
kill -9 <PID>
```

### Module Not Found

Clear pnpm cache and reinstall:

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Prisma Issues

Reset everything (⚠️ deletes all data):

```bash
pnpm --filter @snap-it/backend exec prisma migrate reset
```

## Next Steps

- [Database Guide](./database.md) — Prisma workflow
- [API Reference](../api/trpc.md) — tRPC endpoints
- [Deployment Guide](./deployment.md) — production deployment

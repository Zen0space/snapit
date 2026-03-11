# Architecture Overview

System architecture and design decisions for Snap-It.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel (Edge)                            │
│  ┌─────────────────┐          ┌─────────────────┐              │
│  │   apps/web      │          │   apps/admin    │              │
│  │   (Port 3000)   │          │   (Port 3002)   │              │
│  │                 │          │                 │              │
│  │  Next.js 14     │          │  Next.js 14     │              │
│  │  React 18       │          │  React 18       │              │
│  │  Fabric.js      │          │  Charts         │              │
│  │  Tailwind CSS   │          │  Tailwind CSS   │              │
│  └────────┬────────┘          └────────┬────────┘              │
└───────────┼─────────────────────────────┼───────────────────────┘
            │                             │
            │        tRPC HTTP            │
            ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          VPS                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   packages/backend                          ││
│  │                     (Port 9000)                             ││
│  │                                                             ││
│  │  Express ──► tRPC ──► Prisma ──► PostgreSQL                 ││
│  │                                                             ││
│  │  • /trpc/*     → tRPC endpoints                            ││
│  │  • /health     → Health check                              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL                                 │
│                      (Docker)                                   │
│                                                                 │
│  Tables:                                                        │
│  • Event (analytics data)                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
snap-it/
├── apps/
│   ├── web/              # Screenshot editor (Next.js)
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities, tRPC client
│   │   └── pages/        # Next.js pages
│   │
│   └── admin/            # Admin dashboard (Next.js)
│       ├── components/   # React components
│       ├── hooks/        # Custom hooks
│       └── pages/        # Next.js pages
│
├── packages/
│   ├── backend/          # API server (Express + tRPC)
│   │   ├── src/
│   │   │   ├── routers/  # tRPC routers
│   │   │   ├── prisma.ts # Prisma client
│   │   │   ├── trpc.ts   # tRPC setup
│   │   │   └── index.ts  # Express server
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── types/            # Shared TypeScript types
│       └── src/index.ts
│
├── docker-compose.yml    # PostgreSQL container
├── turbo.json            # Turborepo config
└── pnpm-workspace.yaml   # pnpm workspaces
```

## Data Flow

### Analytics Event Flow

```
User Action (web app)
        │
        ▼
┌───────────────────┐
│ useAnalytics hook │
│ (fire-and-forget) │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ tRPC mutation     │
│ analytics.logEvent│
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Backend router    │
│ • Extract IP      │
│ • Parse User-Agent│
│ • Geo-locate IP   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Prisma            │
│ event.create()    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ PostgreSQL        │
│ Event table       │
└───────────────────┘
```

### Admin Dashboard Flow

```
Admin Login
        │
        ▼
┌───────────────────┐
│ Password check    │
│ (env var)         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ httpOnly cookie   │
│ 7-day session     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ tRPC queries      │
│ • getStats        │
│ • getRecentEvents │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Dashboard charts  │
│ & tables          │
└───────────────────┘
```

## Technology Choices

### Why tRPC?

| Benefit     | Description                                          |
| ----------- | ---------------------------------------------------- |
| Type safety | End-to-end TypeScript types from server to client    |
| No codegen  | Types inferred automatically from router definitions |
| DX          | Autocomplete and type checking in IDE                |
| Performance | Lightweight, no schema generation step               |

### Why Prisma?

| Benefit           | Description                            |
| ----------------- | -------------------------------------- |
| Type-safe queries | Generated TypeScript types for models  |
| Migrations        | Version-controlled schema changes      |
| DX                | Intuitive API, great VS Code extension |
| PostgreSQL        | Full-featured relational database      |

### Why Fabric.js?

| Benefit             | Description                        |
| ------------------- | ---------------------------------- |
| Canvas manipulation | Powerful API for image editing     |
| Object model        | Easy to add text, shapes, filters  |
| Events              | Rich event system for interactions |
| Export              | PNG export at custom resolution    |

## Database Schema

### Event Table

| Column    | Type          | Description                         |
| --------- | ------------- | ----------------------------------- |
| id        | String (cuid) | Primary key                         |
| type      | String        | Event type (e.g., `exported`)       |
| tool      | String?       | Tool used (e.g., `blur`)            |
| meta      | String?       | Additional metadata                 |
| country   | String?       | ISO country code                    |
| region    | String?       | Region/state                        |
| browser   | String?       | Browser name                        |
| os        | String?       | Operating system                    |
| device    | String?       | Device type (desktop/mobile/tablet) |
| createdAt | DateTime      | Timestamp                           |

### Indexes

| Index     | Columns   | Purpose              |
| --------- | --------- | -------------------- |
| Primary   | id        | Fast lookups         |
| Secondary | type      | Filter by event type |
| Secondary | createdAt | Time-based queries   |
| Secondary | country   | Country aggregations |

## Security

### CORS

The backend only accepts requests from allowed origins:

```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3002"
```

### Admin Authentication

- Password stored in environment variable (never in code)
- httpOnly cookie prevents XSS access
- 7-day session expiry
- Server-side validation on every admin request

### Input Validation

All tRPC inputs are validated with Zod schemas before processing.

## Next Steps

- [API Reference](../api/trpc.md) — tRPC endpoints
- [Deployment Guide](../guides/deployment.md) — production deployment
- [Database Guide](../guides/database.md) — Prisma workflow

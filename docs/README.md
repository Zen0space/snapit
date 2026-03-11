# Snap-It Documentation

Welcome to the Snap-It documentation. Snap-It is a screenshot beautifier with built-in analytics.

## Quick Links

| What you want         | Where to go                                             |
| --------------------- | ------------------------------------------------------- |
| Get started quickly   | [Quick Start](./getting-started/quick-start.md)         |
| Full installation     | [Installation Guide](./getting-started/installation.md) |
| Understand the system | [Architecture Overview](./architecture/overview.md)     |
| Local development     | [Development Guide](./guides/development.md)            |
| Deploy to production  | [Deployment Guide](./guides/deployment.md)              |
| Database management   | [Database Guide](./guides/database.md)                  |
| API reference         | [tRPC API](./api/trpc.md)                               |
| Environment variables | [Env Vars Reference](./reference/env-vars.md)           |

## Project Overview

Snap-It is a monorepo built with:

- **Turborepo** for build orchestration
- **pnpm** as the package manager
- **TypeScript** across all packages

### Apps

| App          | Port | Description               |
| ------------ | ---- | ------------------------- |
| `apps/web`   | 3000 | Next.js screenshot editor |
| `apps/admin` | 3002 | Next.js admin dashboard   |

### Packages

| Package            | Description                        |
| ------------------ | ---------------------------------- |
| `packages/backend` | Express + tRPC + Prisma API server |
| `packages/types`   | Shared TypeScript types            |

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | Next.js 14, React 18, Tailwind CSS, Fabric.js |
| Backend    | Express, tRPC, Prisma                         |
| Database   | PostgreSQL                                    |
| Deployment | Vercel (frontend), VPS (backend)              |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Private project.

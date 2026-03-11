# Environment Variables Reference

Complete reference for all environment variables in Snap-It.

## Overview

Each app/package has its own `.env` file:

| Location                | Purpose                      |
| ----------------------- | ---------------------------- |
| `packages/backend/.env` | Backend server configuration |
| `apps/web/.env.local`   | Web app configuration        |
| `apps/admin/.env.local` | Admin app configuration      |

> **Never commit `.env` files.** Use `.env.example` files as templates.

---

## Backend (`packages/backend/.env`)

### `DATABASE_URL`

PostgreSQL connection string.

```env
DATABASE_URL="postgresql://snapit:snapit@localhost:5432/snapit"
```

| Environment | Value                                              |
| ----------- | -------------------------------------------------- |
| Development | `postgresql://snapit:snapit@localhost:5432/snapit` |
| Production  | `postgresql://user:password@host:5432/database`    |

**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

---

### `PORT`

Port for the backend server.

```env
PORT=9000
```

| Default | Production                   |
| ------- | ---------------------------- |
| 9000    | 9000 (or any available port) |

---

### `ADMIN_PASSWORD`

Password for admin dashboard authentication.

```env
ADMIN_PASSWORD="change-me-in-production"
```

| Environment | Recommendation                           |
| ----------- | ---------------------------------------- |
| Development | Any memorable password                   |
| Production  | Strong, unique password (20+ characters) |

⚠️ **Security:** Use a strong, unique password in production.

---

### `ALLOWED_ORIGINS`

Comma-separated list of allowed CORS origins.

```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3002"
```

| Environment | Value                                                       |
| ----------- | ----------------------------------------------------------- |
| Development | `http://localhost:3000,http://localhost:3002`               |
| Production  | `https://your-web.vercel.app,https://your-admin.vercel.app` |

**Notes:**

- No trailing slashes
- Include all frontend URLs that will call the API
- Origins not in this list will be rejected

---

### `NODE_ENV`

Environment mode.

```env
NODE_ENV="development"
```

| Value         | When                   |
| ------------- | ---------------------- |
| `development` | Local development      |
| `production`  | Deployed to production |

---

## Web App (`apps/web/.env.local`)

### `NEXT_PUBLIC_BACKEND_URL`

URL of the backend API.

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

| Environment | Value                        |
| ----------- | ---------------------------- |
| Development | `http://localhost:9000`      |
| Production  | `https://api.yourdomain.com` |

**Note:** The `NEXT_PUBLIC_` prefix makes this available in the browser.

---

## Admin App (`apps/admin/.env.local`)

### `NEXT_PUBLIC_BACKEND_URL`

URL of the backend API.

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
```

Same as web app.

---

### `ADMIN_PASSWORD`

Password for admin login.

```env
ADMIN_PASSWORD=change-me-in-production
```

Must match the backend's `ADMIN_PASSWORD`.

---

## Quick Reference Table

| Variable                  | Backend | Web | Admin |      Required      |
| ------------------------- | :-----: | :-: | :---: | :----------------: |
| `DATABASE_URL`            |   ✅    |     |       |        Yes         |
| `PORT`                    |   ✅    |     |       | No (default: 9000) |
| `ADMIN_PASSWORD`          |   ✅    |     |  ✅   |        Yes         |
| `ALLOWED_ORIGINS`         |   ✅    |     |       |  No (has default)  |
| `NODE_ENV`                |   ✅    |     |       |         No         |
| `NEXT_PUBLIC_BACKEND_URL` |         | ✅  |  ✅   |        Yes         |

---

## Setting Up Environment Files

### Development

```bash
# Copy all example files
cp packages/backend/.env.example packages/backend/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# Edit backend password
nano packages/backend/.env
```

### Production (Vercel)

Set environment variables in Vercel dashboard:

**Web App:**
| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com` |

**Admin App:**
| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com` |
| `ADMIN_PASSWORD` | `your-secure-password` |

### Production (VPS)

Create `.env` file on the server:

```bash
# SSH into VPS
ssh user@your-vps

# Create/edit env file
nano packages/backend/.env
```

Paste production values:

```env
DATABASE_URL="postgresql://..."
PORT=9000
ADMIN_PASSWORD="your-secure-password"
ALLOWED_ORIGINS="https://your-web.vercel.app,https://your-admin.vercel.app"
NODE_ENV="production"
```

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong passwords** for `ADMIN_PASSWORD` (20+ characters)
3. **Restrict `ALLOWED_ORIGINS`** to only your frontend URLs
4. **Use environment-specific values** — different passwords for dev/prod
5. **Rotate credentials** periodically
6. **Use secrets management** in production (Vault, AWS Secrets Manager, etc.)

---

## Troubleshooting

### CORS Errors

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:** Add the origin to `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3002,https://your-new-origin.com"
```

### Database Connection Failed

```
Error: Can't reach database server at `localhost:5432`
```

**Solution:**

1. Verify `DATABASE_URL` is correct
2. Ensure PostgreSQL is running (`docker compose up -d`)
3. Check network connectivity

### Admin Login Fails

**Solution:**

1. Verify `ADMIN_PASSWORD` matches in both:
   - `packages/backend/.env`
   - `apps/admin/.env.local`
2. Restart both apps after changing passwords

---

## Next Steps

- [Installation Guide](../getting-started/installation.md) — full setup
- [Deployment Guide](../guides/deployment.md) — production deployment
- [Development Guide](../guides/development.md) — local development

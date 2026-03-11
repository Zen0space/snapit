# Deployment Guide

Deploy Snap-It to production. Frontend apps go to Vercel, backend goes to a VPS.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL                           │
│  ┌─────────────────┐    ┌─────────────────┐        │
│  │   apps/web      │    │   apps/admin    │        │
│  │   (screenshot   │    │   (dashboard)   │        │
│  │    editor)      │    │                 │        │
│  └────────┬────────┘    └────────┬────────┘        │
└───────────┼──────────────────────┼─────────────────┘
            │                      │
            │    tRPC over HTTPS   │
            ▼                      ▼
┌─────────────────────────────────────────────────────┐
│                      VPS                            │
│  ┌───────────────────────────────────────────────┐ │
│  │           packages/backend                    │ │
│  │           Express + tRPC + Prisma             │ │
│  └───────────────────────────────────────────────┘ │
│                      │                             │
│                      ▼                             │
│  ┌───────────────────────────────────────────────┐ │
│  │           PostgreSQL                          │ │
│  │           (managed or self-hosted)            │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

- Vercel account
- VPS (DigitalOcean, Hetzner, AWS EC2, etc.)
- PostgreSQL database (managed or self-hosted)
- Domain name (optional but recommended)

## Step 1: Deploy Backend to VPS

### 1.1 Set Up the VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2

# Install PostgreSQL (if self-hosting)
sudo apt install postgresql postgresql-contrib
```

### 1.2 Clone and Build

```bash
# Clone the repository
git clone <repository-url>
cd snap-it

# Install dependencies
pnpm install

# Build the backend
pnpm --filter @snap-it/backend build
```

### 1.3 Configure Environment

Create `packages/backend/.env`:

```env
# Production database URL
DATABASE_URL="postgresql://user:password@host:5432/snapit"

# Server port
PORT=9000

# Strong admin password
ADMIN_PASSWORD="your-very-secure-password"

# Allowed origins (your Vercel URLs)
ALLOWED_ORIGINS="https://your-app.vercel.app,https://your-admin.vercel.app"

NODE_ENV="production"
```

### 1.4 Run Migrations

```bash
# Apply migrations to production database
pnpm --filter @snap-it/backend exec prisma migrate deploy
```

### 1.5 Start with PM2

```bash
# Start the backend
pm2 start packages/backend/dist/index.js --name snap-it-backend

# Save PM2 config
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### 1.6 Set Up Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/snap-it
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/snap-it /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 1.7 Add SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

## Step 2: Deploy Frontend to Vercel

### 2.1 Deploy Web App

1. Go to [Vercel](https://vercel.com) and import your repository
2. Configure the project:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build` (default)
   - **Output Directory**: `.next` (default)

3. Set environment variables:

| Variable                  | Value                        |
| ------------------------- | ---------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com` |

4. Deploy

### 2.2 Deploy Admin App

1. Import the same repository again
2. Configure the project:
   - **Root Directory**: `apps/admin`
   - **Framework Preset**: Next.js

3. Set environment variables:

| Variable                  | Value                        |
| ------------------------- | ---------------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com` |
| `ADMIN_PASSWORD`          | `your-very-secure-password`  |

4. Deploy

## Step 3: Update CORS

Update your backend's `ALLOWED_ORIGINS` with the Vercel URLs:

```env
ALLOWED_ORIGINS="https://your-web-app.vercel.app,https://your-admin-app.vercel.app"
```

Restart the backend:

```bash
pm2 restart snap-it-backend
```

## Step 4: Verify Deployment

### Backend Health Check

```bash
curl https://api.yourdomain.com/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Web App

1. Open your Vercel URL
2. Upload an image
3. Edit and export
4. Verify in Prisma Studio or admin dashboard

### Admin Dashboard

1. Open your admin Vercel URL
2. Log in with your admin password
3. Verify analytics data is flowing

## CI/CD (Optional)

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - "packages/backend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd snap-it
            git pull
            pnpm install
            pnpm --filter @snap-it/backend build
            pnpm --filter @snap-it/backend exec prisma migrate deploy
            pm2 restart snap-it-backend
```

## Database Backups

### Manual Backup

```bash
pg_dump -U snapit -h localhost snapit > backup.sql
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * pg_dump -U snapit snapit > /backups/snapit-$(date +\%Y\%m\%d).sql
```

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs snap-it-backend

# Monitor resources
pm2 monit
```

### Uptime Monitoring

Use services like:

- UptimeRobot (free)
- Pingdom
- Better Uptime

## Troubleshooting

### Backend Won't Start

Check logs:

```bash
pm2 logs snap-it-backend --lines 100
```

### Database Connection Issues

Verify DATABASE_URL and ensure PostgreSQL is running:

```bash
sudo systemctl status postgresql
```

### CORS Errors

1. Check `ALLOWED_ORIGINS` includes your frontend URLs
2. Ensure URLs don't have trailing slashes
3. Restart backend after changes

### SSL Certificate Issues

Renew Let's Encrypt certificates:

```bash
sudo certbot renew
```

## Next Steps

- [Environment Variables Reference](../reference/env-vars.md)
- [API Reference](../api/trpc.md)
- [Database Guide](./database.md)

# Stage 1: Base - Setup pnpm environment
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

# Stage 2: Dependencies - Install all dependencies with caching
FROM base AS deps
# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY turbo.json tsconfig.base.json ./
# Copy package.json files for workspace dependencies
COPY packages/backend/package.json ./packages/backend/
COPY packages/types/package.json ./packages/types/
# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Stage 3: Builder - Build the application
FROM deps AS builder
# Copy source files
COPY packages/types ./packages/types
COPY packages/backend ./packages/backend
# Generate Prisma client
WORKDIR /app/packages/backend
RUN pnpm exec prisma generate
# Build TypeScript to JavaScript
RUN pnpm build
# Verify build output
RUN ls -la dist/

# Stage 4: Runner - Production image
FROM base AS runner
ENV NODE_ENV=production

# Install netcat for database health check and OpenSSL for Prisma
RUN apk add --no-cache netcat-openbsd openssl openssl-dev

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy workspace configuration
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/package.json ./packages/backend/
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/prisma ./packages/backend/prisma

# Copy node_modules (includes Prisma client and dependencies)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/node_modules ./packages/backend/node_modules

# Copy types package (workspace dependency)
COPY --from=builder --chown=nodejs:nodejs /app/packages/types ./packages/types

# Copy entrypoint script
COPY --chown=nodejs:nodejs packages/backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Switch to non-root user
USER nodejs

WORKDIR /app/packages/backend

# Expose port 9000
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]

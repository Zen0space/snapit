// Lightweight tRPC client for the admin app — no React Query needed,
// just plain HTTP calls with fetch.
// AppRouter is imported type-only from the backend package.

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@snap-it/backend/src/router'

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'
}

export function createAdminTrpc(password: string) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBackendUrl()}/trpc`,
        headers: {
          Authorization: `Bearer ${password}`,
        },
      }),
    ],
  })
}

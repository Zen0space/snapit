// Lightweight tRPC client for the admin app — no React Query needed,
// just plain HTTP calls with fetch.
// AppRouter is imported type-only from the backend package.

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@snap-it/backend/src/router";
import { createSessionToken } from "@/lib/session";

// Short-lived token TTL for backend API calls — 5 minutes is enough for a
// single server-side render; the raw ADMIN_PASSWORD never travels the wire.
const API_TOKEN_TTL_SECONDS = 5 * 60;

function getBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
}

export async function createAdminTrpc(password: string) {
  // Generate a short-lived HMAC-signed token instead of sending the raw password.
  const token = await createSessionToken(password, API_TOKEN_TTL_SECONDS);

  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBackendUrl()}/trpc`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ],
  });
}

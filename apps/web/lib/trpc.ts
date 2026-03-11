import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@snap-it/backend/src/router'

/**
 * Singleton tRPC proxy client — industry standard pattern.
 * All procedures are fully type-safe end-to-end via AppRouter.
 * Used for fire-and-forget analytics calls from the web editor.
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'}/trpc`,
    }),
  ],
})

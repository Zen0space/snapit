import { useCallback } from 'react'
import type { EventType } from '@snap-it/types'

// Fire-and-forget analytics — never blocks the UI
export function useAnalytics() {
  const logEvent = useCallback(
    (type: EventType, options?: { tool?: string; meta?: string }) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'

      // tRPC wire protocol: input must be wrapped in a `json` key
      // Shape: { "0": { "json": { ...input } } }
      const payload = JSON.stringify({
        '0': { json: { type, tool: options?.tool ?? null, meta: options?.meta ?? null } },
      })

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' })
        navigator.sendBeacon(`${backendUrl}/trpc/analytics.logEvent`, blob)
      } else {
        // Fallback: plain fetch, ignore errors
        fetch(`${backendUrl}/trpc/analytics.logEvent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        }).catch(() => {
          // Silently fail — analytics should never break the app
        })
      }
    },
    []
  )

  return { logEvent }
}

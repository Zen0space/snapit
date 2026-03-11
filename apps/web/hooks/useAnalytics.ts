import { useCallback } from 'react'
import type { EventType } from '@snap-it/types'
import { trpc } from '@/lib/trpc'

/**
 * Fire-and-forget analytics hook.
 * Uses the typed tRPC client — never blocks the UI, silently swallows errors.
 */
export function useAnalytics() {
  const logEvent = useCallback(
    (type: EventType, options?: { tool?: string; meta?: string }) => {
      trpc.analytics.logEvent
        .mutate({
          type,
          tool: options?.tool,
          meta: options?.meta,
        })
        .catch(() => {
          // Silently fail — analytics must never break the app
        })
    },
    []
  )

  return { logEvent }
}

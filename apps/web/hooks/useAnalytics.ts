import { useCallback } from "react";
import type { EventType } from "@snap-it/types";
import { trpc } from "@/lib/trpc";
import { useCookieConsent } from "@/hooks/useCookieConsent";

/** Events allowed under "necessary only" consent. */
const NECESSARY_EVENTS: ReadonlySet<EventType> = new Set([
  "image_uploaded",
  "exported",
  "copied",
]);

/**
 * Fire-and-forget analytics hook.
 * Uses the typed tRPC client — never blocks the UI, silently swallows errors.
 *
 * Consent gating:
 * - `null`        → no consent given yet, all events are suppressed
 * - `"necessary"` → only `image_uploaded`, `exported`, and `copied` fire
 * - `"all"`       → all events fire
 *
 * The anonymous `visitorId` is attached to every event that fires so the
 * admin can group events by visitor on the Cookies page.
 */
export function useAnalytics() {
  const { consent, visitorId } = useCookieConsent();

  const logEvent = useCallback(
    (type: EventType, options?: { tool?: string; meta?: string }) => {
      if (consent === null) return;
      if (consent === "necessary" && !NECESSARY_EVENTS.has(type)) return;

      trpc.analytics.logEvent
        .mutate({
          type,
          tool: options?.tool,
          meta: options?.meta,
          visitorId: visitorId ?? undefined,
        })
        .catch(() => {
          // Silently fail — analytics must never break the app
        });
    },
    [consent, visitorId],
  );

  return { logEvent };
}

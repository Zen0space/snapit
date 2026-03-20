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
      // Fallback: if React state is null but localStorage has value, use it
      let effectiveConsent = consent;
      if (consent === null && typeof window !== "undefined") {
        const stored = localStorage.getItem("snap_cookie_consent");
        if (stored === "all" || stored === "necessary") {
          effectiveConsent = stored as "all" | "necessary";
        }
      }

      if (effectiveConsent === null) return;
      if (effectiveConsent === "necessary" && !NECESSARY_EVENTS.has(type)) {
        return;
      }

      // Fallback: if visitorId is null but localStorage has it, use it
      let effectiveVisitorId = visitorId;
      if (!effectiveVisitorId && typeof window !== "undefined") {
        effectiveVisitorId = localStorage.getItem("snap_visitor_id") ?? null;
      }

      trpc.analytics.logEvent
        .mutate({
          type,
          tool: options?.tool,
          meta: options?.meta,
          visitorId: effectiveVisitorId ?? undefined,
        })
        .catch(() => {
          // Silently swallow — analytics should never block the UI
        });
    },
    [consent, visitorId],
  );

  return { logEvent };
}

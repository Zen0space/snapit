"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConsentLevel } from "@snap-it/types";
import { trpc } from "@/lib/trpc";
import { LS_COOKIE_CONSENT, LS_VISITOR_ID } from "@/shared/constants";

/**
 * Reads and writes cookie consent to localStorage.
 * - `null`        → no decision yet, banner should show
 * - `"all"`       → user allowed all analytics
 * - `"necessary"` → user allowed necessary only (upload + export events)
 *
 * On the first consent decision a UUID is generated and persisted as the
 * anonymous visitorId. Both the consent level and visitorId are synced to
 * the backend (fire-and-forget) so the admin can see them in the Cookies page.
 */
export function useCookieConsent() {
  const [consent, setConsentState] = useState<ConsentLevel | null>(null);
  const [visitorId, setVisitorIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted values after mount to avoid SSR mismatch
  useEffect(() => {
    const storedConsent = localStorage.getItem(LS_COOKIE_CONSENT);
    const storedVisitorId = localStorage.getItem(LS_VISITOR_ID);

    if (storedConsent === "all" || storedConsent === "necessary") {
      setConsentState(storedConsent);
    }
    if (storedVisitorId) {
      setVisitorIdState(storedVisitorId);
    }

    setHydrated(true);
  }, []);

  const setConsent = useCallback((value: ConsentLevel) => {
    // Reuse existing visitorId or generate a new one on first consent
    let vid = localStorage.getItem(LS_VISITOR_ID);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(LS_VISITOR_ID, vid);
      setVisitorIdState(vid);
    }

    localStorage.setItem(LS_COOKIE_CONSENT, value);
    setConsentState(value);

    // Sync to backend — fire-and-forget, must never block or throw
    trpc.consent.setConsent
      .mutate({ visitorId: vid, consent: value })
      .catch(() => {
        // Silently swallow — consent sync should never block the UI
      });
  }, []);

  return {
    /** Current consent level. `null` while hydrating or before the user decides. */
    consent,
    /** Anonymous visitor UUID — set when the user first makes a consent choice. */
    visitorId,
    /** True once the stored values have been read from localStorage. */
    hydrated,
    /** Whether the banner should be shown. */
    showBanner: hydrated && consent === null,
    setConsent,
  };
}

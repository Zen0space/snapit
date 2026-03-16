"use client";

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export type CookieConsent = "all" | "necessary";

const CONSENT_KEY = "snap_cookie_consent";
const VISITOR_KEY = "snap_visitor_id";

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
  const [consent, setConsentState] = useState<CookieConsent | null>(null);
  const [visitorId, setVisitorIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read persisted values after mount to avoid SSR mismatch
  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedVisitorId = localStorage.getItem(VISITOR_KEY);

    if (storedConsent === "all" || storedConsent === "necessary") {
      setConsentState(storedConsent);
    }
    if (storedVisitorId) {
      setVisitorIdState(storedVisitorId);
    }
    setHydrated(true);
  }, []);

  const setConsent = useCallback((value: CookieConsent) => {
    // Reuse existing visitorId or generate a new one on first consent
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, vid);
      setVisitorIdState(vid);
    }

    localStorage.setItem(CONSENT_KEY, value);
    setConsentState(value);

    // Sync to backend — fire-and-forget, must never block or throw
    trpc.consent.setConsent
      .mutate({ visitorId: vid, consent: value })
      .catch(() => {
        // Silently fail — consent storage must never break the app
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

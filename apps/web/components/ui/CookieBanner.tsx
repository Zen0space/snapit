"use client";

import Link from "next/link";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export function CookieBanner() {
  const { showBanner, setConsent } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2">
      {/* Glow backdrop */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-sky-500/30 via-violet-500/20 to-sky-500/30 blur-sm" />

      {/* Card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#141414]/95 p-5 shadow-2xl backdrop-blur-xl">
        {/* Cookie icon + heading */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-violet-500">
            <svg
              className="h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">
            Cookie Preferences
          </span>
        </div>

        {/* Body text */}
        <p className="mb-3 text-xs leading-relaxed text-neutral-400">
          We use anonymous analytics to understand how Snap-It is used and
          improve the experience. No personal data is sold or shared.{" "}
          <span className="text-neutral-500">
            "Necessary only" limits tracking to uploads &amp; exports.
          </span>
        </p>

        <Link
          href="/cookie-policy"
          className="mb-4 inline-block text-xs text-neutral-500 underline-offset-2 hover:text-neutral-300 hover:underline transition-colors"
        >
          See our Cookie Policy →
        </Link>

        {/* Divider */}
        <div className="mb-4 h-px bg-white/5" />

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={() => setConsent("necessary")}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-neutral-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            Necessary Only
          </button>
          <button
            onClick={() => setConsent("all")}
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-violet-400 hover:shadow-sky-500/30 active:scale-[0.98]"
          >
            Allow All
          </button>
        </div>
      </div>
    </div>
  );
}

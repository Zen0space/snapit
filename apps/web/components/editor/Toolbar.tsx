"use client";

import { useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { hasImageAtom } from "@/store/atoms";
import { useAnalytics } from "@/hooks/useAnalytics";
import ExportDropdown from "./ExportDropdown";
import MobileNavDrawer from "./MobileNavDrawer";

interface ToolbarProps {
  onExport: () => void;
  onCopyToClipboard: () => void;
}

export default function Toolbar({ onExport, onCopyToClipboard }: ToolbarProps) {
  const hasImage = useAtomValue(hasImageAtom);
  const { logEvent } = useAnalytics();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleExport = () => {
    onExport();
    logEvent("exported");
  };

  const handleCopyToClipboard = () => {
    onCopyToClipboard();
    logEvent("copied");
  };

  return (
    <header className="h-14 flex items-center justify-between px-3 sm:px-5 border-b border-amber-500/20 bg-gradient-to-r from-[#0a1f0f] via-[#0f2b16] to-[#0a1f0f] flex-shrink-0 relative z-20">
      {/* Contained decorative elements — overflow-hidden here instead of on header so dropdown isn't clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle animated gold shimmer across the navbar */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, #d4af37 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "eidNavShimmer 4s ease-in-out infinite",
          }}
        />

        {/* Decorative twinkling stars on navbar */}
        <span
          className="absolute text-[8px] text-amber-400/40"
          style={{
            top: "6px",
            left: "30%",
            animation: "eidTwinkle 3s 0.5s ease-in-out infinite",
          }}
        >
          ✦
        </span>
        <span
          className="absolute text-[6px] text-amber-400/30 hidden sm:inline"
          style={{
            top: "10px",
            left: "55%",
            animation: "eidTwinkle 4s 1.2s ease-in-out infinite",
          }}
        >
          ✦
        </span>
        <span
          className="absolute text-[7px] text-amber-400/35 hidden sm:inline"
          style={{
            bottom: "8px",
            right: "35%",
            animation: "eidTwinkle 3.5s 2s ease-in-out infinite",
          }}
        >
          ✦
        </span>
      </div>

      {/* Left — Logo */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <span className="font-semibold text-white tracking-tight">Snap-It</span>
        <span className="text-[10px] text-amber-400/50 bg-amber-400/10 px-1.5 py-0.5 rounded font-mono hidden sm:inline">
          BETA
        </span>
      </div>

      {/* Center — Eid Mubarak greeting */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        <span
          className="text-sm sm:text-base font-semibold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent tracking-wide whitespace-nowrap"
          style={{ animation: "eidTextGlow 3s ease-in-out infinite" }}
        >
          <span className="hidden sm:inline">🌙 Happy Eid Mubarak ✨</span>
          <span className="sm:hidden">🌙 Eid Mubarak ✨</span>
        </span>
      </div>

      {/* Right — Desktop actions (lg+) */}
      <div className="hidden lg:flex items-center gap-2 relative z-10">
        <Link
          href="/changelog"
          className="text-xs font-medium bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent hover:from-amber-200 hover:to-emerald-300 transition-all"
        >
          Changelog
        </Link>

        <ExportDropdown
          onExport={handleExport}
          onCopy={handleCopyToClipboard}
          disabled={!hasImage}
        />
      </div>

      {/* Right — Mobile hamburger (< lg) */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="lg:hidden relative z-10 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile side drawer */}
      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onExport={handleExport}
        disabled={!hasImage}
      />
    </header>
  );
}

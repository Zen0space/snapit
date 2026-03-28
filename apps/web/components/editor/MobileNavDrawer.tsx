"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  disabled: boolean;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  onExport,
  disabled,
}: MobileNavDrawerProps) {
  // useEffect required: portals need document.body which only exists after
  // hydration. No Jotai/atom alternative — this is a React lifecycle concern,
  // not state management.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = () => {
    onExport();
    onClose();
  };

  if (!mounted) return null;

  // Portal to body so the drawer escapes the header's stacking context (z-20)
  return createPortal(
    <>
      {/* Backdrop — above MobileBottomSheet (z-50) */}
      <div
        className={`fixed inset-0 bg-black/50 z-[55] lg:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer — above backdrop */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-gradient-to-b from-[#0a1f0f] to-[#040f08] border-l border-amber-500/20 z-[60] lg:hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header — matches toolbar h-14 and gradient */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-amber-500/20 bg-gradient-to-r from-[#0a1f0f] via-[#0f2b16] to-[#0a1f0f]">
          <span className="text-sm font-semibold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 text-amber-400/50 hover:text-amber-300 transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col p-3 gap-1">
          <button
            onClick={handleExport}
            disabled={disabled}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-100/80 hover:bg-amber-500/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-amber-400/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export PNG
          </button>

          <Link
            href="/changelog"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-amber-100/80 hover:bg-amber-500/10 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-amber-400/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Changelog
          </Link>
        </nav>
      </div>
    </>,
    document.body,
  );
}

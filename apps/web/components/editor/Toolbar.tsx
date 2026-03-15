"use client";

import Link from "next/link";
import { useEditorStore } from "@/store/editorStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import ExportDropdown from "./ExportDropdown";

interface ToolbarProps {
  onExport: () => void;
  onCopyToClipboard: () => void;
}

export default function Toolbar({ onExport, onCopyToClipboard }: ToolbarProps) {
  const { hasImage } = useEditorStore();
  const { logEvent } = useAnalytics();

  const handleExport = () => {
    onExport();
    logEvent("exported");
  };

  const handleCopyToClipboard = () => {
    onCopyToClipboard();
    logEvent("copied");
  };

  return (
    <header className="h-14 flex items-center justify-between px-3 sm:px-5 border-b border-white/10 bg-[#0f0f0f] flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
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
        <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded font-mono hidden sm:inline">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/changelog"
          className="text-xs font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent hover:from-pink-300 hover:to-purple-300 transition-all"
        >
          Changelog
        </Link>

        <ExportDropdown
          onExport={handleExport}
          onCopy={handleCopyToClipboard}
          disabled={!hasImage}
        />
      </div>
    </header>
  );
}

"use client";

import { useEditorStore } from "@/store/editorStore";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ToolbarProps {
  onExport: () => void;
  onReset: () => void;
}

export default function Toolbar({ onExport, onReset }: ToolbarProps) {
  const { hasImage } = useEditorStore();
  const { logEvent } = useAnalytics();

  const handleExport = () => {
    onExport();
    logEvent("exported");
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
        <span className="font-semibold text-white tracking-tight hidden sm:inline">
          Snap-It
        </span>
        <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded font-mono hidden sm:inline">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-2">
        {hasImage && (
          <button
            onClick={onReset}
            className="px-2 sm:px-3 py-1.5 text-sm text-white/50 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
          >
            <span className="hidden sm:inline">New image</span>
            <svg
              className="w-4 h-4 sm:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}

        <button
          onClick={handleExport}
          disabled={!hasImage}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          <span className="hidden sm:inline">Export PNG</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </header>
  );
}

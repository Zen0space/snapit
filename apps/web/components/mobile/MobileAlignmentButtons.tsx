"use client";

interface MobileAlignmentButtonsProps {
  onCenterHorizontal: () => void;
  onCenterVertical: () => void;
  onCenterBoth: () => void;
}

export default function MobileAlignmentButtons({
  onCenterHorizontal,
  onCenterVertical,
  onCenterBoth,
}: MobileAlignmentButtonsProps) {
  return (
    <div className="flex gap-2">
      {/* Center Horizontal */}
      <button
        onClick={onCenterHorizontal}
        className="flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        aria-label="Center Horizontal"
      >
        <svg
          className="w-5 h-5 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="4" y1="12" x2="10" y2="12" />
          <line x1="14" y1="12" x2="20" y2="12" />
        </svg>
      </button>

      {/* Center Vertical */}
      <button
        onClick={onCenterVertical}
        className="flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        aria-label="Center Vertical"
      >
        <svg
          className="w-5 h-5 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="4" x2="12" y2="10" />
          <line x1="12" y1="14" x2="12" y2="20" />
        </svg>
      </button>

      {/* Center Both */}
      <button
        onClick={onCenterBoth}
        className="flex-1 flex items-center justify-center px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        aria-label="Center Both"
      >
        <svg
          className="w-5 h-5 text-white/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>
  );
}

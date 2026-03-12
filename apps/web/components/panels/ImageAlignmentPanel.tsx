"use client";

import { PanelSection } from "@/components/ui/PanelSection";

interface ImageAlignmentPanelProps {
  onCenterHorizontal: () => void;
  onCenterVertical: () => void;
  onCenterBoth: () => void;
}

export default function ImageAlignmentPanel({
  onCenterHorizontal,
  onCenterVertical,
  onCenterBoth,
}: ImageAlignmentPanelProps) {
  return (
    <PanelSection title="Image Alignment">
      <div className="space-y-2">
        {/* Center Horizontal Button */}
        <button
          onClick={onCenterHorizontal}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-white/70 border border-transparent transition-colors"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="4" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="20" y2="12" />
          </svg>
          <span>Center Horizontal</span>
        </button>

        {/* Center Vertical Button */}
        <button
          onClick={onCenterVertical}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-white/70 border border-transparent transition-colors"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="4" x2="12" y2="10" />
            <line x1="12" y1="14" x2="12" y2="20" />
          </svg>
          <span>Center Vertical</span>
        </button>

        {/* Center Both Button */}
        <button
          onClick={onCenterBoth}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-white/70 border border-transparent transition-colors"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Center Both</span>
        </button>
      </div>
    </PanelSection>
  );
}

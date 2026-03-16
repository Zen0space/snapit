"use client";

import { useState, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { ASPECT_RATIO_PRESETS, type AspectRatioPreset } from "@/lib/presets";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function MobileRatioDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { aspectRatio, setAspectRatio } = useEditorStore();

  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, close);

  const handleSelect = (preset: AspectRatioPreset) => {
    setAspectRatio(preset);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-white text-sm font-medium transition-colors"
      >
        <span>{aspectRatio.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-xl overflow-hidden z-50">
          {ASPECT_RATIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                aspectRatio.id === preset.id
                  ? "bg-sky-500/20 text-sky-400"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span>{preset.label}</span>
              <span className="text-xs opacity-50">{preset.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

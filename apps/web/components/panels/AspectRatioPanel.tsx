"use client";

import { ASPECT_RATIO_PRESETS, type AspectRatioPreset } from "@/lib/presets";
import { useAtomValue, useSetAtom } from "jotai";
import { aspectRatioAtom, setAspectRatioAtom } from "@/store/atoms";
import { PanelSection } from "@/components/ui/PanelSection";

export default function AspectRatioPanel() {
  const aspectRatio = useAtomValue(aspectRatioAtom);
  const setAspectRatio = useSetAtom(setAspectRatioAtom);

  const handleSelect = (preset: AspectRatioPreset) => {
    setAspectRatio(preset);
  };

  return (
    <PanelSection title="Canvas Ratio">
      <div className="space-y-1">
        {ASPECT_RATIO_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              aspectRatio.id === preset.id
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "hover:bg-white/5 text-white/70 border border-transparent"
            }`}
          >
            <span className="font-medium">{preset.label}</span>
            <span className="text-xs opacity-50">{preset.description}</span>
          </button>
        ))}
      </div>
    </PanelSection>
  );
}

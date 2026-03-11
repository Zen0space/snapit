"use client";

import { BACKGROUND_PRESETS, type BackgroundPreset } from "@/lib/presets";
import { useEditorStore } from "@/store/editorStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PanelSection } from "@/components/ui/PanelSection";

export default function BackgroundPicker() {
  const { background, setBackground, customBgColor, setCustomBgColor } =
    useEditorStore();
  const { logEvent } = useAnalytics();

  const handleSelect = (preset: BackgroundPreset) => {
    setBackground(preset);
    logEvent("bg_changed", { meta: preset.id });
  };

  return (
    <PanelSection title="Background">
      <div className="grid grid-cols-4 gap-1.5">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            title={preset.label}
            onClick={() => handleSelect(preset)}
            className={`w-full aspect-square rounded-lg border-2 transition-all relative overflow-hidden ${
              background.id === preset.id
                ? "border-sky-400 scale-95 shadow-lg shadow-sky-500/20"
                : "border-transparent hover:border-white/20"
            }`}
            style={
              preset.value === "transparent"
                ? {
                    background:
                      "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 10px 10px",
                  }
                : { background: preset.value }
            }
          >
            {background.id === preset.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white shadow-lg" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom color */}
      <div className="mt-3 flex items-center gap-2">
        <label className="text-xs text-white/50 flex-1">Custom color</label>
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={customBgColor}
            onChange={(e) => {
              setCustomBgColor(e.target.value);
              setBackground({
                id: "custom",
                label: "Custom",
                type: "solid",
                value: e.target.value,
                fabricValue: e.target.value,
              });
            }}
            className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
          />
          <span className="text-xs font-mono text-white/40">
            {customBgColor}
          </span>
        </div>
      </div>
    </PanelSection>
  );
}

"use client";

import { useEditorStore } from "@/store/editorStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PanelSection } from "@/components/ui/PanelSection";
import { Slider } from "@/components/ui/Slider";

export default function ShadowControls() {
  const {
    shadow,
    setShadow,
    cornerRadius,
    setCornerRadius,
    canvasCornerRadius,
    setCanvasCornerRadius,
    padding,
    setPadding,
  } = useEditorStore();
  const { logEvent } = useAnalytics();

  return (
    <>
      <PanelSection title="Shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-white/50">Enable shadow</span>
          <button
            onClick={() => {
              setShadow({ enabled: !shadow.enabled });
              logEvent("shadow_toggled", { meta: String(!shadow.enabled) });
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              shadow.enabled ? "bg-sky-500" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                shadow.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {shadow.enabled && (
          <div className="w-full space-y-1.5">
            <Slider
              label="Blur"
              value={shadow.blur}
              min={0}
              max={80}
              onChange={(v) => setShadow({ blur: v })}
              unit="px"
            />
            <Slider
              label="Offset Y"
              value={shadow.offsetY}
              min={-40}
              max={40}
              onChange={(v) => setShadow({ offsetY: v })}
              unit="px"
            />
            <Slider
              label="Offset X"
              value={shadow.offsetX}
              min={-40}
              max={40}
              onChange={(v) => setShadow({ offsetX: v })}
              unit="px"
            />
          </div>
        )}
      </PanelSection>

      <PanelSection title="Appearance">
        <div className="w-full space-y-1.5">
          <Slider
            label="Image corners"
            value={cornerRadius}
            min={0}
            max={40}
            onChange={(v) => setCornerRadius(v)}
            unit="px"
          />
          <Slider
            label="Canvas corners"
            value={canvasCornerRadius}
            min={0}
            max={40}
            onChange={(v) => setCanvasCornerRadius(v)}
            unit="px"
          />
          <Slider
            label="Padding"
            value={padding}
            min={0}
            max={160}
            step={4}
            onChange={(v) => setPadding(v)}
            unit="px"
          />
        </div>
      </PanelSection>
    </>
  );
}

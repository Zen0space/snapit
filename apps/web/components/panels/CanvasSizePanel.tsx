"use client";

import { useEditorStore } from "@/store/editorStore";
import { PanelSection } from "@/components/ui/PanelSection";
import { Slider } from "@/components/ui/Slider";

export default function CanvasSizePanel() {
  const {
    canvasMode,
    setCanvasMode,
    canvasVisible,
    setCanvasVisible,
    padding,
    setPadding,
  } = useEditorStore();

  return (
    <PanelSection title="Canvas Size">
      {/* Canvas Visibility Toggle */}
      <div className="mb-3">
        <button
          onClick={() => setCanvasVisible(!canvasVisible)}
          className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
            canvasVisible
              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
          }`}
        >
          {canvasVisible ? "👁️ Canvas Visible" : "👁️‍🗨️ Canvas Hidden"}
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setCanvasMode("ratio")}
          className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            canvasMode === "ratio"
              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              : "bg-white/5 text-white/50 hover:bg-white/10"
          }`}
        >
          Ratio
        </button>
        <button
          onClick={() => setCanvasMode("manual")}
          className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            canvasMode === "manual"
              ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              : "bg-white/5 text-white/50 hover:bg-white/10"
          }`}
        >
          Manual
        </button>
      </div>

      {/* Padding Slider (shown when manual mode) */}
      {canvasMode === "manual" && (
        <div className="space-y-2.5">
          <Slider
            label="Padding"
            value={padding}
            min={0}
            max={100}
            step={1}
            onChange={setPadding}
            unit="px"
          />
        </div>
      )}
    </PanelSection>
  );
}

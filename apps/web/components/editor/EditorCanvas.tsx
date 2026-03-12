"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editorStore";
import { useCanvasDimensions, type CanvasRefs } from "@/hooks/useCanvasCore";
import { useCanvasStyle, useCanvasImage } from "@/hooks/useCanvasStyle";
import { useCanvasTools } from "@/hooks/useCanvasTools";

interface EditorCanvasProps {
  imageDataUrl: string | null;
  onExportReady: (exportFn: () => void) => void;
}

export default function EditorCanvas({
  imageDataUrl,
  onExportReady,
}: EditorCanvasProps) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<typeof import("fabric") | null>(null);
  const canvasRef = useRef<InstanceType<typeof import("fabric").Canvas> | null>(
    null,
  );
  const screenshotRef = useRef<InstanceType<
    typeof import("fabric").FabricImage
  > | null>(null);
  const fabricReadyRef = useRef(false);
  // Mirror prop into ref so async init reads the latest value without being a dep
  const imageUrlRef = useRef<string | null>(imageDataUrl);
  imageUrlRef.current = imageDataUrl;

  const refs: CanvasRefs = {
    containerRef,
    canvasElRef,
    fabricRef,
    canvasRef,
    screenshotRef,
    fabricReadyRef,
  };

  // ── Store ─────────────────────────────────────────────────────────────────
  const {
    canvasVisible,
    canvasCornerRadius,
    canvasMode,
    canvasWidth,
    canvasHeight,
    aspectRatio,
    padding,
  } = useEditorStore();

  // ── Composed hooks ─────────────────────────────────────────────────────────
  const { getDimensions } = useCanvasDimensions({ containerRef });
  const { applyBackground, applyStyle } = useCanvasStyle({ refs });
  const { loadImage } = useCanvasImage({ refs, applyBackground });
  useCanvasTools({ refs });

  // ── Init Fabric (runs once on mount) ──────────────────────────────────────
  // Intentional empty dep array: Fabric is loaded once and cleaned up on unmount.
  // getDimensions / applyBackground / loadImage are stable callbacks and safe to call
  // directly inside the async IIFE via closure.
  useEffect(() => {
    let alive = true;

    (async () => {
      const fabric = await import("fabric");
      if (!alive || !canvasElRef.current) return;

      fabricRef.current = fabric;

      const { width, height } = getDimensions();
      const canvas = new fabric.Canvas(canvasElRef.current, {
        width,
        height,
        selection: true,
        preserveObjectStacking: true,
      });

      canvasRef.current = canvas;
      fabricReadyRef.current = true;

      applyBackground();

      if (imageUrlRef.current) loadImage(imageUrlRef.current);
    })();

    return () => {
      alive = false;
      fabricReadyRef.current = false;
      canvasRef.current?.dispose();
      canvasRef.current = null;
      fabricRef.current = null;
      screenshotRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentional one-time init

  // ── React to new imageDataUrl prop ────────────────────────────────────────
  // fabricReadyRef guards against calling loadImage before canvas is ready.
  // loadImage is intentionally excluded: it's a stable callback and re-running
  // on its identity change would cause duplicate loads.
  useEffect(() => {
    if (!imageDataUrl || !fabricReadyRef.current) return;
    loadImage(imageDataUrl);
  }, [imageDataUrl]); // eslint-disable-line react-hooks/exhaustive-deps -- guarded by fabricReadyRef

  // ── React to layout changes (ratio / padding / canvas size) ───────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const fabric = fabricRef.current;
    if (!canvas || !fabric) return;

    const { width, height } = getDimensions();
    canvas.setWidth(width);
    canvas.setHeight(height);

    const obj = screenshotRef.current;
    if (obj) {
      let displayScale = 1;
      if (canvasMode === "manual") {
        displayScale = Math.min(width / canvasWidth, height / canvasHeight);
      }

      const displayPadding = padding * displayScale;
      const scale = Math.min(
        (width - displayPadding * 2) / (obj.width ?? 1),
        (height - displayPadding * 2) / (obj.height ?? 1),
      );
      obj.set({
        left: width / 2,
        top: height / 2,
        scaleX: scale,
        scaleY: scale,
      });
      obj.setCoords();
      applyStyle();
    }

    applyBackground();
  }, [
    aspectRatio,
    padding,
    canvasMode,
    canvasWidth,
    canvasHeight,
    getDimensions,
    applyStyle,
    applyBackground,
  ]);

  // ── Export ────────────────────────────────────────────────────────────────
  useEffect(() => {
    onExportReady(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const displayWidth = canvas.width;
      const displayHeight = canvas.height;
      const actualWidth = canvasMode === "manual" ? canvasWidth : displayWidth;
      const actualHeight =
        canvasMode === "manual" ? canvasHeight : displayHeight;
      const multiplier = Math.max(
        actualWidth / displayWidth,
        actualHeight / displayHeight,
      );

      const dataUrl = canvas.toDataURL({ format: "png", multiplier });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "snap-it.png";
      a.click();
    });
  }, [onExportReady, canvasMode, canvasWidth, canvasHeight]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden bg-[#0a0a0a] relative"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      {canvasVisible && (
        <div className="relative pt-12">
          <ReplaceImageButton onLoad={loadImage} />
          <div
            className="overflow-hidden shadow-2xl"
            style={{ borderRadius: `${canvasCornerRadius}px` }}
          >
            <canvas ref={canvasElRef} />
          </div>
        </div>
      )}

      {!canvasVisible && (
        <div className="text-white/40 text-sm">Canvas hidden</div>
      )}

      {/* Tool hint bar */}
      <ToolHint />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReplaceImageButton({ onLoad }: { onLoad: (dataUrl: string) => void }) {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (typeof dataUrl === "string") onLoad(dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-xs text-white/80 hover:text-white transition-colors backdrop-blur-sm"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
      Change Image
    </button>
  );
}

function ToolHint() {
  const { activeTool } = useEditorStore();
  if (activeTool === "select") return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
      {activeTool === "text" ? "Click to place text" : "Draw to redact an area"}{" "}
      · Press <kbd className="font-mono">Esc</kbd> to cancel
    </div>
  );
}

"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useAtomValue, useStore } from "jotai";
import {
  canvasVisibleAtom,
  canvasCornerRadiusAtom,
  canvasModeAtom,
  canvasWidthAtom,
  canvasHeightAtom,
  aspectRatioAtom,
  paddingAtom,
  uploadedImageWidthAtom,
  uploadedImageHeightAtom,
  activeToolAtom,
} from "@/store/atoms";
import { useCanvasDimensions, type CanvasRefs } from "@/hooks/useCanvasCore";
import { useCanvasStyle, useCanvasImage } from "@/hooks/useCanvasStyle";
import { useCanvasTools } from "@/hooks/useCanvasTools";
import { useImageAlignment } from "@/hooks/useImageAlignment";

// ---------------------------------------------------------------------------
// Public handle type — consumed by parent via useRef<EditorCanvasHandle>
// ---------------------------------------------------------------------------

export interface EditorCanvasHandle {
  exportImage: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
  centerHorizontal: () => void;
  centerVertical: () => void;
  centerBoth: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FabricImage = InstanceType<typeof import("fabric").FabricImage>;
type FabricCanvas = InstanceType<typeof import("fabric").Canvas>;

/**
 * Calculates the export multiplier so the exported PNG is at the original
 * image resolution rather than the (potentially downscaled) display size.
 * Always returns at least 1 — never scales down.
 */
function calculateExportMultiplier(
  canvas: FabricCanvas,
  img: FabricImage | null,
  uploadedImageWidth: number | null,
  uploadedImageHeight: number | null,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const displayWidth = canvas.width;
  const displayHeight = canvas.height;
  // Use original image dimensions for export quality; fall back to canvas dims
  const actualWidth = uploadedImageWidth || canvasWidth || displayWidth;
  const actualHeight = uploadedImageHeight || canvasHeight || displayHeight;

  if (img && img.scaleX && img.scaleY) {
    const imageScale = Math.min(img.scaleX, img.scaleY);
    const targetMultiplier = Math.min(
      actualWidth / (displayWidth * imageScale),
      actualHeight / (displayHeight * imageScale),
    );
    return Math.max(targetMultiplier, 1); // Never scale down
  }

  // Fallback: scale based on canvas dimensions only
  return (
    Math.min(actualWidth / displayWidth, actualHeight / displayHeight) || 1
  );
}

interface EditorCanvasProps {
  imageDataUrl: string | null;
}

const EditorCanvas = forwardRef<EditorCanvasHandle, EditorCanvasProps>(
  function EditorCanvas({ imageDataUrl }, ref) {
    // ── Refs ──────────────────────────────────────────────────────────────────
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<typeof import("fabric") | null>(null);
    const canvasRef = useRef<InstanceType<
      typeof import("fabric").Canvas
    > | null>(null);
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
    const canvasVisible = useAtomValue(canvasVisibleAtom);
    const canvasCornerRadius = useAtomValue(canvasCornerRadiusAtom);
    const canvasMode = useAtomValue(canvasModeAtom);
    const canvasWidth = useAtomValue(canvasWidthAtom);
    const canvasHeight = useAtomValue(canvasHeightAtom);
    const aspectRatio = useAtomValue(aspectRatioAtom);
    const padding = useAtomValue(paddingAtom);
    const store = useStore();

    // ── Composed hooks ─────────────────────────────────────────────────────────
    const { getDimensions } = useCanvasDimensions({ containerRef });
    const { applyBackground, applyStyle } = useCanvasStyle({ refs });
    const { loadImage } = useCanvasImage({ refs, applyBackground });
    const { centerHorizontal, centerVertical, centerBoth } = useImageAlignment({
      canvasRef,
      screenshotRef,
    });
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

    // ── Imperative handle (replaces callback-registration useEffects) ────────
    useImperativeHandle(
      ref,
      () => ({
        async exportImage() {
          const canvas = canvasRef.current;
          const img = screenshotRef.current;
          if (!canvas) return;

          const multiplier = calculateExportMultiplier(
            canvas,
            img,
            store.get(uploadedImageWidthAtom),
            store.get(uploadedImageHeightAtom),
            store.get(canvasWidthAtom),
            store.get(canvasHeightAtom),
          );

          try {
            // Render to an offscreen canvas, then convert to Blob.
            // This avoids huge base-64 data-URL strings that crash mobile browsers.
            const offscreen = canvas.toCanvasElement(multiplier);

            const blob = await new Promise<Blob | null>((resolve) =>
              offscreen.toBlob(resolve, "image/png"),
            );
            if (!blob) return;

            // Try native share on mobile (iOS/Android) — gives "Save Image" option
            if (
              typeof navigator.share === "function" &&
              navigator.canShare?.({
                files: [new File([blob], "snap-it.png", { type: "image/png" })],
              })
            ) {
              const file = new File([blob], "snap-it.png", {
                type: "image/png",
              });
              await navigator.share({ files: [file] });
              return;
            }

            // Desktop / browsers without Web Share: Object URL + anchor click
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "snap-it.png";
            document.body.appendChild(a);
            a.click();
            // Clean up
            requestAnimationFrame(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            });
          } catch {
            // Last-resort fallback: open the image in a new tab
            const dataUrl = canvas.toDataURL({ format: "png", multiplier });
            window.open(dataUrl, "_blank");
          }
        },

        async copyToClipboard() {
          const canvas = canvasRef.current;
          const img = screenshotRef.current;
          if (!canvas) return;

          const multiplier = calculateExportMultiplier(
            canvas,
            img,
            store.get(uploadedImageWidthAtom),
            store.get(uploadedImageHeightAtom),
            store.get(canvasWidthAtom),
            store.get(canvasHeightAtom),
          );

          try {
            // Render to an offscreen canvas, then convert directly to Blob
            const offscreen = canvas.toCanvasElement(multiplier);
            const blob = await new Promise<Blob | null>((resolve) =>
              offscreen.toBlob(resolve, "image/png"),
            );
            if (!blob) return;

            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
          } catch {
            // Silently fail — clipboard API may be unsupported or denied
          }
        },

        centerHorizontal,
        centerVertical,
        centerBoth,
      }),
      [store, centerHorizontal, centerVertical, centerBoth],
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative"
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
  },
);

export default EditorCanvas;

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
  const activeTool = useAtomValue(activeToolAtom);
  if (activeTool === "select") return null;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
      {activeTool === "text" ? "Click to place text" : "Draw to redact an area"}{" "}
      · Press <kbd className="font-mono">Esc</kbd> to cancel
    </div>
  );
}

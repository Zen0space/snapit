"use client";

import { useRef, useCallback } from "react";
import { useAtomValue } from "jotai";
import {
  canvasModeAtom,
  canvasWidthAtom,
  canvasHeightAtom,
  aspectRatioAtom,
} from "@/store/atoms";
import type { AspectRatioPreset } from "@/lib/presets";
import type { CanvasMode } from "@/shared/types";

type FabricModule = typeof import("fabric");
type FabricCanvas = InstanceType<FabricModule["Canvas"]>;
type FabricImage = InstanceType<FabricModule["FabricImage"]>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MAX_DISPLAY_WIDTH = 1100;
export const MAX_DISPLAY_HEIGHT = 800;
export const MAX_RATIO_HEIGHT = 800;
export const CANVAS_VIEWPORT_PADDING = 48;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a CSS linear-gradient string to a Fabric.js Gradient instance. */
export function makeFabricGradient(
  cssGradient: string,
  width: number,
  height: number,
  fabric: FabricModule,
) {
  const match = cssGradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
  if (!match) return null;

  const angle = parseInt(match[1], 10);
  const stops = match[2].split(",").map((s) => s.trim());

  const colorStops: Record<string, string> = {};
  stops.forEach((stop) => {
    const [color, pct] = stop.split(/\s+/);
    colorStops[String(parseFloat(pct) / 100)] = color;
  });

  const rad = ((angle - 90) * Math.PI) / 180;
  return new fabric.Gradient({
    type: "linear",
    coords: {
      x1: (Math.cos(rad + Math.PI) / 2 + 0.5) * width,
      y1: (Math.sin(rad + Math.PI) / 2 + 0.5) * height,
      x2: (Math.cos(rad) / 2 + 0.5) * width,
      y2: (Math.sin(rad) / 2 + 0.5) * height,
    },
    colorStops: Object.entries(colorStops).map(([offset, color]) => ({
      offset: parseFloat(offset),
      color,
    })),
  });
}

// ---------------------------------------------------------------------------
// Exported refs shape for composing hooks
// ---------------------------------------------------------------------------

export interface CanvasRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasElRef: React.RefObject<HTMLCanvasElement>;
  fabricRef: React.MutableRefObject<FabricModule | null>;
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  screenshotRef: React.MutableRefObject<FabricImage | null>;
  fabricReadyRef: React.MutableRefObject<boolean>;
}

// ---------------------------------------------------------------------------
// Hook: canvas dimension calculation
// ---------------------------------------------------------------------------

export function useCanvasDimensions(refs: Pick<CanvasRefs, "containerRef">) {
  const canvasMode = useAtomValue(canvasModeAtom);
  const canvasWidth = useAtomValue(canvasWidthAtom);
  const canvasHeight = useAtomValue(canvasHeightAtom);
  const aspectRatio = useAtomValue(aspectRatioAtom);

  const getDimensions = useCallback(
    (
      overrides?: Partial<{
        canvasMode: CanvasMode;
        canvasWidth: number;
        canvasHeight: number;
        aspectRatio: AspectRatioPreset;
      }>,
    ) => {
      const el = refs.containerRef.current;
      if (!el) return { width: 800, height: 600 };

      const mode = overrides?.canvasMode ?? canvasMode;
      const cw = overrides?.canvasWidth ?? canvasWidth;
      const ch = overrides?.canvasHeight ?? canvasHeight;
      const ratio = overrides?.aspectRatio ?? aspectRatio;

      const maxW = el.clientWidth - CANVAS_VIEWPORT_PADDING;
      const maxH = el.clientHeight - CANVAS_VIEWPORT_PADDING;

      if (mode === "manual") {
        const viewportScale = Math.min(maxW / cw, maxH / ch, 1);
        let displayWidth = Math.round(cw * viewportScale);
        let displayHeight = Math.round(ch * viewportScale);

        if (
          displayWidth > MAX_DISPLAY_WIDTH ||
          displayHeight > MAX_DISPLAY_HEIGHT
        ) {
          const scale = Math.min(
            MAX_DISPLAY_WIDTH / displayWidth,
            MAX_DISPLAY_HEIGHT / displayHeight,
          );
          displayWidth = Math.round(displayWidth * scale);
          displayHeight = Math.round(displayHeight * scale);
        }

        return { width: displayWidth, height: displayHeight };
      }

      if (!ratio.width || !ratio.height) {
        return {
          width: Math.min(maxW, MAX_DISPLAY_WIDTH),
          height: Math.min(maxH, MAX_DISPLAY_HEIGHT),
        };
      }

      const r = ratio.width / ratio.height;
      let w = Math.min(maxW, MAX_DISPLAY_WIDTH);
      let h = w / r;

      if (h > Math.min(maxH, MAX_RATIO_HEIGHT)) {
        h = Math.min(maxH, MAX_RATIO_HEIGHT);
        w = h * r;
      }

      return { width: Math.round(w), height: Math.round(h) };
    },
    [canvasMode, canvasWidth, canvasHeight, aspectRatio, refs.containerRef],
  );

  return { getDimensions };
}

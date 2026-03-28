import { atom } from "jotai";
import type { ActiveTool } from "@snap-it/types";
import type { BackgroundPreset, AspectRatioPreset } from "@/lib/presets";
import { DEFAULT_BACKGROUND, DEFAULT_ASPECT_RATIO } from "@/lib/presets";
import type { ShadowConfig, CanvasMode } from "@/shared/types";
import {
  DEFAULT_SHADOW,
  DEFAULT_CORNER_RADIUS,
  DEFAULT_CANVAS_CORNER_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_CUSTOM_BG_COLOR,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_MODE,
} from "@/shared/constants";

// ── Primitive atoms ──────────────────────────────────────────────────────────

export const hasImageAtom = atom(false);
export const backgroundAtom = atom<BackgroundPreset>(DEFAULT_BACKGROUND);
export const customBgColorAtom = atom(DEFAULT_CUSTOM_BG_COLOR);
export const shadowAtom = atom<ShadowConfig>(DEFAULT_SHADOW);
export const cornerRadiusAtom = atom(DEFAULT_CORNER_RADIUS);
export const canvasCornerRadiusAtom = atom(DEFAULT_CANVAS_CORNER_RADIUS);
export const paddingAtom = atom(DEFAULT_PADDING);
export const activeToolAtom = atom<ActiveTool>("select");
export const aspectRatioAtom = atom<AspectRatioPreset>(DEFAULT_ASPECT_RATIO);
export const canvasModeAtom = atom<CanvasMode>(DEFAULT_CANVAS_MODE);
export const canvasWidthAtom = atom(DEFAULT_CANVAS_WIDTH);
export const canvasHeightAtom = atom(DEFAULT_CANVAS_HEIGHT);
export const canvasVisibleAtom = atom(true);
export const uploadedImageWidthAtom = atom<number | null>(null);
export const uploadedImageHeightAtom = atom<number | null>(null);

// ── Action atoms (write-only, encapsulate side-effect logic) ────────────────

/**
 * Partial-merge update for shadow config.
 * Usage: `const updateShadow = useSetAtom(updateShadowAtom)`
 * Then:  `updateShadow({ blur: 40 })`
 */
export const updateShadowAtom = atom(
  null,
  (get, set, partial: Partial<ShadowConfig>) => {
    set(shadowAtom, { ...get(shadowAtom), ...partial });
  },
);

/**
 * Set padding and auto-adjust canvas dimensions when an image is present.
 */
export const setPaddingAtom = atom(null, (get, set, value: number) => {
  set(paddingAtom, value);
  const imgW = get(uploadedImageWidthAtom);
  const imgH = get(uploadedImageHeightAtom);
  if (imgW && imgH) {
    set(canvasWidthAtom, imgW + value * 2);
    set(canvasHeightAtom, imgH + value * 2);
  }
});

/**
 * Set aspect ratio and derive canvas mode.
 * "Free" ratio → manual mode, everything else → ratio mode.
 */
export const setAspectRatioAtom = atom(
  null,
  (_get, set, ratio: AspectRatioPreset) => {
    set(aspectRatioAtom, ratio);
    set(canvasModeAtom, ratio.id === "free" ? "manual" : "ratio");
  },
);

/**
 * Set uploaded image dimensions and auto-configure canvas.
 * Sets canvas to image size + 20px (10px padding per side),
 * switches to manual mode, and resets padding to 10.
 */
export const setUploadedImageDimensionsAtom = atom(
  null,
  (_get, set, { width, height }: { width: number; height: number }) => {
    set(uploadedImageWidthAtom, width);
    set(uploadedImageHeightAtom, height);
    set(canvasWidthAtom, width + 20);
    set(canvasHeightAtom, height + 20);
    set(canvasModeAtom, "manual");
    set(paddingAtom, DEFAULT_PADDING);
  },
);

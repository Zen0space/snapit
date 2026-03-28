/** Shadow configuration for the screenshot image. */
export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

/** Canvas sizing mode — "ratio" uses an aspect-ratio preset, "manual" uses explicit pixel dimensions. */
export type CanvasMode = "ratio" | "manual";

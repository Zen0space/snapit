import type { ShadowConfig, CanvasMode } from "./types";

// ── localStorage keys ────────────────────────────────────────────────────────
export const LS_COOKIE_CONSENT = "snap_cookie_consent";
export const LS_VISITOR_ID = "snap_visitor_id";

// ── Shadow defaults ──────────────────────────────────────────────────────────
export const DEFAULT_SHADOW: ShadowConfig = {
  enabled: true,
  color: "rgba(0,0,0,0.4)",
  blur: 30,
  offsetX: 0,
  offsetY: 10,
};

// ── Appearance defaults ──────────────────────────────────────────────────────
export const DEFAULT_CORNER_RADIUS = 12;
export const DEFAULT_CANVAS_CORNER_RADIUS = 12;
export const DEFAULT_PADDING = 10;
export const DEFAULT_CUSTOM_BG_COLOR = "#667eea";

// ── Canvas sizing defaults ───────────────────────────────────────────────────
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;
export const DEFAULT_CANVAS_MODE: CanvasMode = "ratio";

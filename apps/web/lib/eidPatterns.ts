/**
 * eidPatterns.ts
 *
 * Pre-renders each Eid background theme onto an offscreen HTMLCanvasElement
 * using the Canvas 2D API. The resulting data-URL is then loaded as a
 * Fabric.js backgroundImage so the full pattern is preserved in exports.
 *
 * Design language:
 *   - Eid Mubarak : rich emerald gradient, elegant crescent with warm glow,
 *                   subtle Islamic geometric arcs, refined star field, vignette
 *   - Eid Gold    : luxurious gold gradient, faint arabesque lattice,
 *                   warm crescent, scattered accent stars
 *   - Eid Night   : deep midnight green, atmospheric crescent with halo,
 *                   dense luminous star field, ambient gold light
 */

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const TAU = Math.PI * 2;

/** Draw a four-point star with optional soft glow. */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  color: string,
  alpha = 1,
  withGlow = false,
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Soft glow halo
  if (withGlow) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR * 3);
    g.addColorStop(0, color.replace(/[\d.]+\)$/, "0.25)"));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR * 3, 0, TAU);
    ctx.fill();
  }

  // Star shape
  ctx.fillStyle = color;
  const innerR = outerR * 0.32;
  const points = 4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw a dot star with optional glow. */
function drawDot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  // Soft halo
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
  g.addColorStop(0, color);
  g.addColorStop(0.5, color.replace(/[\d.]+\)$/, "0.15)"));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.5, 0, TAU);
  ctx.fill();
  // Bright core
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/** Draw subtle interlocking-arc geometric pattern (Islamic-inspired). */
function drawGeometricArcs(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  cellSize: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;

  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  const r = cellSize * 0.5;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const cx = col * cellSize;
      const cy = row * cellSize;

      // Four quarter-arcs from each corner of the cell
      // Creates an interlocking petal / ogee pattern
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + cellSize, cy, r, Math.PI * 0.5, Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + cellSize, cy + cellSize, r, Math.PI, Math.PI * 1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy + cellSize, r, Math.PI * 1.5, TAU);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** Draw a subtle edge vignette for depth. */
function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength = 0.35,
) {
  ctx.save();
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.max(width, height) * 0.7;
  const g = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Star field type: [xFrac, yFrac, sizeFrac, alpha, isFeatured]
// ---------------------------------------------------------------------------

type StarEntry = [number, number, number, number, boolean?];

function renderStarField(
  ctx: CanvasRenderingContext2D,
  stars: StarEntry[],
  width: number,
  height: number,
  color: string,
) {
  const minDim = Math.min(width, height);
  for (const [fx, fy, fr, alpha, featured] of stars) {
    const sx = fx * width;
    const sy = fy * height;
    const sr = fr * minDim;
    if (featured) {
      drawStar(ctx, sx, sy, sr, color, alpha, true);
    } else if (sr > minDim * 0.008) {
      drawStar(ctx, sx, sy, sr, color, alpha, false);
    } else {
      drawDot(ctx, sx, sy, sr, color, alpha);
    }
  }
}

// ---------------------------------------------------------------------------
// Pattern: Eid Mubarak (emerald green)
// ---------------------------------------------------------------------------

export function drawEidMubarak(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // --- Rich multi-stop gradient ---
  const bg = ctx.createLinearGradient(0, 0, width * 0.4, height);
  bg.addColorStop(0, "#143d22");
  bg.addColorStop(0.3, "#1e5533");
  bg.addColorStop(0.6, "#27694a");
  bg.addColorStop(1, "#163826");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // --- Subtle warm ambient light (upper-right, near moon) ---
  ctx.save();
  const ambient = ctx.createRadialGradient(
    width * 0.78,
    height * 0.12,
    0,
    width * 0.78,
    height * 0.12,
    Math.min(width, height) * 0.55,
  );
  ambient.addColorStop(0, "rgba(212,175,55,0.06)");
  ambient.addColorStop(0.5, "rgba(212,175,55,0.02)");
  ambient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Geometric arc pattern (subtle) ---
  const cellSize = Math.round(Math.min(width, height) * 0.1);
  drawGeometricArcs(ctx, width, height, "rgba(212,175,55,0.04)", cellSize);

  // --- Star field ---
  const stars: StarEntry[] = [
    // Featured stars (brighter, with glow)
    [0.12, 0.07, 0.014, 0.9, true],
    [0.38, 0.04, 0.012, 0.85, true],
    [0.22, 0.65, 0.012, 0.8, true],
    // Regular 4-point stars
    [0.55, 0.09, 0.01, 0.6],
    [0.15, 0.3, 0.009, 0.55],
    [0.72, 0.58, 0.009, 0.5],
    [0.35, 0.84, 0.01, 0.6],
    [0.08, 0.52, 0.009, 0.5],
    // Dots
    [0.28, 0.18, 0.005, 0.45],
    [0.48, 0.35, 0.004, 0.35],
    [0.62, 0.28, 0.005, 0.4],
    [0.05, 0.78, 0.004, 0.35],
    [0.42, 0.6, 0.005, 0.38],
    [0.58, 0.75, 0.004, 0.3],
    [0.18, 0.88, 0.005, 0.4],
    [0.68, 0.42, 0.004, 0.3],
    [0.5, 0.92, 0.004, 0.35],
  ];
  renderStarField(ctx, stars, width, height, "rgba(255,253,220,1)");

  // --- Vignette ---
  drawVignette(ctx, width, height, 0.3);
}

// ---------------------------------------------------------------------------
// Pattern: Eid Night
// ---------------------------------------------------------------------------

export function drawEidNight(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // --- Deep midnight gradient ---
  const bg = ctx.createLinearGradient(0, 0, width * 0.3, height);
  bg.addColorStop(0, "#071a14");
  bg.addColorStop(0.4, "#0e2e22");
  bg.addColorStop(0.7, "#163b2c");
  bg.addColorStop(1, "#0a221a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // --- Ambient gold glows ---
  ctx.save();
  const g1 = ctx.createRadialGradient(
    width * 0.2,
    height * 0.45,
    0,
    width * 0.2,
    height * 0.45,
    Math.min(width, height) * 0.5,
  );
  g1.addColorStop(0, "rgba(212,175,55,0.06)");
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, width, height);

  const g2 = ctx.createRadialGradient(
    width * 0.8,
    height * 0.75,
    0,
    width * 0.8,
    height * 0.75,
    Math.min(width, height) * 0.45,
  );
  g2.addColorStop(0, "rgba(212,175,55,0.04)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // --- Geometric arcs (very subtle on dark) ---
  const cellSize = Math.round(Math.min(width, height) * 0.11);
  drawGeometricArcs(ctx, width, height, "rgba(212,175,55,0.025)", cellSize);

  // --- Dense star field (night sky feel) ---
  const stars: StarEntry[] = [
    // Featured (glow halos)
    [0.08, 0.06, 0.014, 0.92, true],
    [0.36, 0.04, 0.012, 0.88, true],
    [0.2, 0.62, 0.013, 0.85, true],
    [0.55, 0.85, 0.011, 0.8, true],
    // Regular stars
    [0.52, 0.08, 0.009, 0.65],
    [0.14, 0.28, 0.01, 0.6],
    [0.3, 0.4, 0.008, 0.5],
    [0.06, 0.54, 0.009, 0.55],
    [0.7, 0.55, 0.009, 0.5],
    [0.45, 0.5, 0.008, 0.45],
    [0.33, 0.8, 0.009, 0.55],
    [0.88, 0.2, 0.008, 0.45],
    // Dots
    [0.25, 0.15, 0.005, 0.5],
    [0.62, 0.22, 0.004, 0.4],
    [0.44, 0.28, 0.005, 0.42],
    [0.18, 0.44, 0.004, 0.35],
    [0.58, 0.38, 0.005, 0.38],
    [0.04, 0.76, 0.004, 0.35],
    [0.42, 0.68, 0.005, 0.4],
    [0.76, 0.42, 0.004, 0.3],
    [0.66, 0.72, 0.004, 0.35],
    [0.5, 0.92, 0.005, 0.38],
    [0.82, 0.62, 0.004, 0.3],
    [0.15, 0.9, 0.004, 0.35],
    [0.92, 0.78, 0.005, 0.32],
    [0.38, 0.56, 0.003, 0.28],
  ];
  renderStarField(ctx, stars, width, height, "rgba(255,253,220,1)");

  // --- Vignette (strong for dramatic night feel) ---
  drawVignette(ctx, width, height, 0.4);
}

// ---------------------------------------------------------------------------
// Dispatch helper
// ---------------------------------------------------------------------------

export type EidPatternId = "eid-mubarak" | "eid-night";

export function drawEidPattern(
  patternId: EidPatternId,
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
) {
  switch (patternId) {
    case "eid-mubarak":
      drawEidMubarak(canvas, width, height);
      break;
    case "eid-night":
      drawEidNight(canvas, width, height);
      break;
  }
}

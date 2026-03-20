// Background gradient and solid color presets

export interface BackgroundPreset {
  id: string;
  label: string;
  type: "gradient" | "solid" | "mesh";
  value: string; // CSS gradient or hex color
  fabricValue: string; // For Fabric.js canvas — same as value for now
  /** If set, the canvas background is drawn via the Canvas 2D pattern renderer (see eidPatterns.ts) */
  patternId?: "eid-mubarak" | "eid-gold" | "eid-night";
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "violet-blue",
    label: "Violet Blue",
    type: "gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fabricValue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "sunset",
    label: "Sunset",
    type: "gradient",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    fabricValue: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "ocean",
    label: "Ocean",
    type: "gradient",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    fabricValue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "forest",
    label: "Forest",
    type: "gradient",
    value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    fabricValue: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: "peach",
    label: "Peach",
    type: "gradient",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    fabricValue: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "midnight",
    label: "Midnight",
    type: "gradient",
    value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fabricValue:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },
  {
    id: "aurora",
    label: "Aurora",
    type: "gradient",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    fabricValue: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: "fire",
    label: "Fire",
    type: "gradient",
    value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    fabricValue: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
  },
  {
    id: "dark",
    label: "Dark",
    type: "solid",
    value: "#111111",
    fabricValue: "#111111",
  },
  {
    id: "white",
    label: "White",
    type: "solid",
    value: "#ffffff",
    fabricValue: "#ffffff",
  },
  {
    id: "slate",
    label: "Slate",
    type: "solid",
    value: "#1e293b",
    fabricValue: "#1e293b",
  },
  {
    id: "transparent",
    label: "None",
    type: "solid",
    value: "transparent",
    fabricValue: "transparent",
  },
  {
    id: "eid-mubarak",
    label: "Eid Mubarak",
    type: "gradient",
    // crescent moon (disk + cutout) + scattered star dots + base green gradient
    value:
      "radial-gradient(circle at 80% 15%, #233d2e 0%, #233d2e 5.5%, transparent 6.5%), radial-gradient(circle at 76% 19%, rgba(255,253,200,.95) 0%, rgba(255,250,180,.4) 6.5%, transparent 10%), radial-gradient(circle at 76% 19%, rgba(255,253,200,.15) 0%, transparent 16%), radial-gradient(2px 2px at 10% 8%, rgba(255,255,255,.85), transparent), radial-gradient(1px 1px at 22% 15%, rgba(255,255,255,.65), transparent), radial-gradient(2px 2px at 38% 5%, rgba(255,255,255,.8), transparent), radial-gradient(1px 1px at 55% 10%, rgba(255,255,255,.6), transparent), radial-gradient(2px 2px at 15% 32%, rgba(255,255,255,.75), transparent), radial-gradient(1px 1px at 32% 44%, rgba(255,255,255,.55), transparent), radial-gradient(1px 1px at 8% 58%, rgba(255,255,255,.7), transparent), radial-gradient(2px 2px at 22% 68%, rgba(255,255,255,.8), transparent), radial-gradient(1px 1px at 48% 55%, rgba(255,255,255,.55), transparent), radial-gradient(1px 1px at 5% 80%, rgba(255,255,255,.65), transparent), radial-gradient(2px 2px at 35% 85%, rgba(255,255,255,.75), transparent), radial-gradient(1px 1px at 58% 78%, rgba(255,255,255,.55), transparent), radial-gradient(2px 2px at 48% 92%, rgba(255,255,255,.7), transparent), linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #1f3a2a 100%), repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212,175,55,0.03) 35px, rgba(212,175,55,0.03) 70px)",
    fabricValue: "#1a472a",
    patternId: "eid-mubarak",
  },
  {
    id: "eid-night",
    label: "Eid Night",
    type: "gradient",
    value:
      "linear-gradient(135deg, #0a1f1a 0%, #1a3a2a 50%, #0f2a1f 100%), radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.05) 0%, transparent 50%)",
    fabricValue: "#0a1f1a",
    patternId: "eid-night",
  },
];

// Aspect ratio presets
export interface AspectRatioPreset {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: "free",
    label: "Free",
    description: "No constraint",
    width: 0,
    height: 0,
  },
  {
    id: "1:1",
    label: "1 : 1",
    description: "Square / Instagram",
    width: 1,
    height: 1,
  },
  {
    id: "16:9",
    label: "16 : 9",
    description: "Widescreen / YouTube",
    width: 16,
    height: 9,
  },
  { id: "4:3", label: "4 : 3", description: "Classic", width: 4, height: 3 },
  {
    id: "3:2",
    label: "3 : 2",
    description: "Threads card",
    width: 3,
    height: 2,
  },
  {
    id: "2:1",
    label: "2 : 1",
    description: "Twitter card",
    width: 2,
    height: 1,
  },
  {
    id: "9:16",
    label: "9 : 16",
    description: "Stories / TikTok",
    width: 9,
    height: 16,
  },
];

export const DEFAULT_BACKGROUND = BACKGROUND_PRESETS[0];
export const DEFAULT_ASPECT_RATIO = ASPECT_RATIO_PRESETS[0];

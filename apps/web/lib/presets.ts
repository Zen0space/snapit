// Background gradient and solid color presets

export interface BackgroundPreset {
  id: string;
  label: string;
  type: "gradient" | "solid" | "mesh";
  value: string; // CSS gradient or hex color
  fabricValue: string; // For Fabric.js canvas — same as value for now
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

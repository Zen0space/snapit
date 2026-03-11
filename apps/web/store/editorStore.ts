import { create } from 'zustand'
import type { ActiveTool } from '@snap-it/types'
import { DEFAULT_BACKGROUND, DEFAULT_ASPECT_RATIO, type BackgroundPreset, type AspectRatioPreset } from '@/lib/presets'

export interface ShadowConfig {
  enabled: boolean
  color: string
  blur: number
  offsetX: number
  offsetY: number
}

export interface EditorState {
  // Image
  hasImage: boolean
  setHasImage: (v: boolean) => void

  // Background
  background: BackgroundPreset
  setBackground: (bg: BackgroundPreset) => void
  customBgColor: string
  setCustomBgColor: (color: string) => void

  // Shadow
  shadow: ShadowConfig
  setShadow: (shadow: Partial<ShadowConfig>) => void

  // Corner radius
  cornerRadius: number
  setCornerRadius: (v: number) => void

  // Padding (around screenshot inside canvas)
  padding: number
  setPadding: (v: number) => void

  // Active tool
  activeTool: ActiveTool
  setActiveTool: (tool: ActiveTool) => void

  // Aspect ratio
  aspectRatio: AspectRatioPreset
  setAspectRatio: (ratio: AspectRatioPreset) => void

  // Canvas sizing mode
  canvasMode: 'ratio' | 'manual'
  setCanvasMode: (mode: 'ratio' | 'manual') => void

  // Manual canvas dimensions (pixels)
  canvasWidth: number
  canvasHeight: number
  setCanvasWidth: (w: number) => void
  setCanvasHeight: (h: number) => void

  // Canvas visibility
  canvasVisible: boolean
  setCanvasVisible: (v: boolean) => void

  // Uploaded image dimensions (for auto-sizing)
  uploadedImageWidth: number | null
  uploadedImageHeight: number | null
  setUploadedImageDimensions: (width: number, height: number) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  // Image
  hasImage: false,
  setHasImage: (v) => set({ hasImage: v }),

  // Background
  background: DEFAULT_BACKGROUND,
  setBackground: (bg) => set({ background: bg }),
  customBgColor: '#667eea',
  setCustomBgColor: (color) => set({ customBgColor: color }),

  // Shadow
  shadow: {
    enabled: true,
    color: 'rgba(0,0,0,0.4)',
    blur: 30,
    offsetX: 0,
    offsetY: 10,
  },
  setShadow: (partial) =>
    set((state) => ({ shadow: { ...state.shadow, ...partial } })),

  // Corner radius
  cornerRadius: 12,
  setCornerRadius: (v) => set({ cornerRadius: v }),

  // Padding
  padding: 10,
  setPadding: (v) =>
    set((state) => {
      const newState: Partial<EditorState> = { padding: v }
      // Auto-adjust canvas size based on image dimensions + padding
      if (state.uploadedImageWidth && state.uploadedImageHeight) {
        newState.canvasWidth = state.uploadedImageWidth + v * 2
        newState.canvasHeight = state.uploadedImageHeight + v * 2
      }
      return newState
    }),

  // Active tool
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Aspect ratio
  aspectRatio: DEFAULT_ASPECT_RATIO,
  setAspectRatio: (ratio) =>
    set({
      aspectRatio: ratio,
      // Switch to manual mode if "Free" ratio is selected, otherwise use ratio mode
      canvasMode: ratio.id === 'free' ? 'manual' : 'ratio',
    }),

  // Canvas sizing mode
  canvasMode: 'ratio',
  setCanvasMode: (mode) => set({ canvasMode: mode }),

  // Manual canvas dimensions
  canvasWidth: 800,
  canvasHeight: 600,
  setCanvasWidth: (w) => set({ canvasWidth: w }),
  setCanvasHeight: (h) => set({ canvasHeight: h }),

  // Canvas visibility
  canvasVisible: true,
  setCanvasVisible: (v) => set({ canvasVisible: v }),

  // Uploaded image dimensions
  uploadedImageWidth: null,
  uploadedImageHeight: null,
  setUploadedImageDimensions: (width, height) =>
    set({
      uploadedImageWidth: width,
      uploadedImageHeight: height,
      // Auto-set canvas dimensions to image size + 20px (10px padding on each side)
      canvasWidth: width + 20,
      canvasHeight: height + 20,
      // Switch to manual mode and set padding to 10px
      canvasMode: 'manual',
      padding: 10,
    }),
}))

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
  padding: 60,
  setPadding: (v) => set({ padding: v }),

  // Active tool
  activeTool: 'select',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Aspect ratio
  aspectRatio: DEFAULT_ASPECT_RATIO,
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
}))

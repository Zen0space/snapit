'use client'

import { useEditorStore } from '@/store/editorStore'

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-white/5">
      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 w-16 flex-shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400"
      />
      <span className="text-xs font-mono text-white/40 w-16 text-right">
        {value}{unit}
      </span>
    </div>
  )
}

export default function CanvasSizePanel() {
  const {
    canvasMode,
    setCanvasMode,
    canvasVisible,
    setCanvasVisible,
    padding,
    setPadding
  } = useEditorStore()

  return (
    <PanelSection title="Canvas Size">
      {/* Canvas Visibility Toggle */}
      <div className="mb-3">
        <button
          onClick={() => setCanvasVisible(!canvasVisible)}
          className={`w-full px-3 py-2 rounded text-xs font-medium transition-colors ${
            canvasVisible
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
          }`}
        >
          {canvasVisible ? '👁️ Canvas Visible' : '👁️‍🗨️ Canvas Hidden'}
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setCanvasMode('ratio')}
          className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            canvasMode === 'ratio'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          Ratio
        </button>
        <button
          onClick={() => setCanvasMode('manual')}
          className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            canvasMode === 'manual'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          Manual
        </button>
      </div>

      {/* Padding Slider (shown when manual mode) */}
      {canvasMode === 'manual' && (
        <div className="space-y-2.5">
          <Slider
            label="Padding"
            value={padding}
            min={0}
            max={100}
            step={1}
            onChange={setPadding}
            unit="px"
          />
        </div>
      )}
    </PanelSection>
  )
}

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useEditorStore } from '@/store/editorStore'

interface EditorCanvasProps {
  imageDataUrl: string | null
  onExportReady: (exportFn: () => void) => void
}

type FabricModule = typeof import('fabric')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert a CSS linear-gradient string to a Fabric.js Gradient instance. */
function makeFabricGradient(
  cssGradient: string,
  width: number,
  height: number,
  fabric: FabricModule
) {
  const match = cssGradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/)
  if (!match) return null

  const angle = parseInt(match[1], 10)
  const stops = match[2].split(',').map((s) => s.trim())

  const colorStops: Record<string, string> = {}
  stops.forEach((stop) => {
    const [color, pct] = stop.split(/\s+/)
    colorStops[String(parseFloat(pct) / 100)] = color
  })

  const rad = ((angle - 90) * Math.PI) / 180
  return new fabric.Gradient({
    type: 'linear',
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
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EditorCanvas({ imageDataUrl, onExportReady }: EditorCanvasProps) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef   = useRef<HTMLDivElement>(null)
  const canvasElRef    = useRef<HTMLCanvasElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricRef      = useRef<FabricModule | null>(null)   // the imported fabric module
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef      = useRef<any>(null)                   // fabric.Canvas instance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const screenshotRef  = useRef<any>(null)                   // the loaded screenshot FabricImage
  const fabricReadyRef = useRef(false)

  // Mirror the prop into a ref so the async init can read the latest value
  const imageUrlRef    = useRef<string | null>(imageDataUrl)
  imageUrlRef.current  = imageDataUrl

  // ── Store ─────────────────────────────────────────────────────────────────
  const {
    background,
    shadow,
    cornerRadius,
    padding,
    activeTool,
    aspectRatio,
    canvasMode,
    canvasWidth,
    canvasHeight,
    canvasVisible,
    setUploadedImageDimensions
  } = useEditorStore()

  // ── Canvas dimensions ─────────────────────────────────────────────────────
  const getDimensions = useCallback(() => {
    const el = containerRef.current
    if (!el) return { width: 800, height: 600 }

    const maxW = el.clientWidth  - 48
    const maxH = el.clientHeight - 48

    // Manual mode: use exact dimensions from store
    if (canvasMode === 'manual') {
      // Clamp to container size
      return {
        width: Math.min(canvasWidth, maxW),
        height: Math.min(canvasHeight, maxH),
      }
    }

    // Ratio mode: calculate from aspect ratio
    if (!aspectRatio.width || !aspectRatio.height) {
      return { width: Math.min(maxW, 900), height: Math.min(maxH, 650) }
    }

    const ratio = aspectRatio.width / aspectRatio.height
    let w = Math.min(maxW, 900)
    let h = w / ratio
    if (h > maxH) { h = maxH; w = h * ratio }

    return { width: Math.round(w), height: Math.round(h) }
  }, [aspectRatio, canvasMode, canvasWidth, canvasHeight])

  // ── Background ────────────────────────────────────────────────────────────
  const applyBackground = useCallback(() => {
    const canvas = canvasRef.current
    const fabric = fabricRef.current
    if (!canvas || !fabric) return

    const { width, height } = canvas

    if (background.value === 'transparent') {
      canvas.backgroundColor = 'transparent'
    } else if (background.type === 'gradient') {
      const grad = makeFabricGradient(background.value, width, height, fabric)
      canvas.backgroundColor = grad ?? '#1a1a2e'
    } else {
      canvas.backgroundColor = background.value
    }
    canvas.renderAll()
  }, [background])

  // ── Shadow + corner radius ─────────────────────────────────────────────────
  const applyStyle = useCallback(() => {
    const obj    = screenshotRef.current
    const fabric = fabricRef.current
    if (!obj || !fabric) return

    // Use .set() method - automatically handles cache invalidation in Fabric.js v6
    obj.set({
      clipPath: new fabric.Rect({
        width: obj.width,
        height: obj.height,
        rx: cornerRadius,
        ry: cornerRadius,
        originX: 'center',
        originY: 'center',
      }),
      shadow: shadow.enabled
        ? new fabric.Shadow({
            color:   shadow.color,
            blur:    shadow.blur,
            offsetX: shadow.offsetX,
            offsetY: shadow.offsetY,
          })
        : null,
    })

    // Update geometry (needed for bounding box calculations)
    obj.setCoords()

    // Render (requestRenderAll uses RAF for better performance)
    canvasRef.current?.requestRenderAll()
  }, [shadow, cornerRadius])

  // ── Load image ────────────────────────────────────────────────────────────
  const loadImage = useCallback(
    (dataUrl: string) => {
      const canvas = canvasRef.current
      const fabric = fabricRef.current
      if (!canvas || !fabric) return

      const { shadow: shadowCfg, cornerRadius: cr } =
        useEditorStore.getState()

      fabric.FabricImage.fromURL(dataUrl).then((img: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        // Auto-detect image dimensions and update canvas size
        if (img.width && img.height) {
          setUploadedImageDimensions(img.width, img.height)
        }

        const { width: cw, height: ch } = canvas
        // Keep image at 1:1 scale (original size, no resizing)
        const scale = 1

        img.set({ left: cw / 2, top: ch / 2, originX: 'center', originY: 'center', scaleX: scale, scaleY: scale })

        if (screenshotRef.current) canvas.remove(screenshotRef.current)
        screenshotRef.current = img

        canvas.add(img)
        canvas.sendObjectToBack(img)

        // Apply clip + shadow immediately after load
        img.clipPath = new fabric.Rect({
          width: img.width, height: img.height,
          rx: cr, ry: cr,
          originX: 'center', originY: 'center',
        })
        if (shadowCfg.enabled) {
          img.shadow = new fabric.Shadow({
            color: shadowCfg.color, blur: shadowCfg.blur,
            offsetX: shadowCfg.offsetX, offsetY: shadowCfg.offsetY,
          })
        }

        applyBackground()
        canvas.renderAll()
      })
    },
    [applyBackground]
  )

  // ── Init fabric (runs once on mount) ──────────────────────────────────────
  useEffect(() => {
    let alive = true

    ;(async () => {
      const fabric = await import('fabric')
      if (!alive || !canvasElRef.current) return

      fabricRef.current = fabric

      const { width, height } = getDimensions()
      const canvas = new fabric.Canvas(canvasElRef.current, {
        width,
        height,
        selection: true,
        preserveObjectStacking: true,
      })

      canvasRef.current   = canvas
      fabricReadyRef.current = true

      applyBackground()

      // If imageDataUrl arrived before fabric was ready, load it now
      if (imageUrlRef.current) loadImage(imageUrlRef.current)
    })()

    return () => {
      alive = false
      fabricReadyRef.current = false
      canvasRef.current?.dispose()
      canvasRef.current  = null
      fabricRef.current  = null
      screenshotRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── React to new imageDataUrl prop ────────────────────────────────────────
  useEffect(() => {
    if (!imageDataUrl || !fabricReadyRef.current) return
    loadImage(imageDataUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUrl])

  // ── React to background changes ───────────────────────────────────────────
  useEffect(() => { applyBackground() }, [applyBackground])

  // ── React to shadow / corner radius changes ───────────────────────────────
  useEffect(() => { applyStyle() }, [applyStyle])

  // ── React to aspect ratio / padding changes ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const fabric = fabricRef.current
    if (!canvas || !fabric) return

    const { width, height } = getDimensions()
    canvas.setWidth(width)
    canvas.setHeight(height)

    const obj = screenshotRef.current
    if (obj) {
      // Keep image at 1:1 scale (original size, no resizing)
      const scale = 1
      obj.set({ left: width / 2, top: height / 2, scaleX: scale, scaleY: scale })
      obj.setCoords()
      applyStyle()
    }

    applyBackground()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio, padding, canvasMode, canvasWidth, canvasHeight])

  // ── Active tool ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const fabric = fabricRef.current
    if (!canvas || !fabric) return

    canvas.isDrawingMode = false
    canvas.selection     = activeTool === 'select'
    canvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair'

    if (activeTool === 'text') {
      const onMouseDown = (opt: { e: MouseEvent }) => {
        const pointer = canvas.getPointer(opt.e)
        const text = new fabric.IText('Click to type...', {
          left: pointer.x,
          top:  pointer.y,
          fontSize:   18,
          fill:       '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          shadow:     new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 6 }),
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        canvas.renderAll()
        useEditorStore.getState().setActiveTool('select')
      }
      canvas.on('mouse:down', onMouseDown)
      return () => canvas.off('mouse:down', onMouseDown)
    }

    if (activeTool === 'blur') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rect: any = null
      let startX = 0
      let startY = 0

      const onMouseDown = (opt: { e: MouseEvent }) => {
        const pointer = canvas.getPointer(opt.e)
        startX = pointer.x
        startY = pointer.y
        rect = new fabric.Rect({
          left: startX, top: startY, width: 0, height: 0,
          fill: 'rgba(0,0,0,0.01)',
          stroke: 'rgba(255,255,255,0.4)',
          strokeWidth: 1,
          strokeDashArray: [4, 4],
        })
        canvas.add(rect)
      }

      const onMouseMove = (opt: { e: MouseEvent }) => {
        if (!rect) return
        const pointer = canvas.getPointer(opt.e)
        rect.set({
          width:  Math.abs(pointer.x - startX),
          height: Math.abs(pointer.y - startY),
          left:   Math.min(pointer.x, startX),
          top:    Math.min(pointer.y, startY),
        })
        canvas.renderAll()
      }

      const onMouseUp = () => {
        if (!rect) return

        // Build a checkerboard-pattern redact overlay
        const patternEl = document.createElement('canvas')
        patternEl.width  = 8
        patternEl.height = 8
        const ctx = patternEl.getContext('2d')!
        ctx.fillStyle = 'rgba(0,0,0,0.55)';  ctx.fillRect(0, 0, 4, 4); ctx.fillRect(4, 4, 4, 4)
        ctx.fillStyle = 'rgba(0,0,0,0.35)';  ctx.fillRect(4, 0, 4, 4); ctx.fillRect(0, 4, 4, 4)

        const redact = new fabric.Rect({
          left: rect.left, top: rect.top,
          width: rect.width, height: rect.height,
          fill: new fabric.Pattern({ source: patternEl, repeat: 'repeat' }),
          rx: 3, ry: 3,
          selectable: true,
        })

        canvas.remove(rect)
        canvas.add(redact)
        canvas.renderAll()
        rect = null
        useEditorStore.getState().setActiveTool('select')
      }

      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up',   onMouseUp)

      return () => {
        canvas.off('mouse:down', onMouseDown)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:up',   onMouseUp)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool])

  // ── Export ────────────────────────────────────────────────────────────────
  useEffect(() => {
    onExportReady(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 })
      const a = document.createElement('a')
      a.href     = dataUrl
      a.download = 'snap-it.png'
      a.click()
    })
  }, [onExportReady])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden bg-[#0a0a0a] relative"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize:  '24px 24px',
      }}
    >
      {canvasVisible && (
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <canvas ref={canvasElRef} />
        </div>
      )}

      {!canvasVisible && (
        <div className="text-white/40 text-sm">Canvas hidden</div>
      )}

      {activeTool !== 'select' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
          {activeTool === 'text' ? 'Click to place text' : 'Draw to redact an area'} · Press{' '}
          <kbd className="font-mono">Esc</kbd> to cancel
        </div>
      )}
    </div>
  )
}

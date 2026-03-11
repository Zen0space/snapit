'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useEditorStore } from '@/store/editorStore'

// Fabric is loaded dynamically to avoid SSR issues
let fabricModule: typeof import('fabric') | null = null

interface EditorCanvasProps {
  imageDataUrl: string | null
  onExportReady: (exportFn: () => void) => void
}

// Parse a CSS linear-gradient string into a fabric.Gradient
function parseCSSGradientToFabric(
  cssGradient: string,
  width: number,
  height: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fabric: any
) {
  // Extract angle and color stops from "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  const match = cssGradient.match(/linear-gradient\((\d+)deg,\s*(.+)\)/)
  if (!match) return null

  const angle = parseInt(match[1])
  const stopsStr = match[2]

  const colorStops: Record<string, string> = {}
  const stops = stopsStr.split(',').map((s) => s.trim())
  stops.forEach((stop) => {
    const parts = stop.split(/\s+/)
    const color = parts[0]
    const pos = parseFloat(parts[1]) / 100
    colorStops[pos] = color
  })

  // Convert angle to x1/y1/x2/y2
  const rad = ((angle - 90) * Math.PI) / 180
  const x1 = (Math.cos(rad + Math.PI) / 2 + 0.5) * width
  const y1 = (Math.sin(rad + Math.PI) / 2 + 0.5) * height
  const x2 = (Math.cos(rad) / 2 + 0.5) * width
  const y2 = (Math.sin(rad) / 2 + 0.5) * height

  return new fabric.Gradient({
    type: 'linear',
    coords: { x1, y1, x2, y2 },
    colorStops: Object.entries(colorStops).map(([offset, color]) => ({
      offset: parseFloat(offset),
      color,
    })),
  })
}

export default function EditorCanvas({ imageDataUrl, onExportReady }: EditorCanvasProps) {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const screenshotObjRef = useRef<any>(null)
  // Track whether fabric has finished initializing
  const fabricReadyRef = useRef(false)
  // Keep a ref to the latest imageDataUrl so the init effect can read it
  const imageDataUrlRef = useRef<string | null>(imageDataUrl)

  const [isDrawingBlur, setIsDrawingBlur] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blurStartRef = useRef<{ x: number; y: number } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blurRectRef = useRef<any>(null)

  const { background, shadow, cornerRadius, padding, activeTool, aspectRatio } = useEditorStore()

  // Always keep imageDataUrlRef in sync with the prop
  imageDataUrlRef.current = imageDataUrl

  // Canvas dimensions based on aspect ratio
  const getCanvasDimensions = useCallback(() => {
    const container = containerRef.current
    if (!container) return { width: 800, height: 600 }

    const maxW = container.clientWidth - 48
    const maxH = container.clientHeight - 48

    if (aspectRatio.id === 'free' || (aspectRatio.width === 0 && aspectRatio.height === 0)) {
      return { width: Math.min(maxW, 900), height: Math.min(maxH, 650) }
    }

    const ratio = aspectRatio.width / aspectRatio.height
    let w = Math.min(maxW, 900)
    let h = w / ratio

    if (h > maxH) {
      h = maxH
      w = h * ratio
    }

    return { width: Math.round(w), height: Math.round(h) }
  }, [aspectRatio])

  // Apply background to the fabric canvas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const applyBackground = useCallback((canvas: any, fabric: any) => {
    const { width, height } = canvas
    if (background.value === 'transparent') {
      canvas.backgroundColor = 'transparent'
    } else if (background.type === 'gradient') {
      const grad = parseCSSGradientToFabric(background.value, width, height, fabric)
      if (grad) canvas.backgroundColor = grad
      else canvas.backgroundColor = '#1a1a2e'
    } else {
      canvas.backgroundColor = background.value
    }
    canvas.renderAll()
  }, [background])

  // Load an image dataUrl onto the fabric canvas — shared by init and prop-change effects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadImage = useCallback((dataUrl: string, canvas: any, fabric: any) => {
    const currentPadding = useEditorStore.getState().padding
    fabric.FabricImage.fromURL(dataUrl).then((img: any) => {
      if (!canvas) return

      const { width: canvasW, height: canvasH } = canvas
      const availW = canvasW - currentPadding * 2
      const availH = canvasH - currentPadding * 2

      const scaleX = availW / (img.width ?? 1)
      const scaleY = availH / (img.height ?? 1)
      const scale = Math.min(scaleX, scaleY, 1)

      img.set({
        left: canvasW / 2,
        top: canvasH / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
      })

      if (screenshotObjRef.current) {
        canvas.remove(screenshotObjRef.current)
      }

      screenshotObjRef.current = img
      canvas.add(img)
      canvas.sendObjectToBack(img)
      applyBackground(canvas, fabric)

      // Apply corner radius and shadow
      const { shadow: shadowCfg, cornerRadius: cr } = useEditorStore.getState()
      const clip = new fabric.Rect({
        width: img.width,
        height: img.height,
        rx: cr,
        ry: cr,
        originX: 'center',
        originY: 'center',
      })
      img.clipPath = clip
      if (shadowCfg.enabled) {
        img.shadow = new fabric.Shadow({
          color: shadowCfg.color,
          blur: shadowCfg.blur,
          offsetX: shadowCfg.offsetX,
          offsetY: shadowCfg.offsetY,
        })
      }
      canvas.renderAll()
    })
  }, [applyBackground])

  // Apply shadow and corner radius to screenshot object
  const applyScreenshotStyle = useCallback(() => {
    const obj = screenshotObjRef.current
    const fabric = fabricModule
    if (!obj || !fabric) return

    // Corner radius via clipPath
    const clip = new fabric.Rect({
      width: obj.width,
      height: obj.height,
      rx: cornerRadius,
      ry: cornerRadius,
      originX: 'center',
      originY: 'center',
    })
    obj.clipPath = clip

    // Shadow
    if (shadow.enabled) {
      obj.shadow = new fabric.Shadow({
        color: shadow.color,
        blur: shadow.blur,
        offsetX: shadow.offsetX,
        offsetY: shadow.offsetY,
      })
    } else {
      obj.shadow = null
    }

    fabricCanvasRef.current?.renderAll()
  }, [shadow, cornerRadius])

  // Initialize fabric canvas
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const fabric = await import('fabric')
      if (!isMounted) return
      fabricModule = fabric

      if (!canvasElRef.current) return

      const { width, height } = getCanvasDimensions()

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width,
        height,
        selection: true,
        preserveObjectStacking: true,
      })

      fabricCanvasRef.current = canvas
      fabricReadyRef.current = true
      applyBackground(canvas, fabric)

      // If an image was passed before fabric finished initializing, load it now
      if (imageDataUrlRef.current) {
        loadImage(imageDataUrlRef.current, canvas, fabric)
      }
    }

    init()

    return () => {
      isMounted = false
      fabricReadyRef.current = false
      fabricCanvasRef.current?.dispose()
      fabricCanvasRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load image when imageDataUrl prop changes — only fires if fabric is already ready
  // (if fabric isn't ready yet, the init effect handles loading via imageDataUrlRef)
  useEffect(() => {
    if (!imageDataUrl || !fabricReadyRef.current || !fabricModule) return
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    loadImage(imageDataUrl, canvas, fabricModule)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUrl])

  // Re-apply background when it changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    const fabric = fabricModule
    if (!canvas || !fabric) return
    applyBackground(canvas, fabric)
  }, [applyBackground])

  // Re-apply shadow / corners when they change
  useEffect(() => {
    applyScreenshotStyle()
  }, [applyScreenshotStyle])

  // Resize canvas when aspect ratio changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    const fabric = fabricModule
    if (!canvas || !fabric) return

    const { width, height } = getCanvasDimensions()
    canvas.setWidth(width)
    canvas.setHeight(height)
    applyBackground(canvas, fabric)

    // Re-center and re-scale screenshot
    const obj = screenshotObjRef.current
    if (obj) {
      const availW = width - padding * 2
      const availH = height - padding * 2
      const scaleX = availW / (obj.width ?? 1)
      const scaleY = availH / (obj.height ?? 1)
      const scale = Math.min(scaleX, scaleY, 1)
      obj.set({ left: width / 2, top: height / 2, scaleX: scale, scaleY: scale })
      applyScreenshotStyle()
    }
    canvas.renderAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio, padding])

  // Tool mode effects
  useEffect(() => {
    const canvas = fabricCanvasRef.current
    const fabric = fabricModule
    if (!canvas || !fabric) return

    // Reset modes
    canvas.isDrawingMode = false
    canvas.selection = activeTool === 'select'
    canvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair'

    if (activeTool === 'text') {
      const handleTextClick = (opt: { e: MouseEvent }) => {
        if (activeTool !== 'text') return
        const pointer = canvas.getPointer(opt.e)
        const text = new fabric.IText('Click to type...', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 18,
          fill: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 6 }),
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        canvas.renderAll()
        // Switch back to select after placing
        useEditorStore.getState().setActiveTool('select')
      }
      canvas.on('mouse:down', handleTextClick)
      return () => canvas.off('mouse:down', handleTextClick)
    }

    if (activeTool === 'blur') {
      let isDown = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rect: any = null
      let startX = 0
      let startY = 0

      const onMouseDown = (opt: { e: MouseEvent }) => {
        isDown = true
        const pointer = canvas.getPointer(opt.e)
        startX = pointer.x
        startY = pointer.y
        rect = new fabric.Rect({
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          fill: 'rgba(0,0,0,0.01)',
          stroke: 'rgba(255,255,255,0.4)',
          strokeWidth: 1,
          strokeDashArray: [4, 4],
          selectable: true,
        })
        canvas.add(rect)
      }

      const onMouseMove = (opt: { e: MouseEvent }) => {
        if (!isDown || !rect) return
        const pointer = canvas.getPointer(opt.e)
        rect.set({
          width: Math.abs(pointer.x - startX),
          height: Math.abs(pointer.y - startY),
          left: Math.min(pointer.x, startX),
          top: Math.min(pointer.y, startY),
        })
        canvas.renderAll()
      }

      const onMouseUp = () => {
        if (!isDown || !rect) return
        isDown = false

        // Apply blur filter effect using a backdrop blur rect
        rect.set({
          fill: 'rgba(100,100,100,0.5)',
          stroke: 'none',
          backdropFilter: 'blur(8px)',
        })

        // Create a frosted-glass blurred overlay using fabric filters
        const blurredOverlay = new fabric.Rect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          fill: 'rgba(200,200,200,0.35)',
          rx: 4,
          ry: 4,
          selectable: true,
        })

        // Add pixelated label inside
        const label = new fabric.Rect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          fill: new fabric.Pattern({
            source: (() => {
              const patternCanvas = document.createElement('canvas')
              patternCanvas.width = 8
              patternCanvas.height = 8
              const ctx = patternCanvas.getContext('2d')!
              ctx.fillStyle = 'rgba(0,0,0,0.15)'
              ctx.fillRect(0, 0, 4, 4)
              ctx.fillRect(4, 4, 4, 4)
              ctx.fillStyle = 'rgba(255,255,255,0.15)'
              ctx.fillRect(4, 0, 4, 4)
              ctx.fillRect(0, 4, 4, 4)
              return patternCanvas
            })(),
            repeat: 'repeat',
          }),
          selectable: false,
          evented: false,
        })

        canvas.remove(rect)
        canvas.add(blurredOverlay)
        canvas.add(label)
        canvas.renderAll()
        rect = null
        useEditorStore.getState().setActiveTool('select')
      }

      canvas.on('mouse:down', onMouseDown)
      canvas.on('mouse:move', onMouseMove)
      canvas.on('mouse:up', onMouseUp)

      return () => {
        canvas.off('mouse:down', onMouseDown)
        canvas.off('mouse:move', onMouseMove)
        canvas.off('mouse:up', onMouseUp)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool])

  // Export function — passed up to the toolbar
  useEffect(() => {
    onExportReady(() => {
      const canvas = fabricCanvasRef.current
      if (!canvas) return
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'snap-it.png'
      a.click()
    })
  }, [onExportReady])

  void isDrawingBlur
  void setIsDrawingBlur
  void blurStartRef
  void blurRectRef

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden bg-[#0a0a0a] relative"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="rounded-xl overflow-hidden shadow-2xl">
        <canvas ref={canvasElRef} />
      </div>

      {/* Tool hint */}
      {activeTool !== 'select' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
          {activeTool === 'text' ? 'Click to place text' : 'Draw to blur an area'} · Press{' '}
          <kbd className="font-mono">Esc</kbd> to cancel
        </div>
      )}
    </div>
  )
}

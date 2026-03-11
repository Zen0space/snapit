"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { type CanvasRefs } from "./useCanvasCore";

type FabricModule = typeof import("fabric");
type FabricCanvas = InstanceType<FabricModule["Canvas"]>;
type FabricRect = InstanceType<FabricModule["Rect"]>;
type FabricPointerEvent = import("fabric").TPointerEventInfo;

interface UseCanvasToolsProps {
  refs: Pick<CanvasRefs, "canvasRef" | "fabricRef">;
}

/**
 * Manages the active tool (select / text / blur) on the Fabric canvas.
 * Registers and cleans up event listeners when activeTool changes.
 */
export function useCanvasTools({ refs }: UseCanvasToolsProps) {
  const { activeTool } = useEditorStore();

  useEffect(() => {
    const canvas = refs.canvasRef.current;
    const fabric = refs.fabricRef.current;
    if (!canvas || !fabric) return;

    canvas.isDrawingMode = false;
    canvas.selection = activeTool === "select";
    canvas.defaultCursor = activeTool === "select" ? "default" : "crosshair";

    if (activeTool === "text") {
      return registerTextTool(canvas, fabric);
    }

    if (activeTool === "blur") {
      return registerBlurTool(canvas, fabric);
    }
  }, [activeTool, refs.canvasRef, refs.fabricRef]);
}

// ---------------------------------------------------------------------------
// Text tool
// ---------------------------------------------------------------------------

function registerTextTool(canvas: FabricCanvas, fabric: FabricModule) {
  const onMouseDown = (opt: FabricPointerEvent) => {
    const pointer = canvas.getPointer(opt.e);
    const text = new fabric.IText("Click to type...", {
      left: pointer.x,
      top: pointer.y,
      fontSize: 18,
      fill: "#ffffff",
      fontFamily: "Inter, system-ui, sans-serif",
      shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.5)", blur: 6 }),
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    useEditorStore.getState().setActiveTool("select");
  };

  canvas.on("mouse:down", onMouseDown);
  return () => canvas.off("mouse:down", onMouseDown);
}

// ---------------------------------------------------------------------------
// Blur / redact tool
// ---------------------------------------------------------------------------

function registerBlurTool(canvas: FabricCanvas, fabric: FabricModule) {
  let rect: FabricRect | null = null;
  let startX = 0;
  let startY = 0;

  const onMouseDown = (opt: FabricPointerEvent) => {
    const pointer = canvas.getPointer(opt.e);
    startX = pointer.x;
    startY = pointer.y;
    rect = new fabric.Rect({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      fill: "rgba(0,0,0,0.01)",
      stroke: "rgba(255,255,255,0.4)",
      strokeWidth: 1,
      strokeDashArray: [4, 4],
    });
    canvas.add(rect);
  };

  const onMouseMove = (opt: FabricPointerEvent) => {
    if (!rect) return;
    const pointer = canvas.getPointer(opt.e);
    rect.set({
      width: Math.abs(pointer.x - startX),
      height: Math.abs(pointer.y - startY),
      left: Math.min(pointer.x, startX),
      top: Math.min(pointer.y, startY),
    });
    canvas.renderAll();
  };

  const onMouseUp = () => {
    if (!rect) return;

    const patternEl = document.createElement("canvas");
    patternEl.width = 8;
    patternEl.height = 8;
    const ctx = patternEl.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, 4, 4);
    ctx.fillRect(4, 4, 4, 4);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(4, 0, 4, 4);
    ctx.fillRect(0, 4, 4, 4);

    const redact = new fabric.Rect({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      fill: new fabric.Pattern({ source: patternEl, repeat: "repeat" }),
      rx: 3,
      ry: 3,
      selectable: true,
    });

    canvas.remove(rect);
    canvas.add(redact);
    canvas.renderAll();
    rect = null;
    useEditorStore.getState().setActiveTool("select");
  };

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return () => {
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);
  };
}

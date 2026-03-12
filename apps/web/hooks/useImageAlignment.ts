"use client";

import { useCallback } from "react";
import type { CanvasRefs } from "./useCanvasCore";

export function useImageAlignment(
  refs: Pick<CanvasRefs, "canvasRef" | "screenshotRef">,
) {
  const centerHorizontal = useCallback(() => {
    const canvas = refs.canvasRef.current;
    const img = refs.screenshotRef.current;
    if (!canvas || !img) return;

    img.set({ left: canvas.width / 2 });
    img.setCoords();
    canvas.renderAll();
  }, [refs]);

  const centerVertical = useCallback(() => {
    const canvas = refs.canvasRef.current;
    const img = refs.screenshotRef.current;
    if (!canvas || !img) return;

    img.set({ top: canvas.height / 2 });
    img.setCoords();
    canvas.renderAll();
  }, [refs]);

  const centerBoth = useCallback(() => {
    const canvas = refs.canvasRef.current;
    const img = refs.screenshotRef.current;
    if (!canvas || !img) return;

    img.set({
      left: canvas.width / 2,
      top: canvas.height / 2,
    });
    img.setCoords();
    canvas.renderAll();
  }, [refs]);

  return { centerHorizontal, centerVertical, centerBoth };
}

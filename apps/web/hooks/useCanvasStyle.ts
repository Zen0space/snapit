"use client";

import { useEffect, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { makeFabricGradient, type CanvasRefs } from "./useCanvasCore";

type FabricModule = typeof import("fabric");
type FabricImage = InstanceType<FabricModule["FabricImage"]>;

interface UseCanvasStyleProps {
  refs: Pick<CanvasRefs, "canvasRef" | "fabricRef" | "screenshotRef">;
}

/**
 * Applies background, shadow and corner-radius changes to the Fabric canvas.
 * Watches the relevant store slices and re-applies whenever they change.
 */
export function useCanvasStyle({ refs }: UseCanvasStyleProps) {
  const { background, shadow, cornerRadius } = useEditorStore();

  // ── Background ─────────────────────────────────────────────────────────────
  const applyBackground = useCallback(() => {
    const canvas = refs.canvasRef.current;
    const fabric = refs.fabricRef.current;
    if (!canvas || !fabric) return;

    const { width, height } = canvas;

    if (background.value === "transparent") {
      canvas.backgroundColor = "transparent";
    } else if (background.type === "gradient") {
      const grad = makeFabricGradient(background.value, width, height, fabric);
      canvas.backgroundColor = grad ?? "#1a1a2e";
    } else {
      canvas.backgroundColor = background.value;
    }

    canvas.renderAll();
  }, [background, refs.canvasRef, refs.fabricRef]);

  // ── Shadow + corner radius ─────────────────────────────────────────────────
  const applyStyle = useCallback(() => {
    const obj = refs.screenshotRef.current;
    const fabric = refs.fabricRef.current;
    if (!obj || !fabric) return;

    obj.set({
      clipPath: new fabric.Rect({
        width: obj.width,
        height: obj.height,
        rx: cornerRadius,
        ry: cornerRadius,
        originX: "center",
        originY: "center",
      }),
      shadow: shadow.enabled
        ? new fabric.Shadow({
            color: shadow.color,
            blur: shadow.blur,
            offsetX: shadow.offsetX,
            offsetY: shadow.offsetY,
          })
        : null,
    });

    obj.setCoords();
    refs.canvasRef.current?.requestRenderAll();
  }, [
    shadow,
    cornerRadius,
    refs.screenshotRef,
    refs.fabricRef,
    refs.canvasRef,
  ]);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    applyBackground();
  }, [applyBackground]);
  useEffect(() => {
    applyStyle();
  }, [applyStyle]);

  return { applyBackground, applyStyle };
}

// ---------------------------------------------------------------------------
// Image loader
// ---------------------------------------------------------------------------

interface UseCanvasImageProps {
  refs: Pick<CanvasRefs, "canvasRef" | "fabricRef" | "screenshotRef">;
  applyBackground: () => void;
}

export function useCanvasImage({ refs, applyBackground }: UseCanvasImageProps) {
  const { setUploadedImageDimensions } = useEditorStore();

  const loadImage = useCallback(
    (dataUrl: string) => {
      const canvas = refs.canvasRef.current;
      const fabric = refs.fabricRef.current;
      if (!canvas || !fabric) return;

      const {
        shadow: shadowCfg,
        cornerRadius: cr,
        padding: pad,
        canvasMode,
        canvasWidth,
        canvasHeight,
      } = useEditorStore.getState();

      fabric.FabricImage.fromURL(dataUrl)
        .then((img: FabricImage) => {
          if (img.width && img.height) {
            setUploadedImageDimensions(img.width, img.height);
          }

          const { width: cw, height: ch } = canvas;

          let displayScale = 1;
          if (canvasMode === "manual") {
            displayScale = Math.min(cw / canvasWidth, ch / canvasHeight);
          }

          const displayPadding = pad * displayScale;
          const scale = Math.min(
            (cw - displayPadding * 2) / (img.width ?? 1),
            (ch - displayPadding * 2) / (img.height ?? 1),
          );

          img.set({
            left: cw / 2,
            top: ch / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
          });

          if (refs.screenshotRef.current)
            canvas.remove(refs.screenshotRef.current);
          refs.screenshotRef.current = img;

          canvas.add(img);
          canvas.sendObjectToBack(img);

          img.clipPath = new fabric.Rect({
            width: img.width,
            height: img.height,
            rx: cr,
            ry: cr,
            originX: "center",
            originY: "center",
          });

          if (shadowCfg.enabled) {
            img.shadow = new fabric.Shadow({
              color: shadowCfg.color,
              blur: shadowCfg.blur,
              offsetX: shadowCfg.offsetX,
              offsetY: shadowCfg.offsetY,
            });
          }

          applyBackground();
          canvas.renderAll();
        })
        .catch((err) => {
          console.error("[canvas] Failed to load image:", err);
        });
    },
    [
      applyBackground,
      setUploadedImageDimensions,
      refs.canvasRef,
      refs.fabricRef,
      refs.screenshotRef,
    ],
  );

  return { loadImage };
}

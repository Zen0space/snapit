"use client";

import { useEffect, useCallback } from "react";
import { useSetAtom, useStore } from "jotai";
import {
  backgroundAtom,
  shadowAtom,
  cornerRadiusAtom,
  paddingAtom,
  canvasModeAtom,
  canvasWidthAtom,
  canvasHeightAtom,
  setUploadedImageDimensionsAtom,
} from "@/store/atoms";
import { makeFabricGradient, type CanvasRefs } from "./useCanvasCore";
import { drawEidPattern, type EidPatternId } from "@/lib/eidPatterns";

type FabricModule = typeof import("fabric");
type FabricImage = InstanceType<FabricModule["FabricImage"]>;

interface UseCanvasStyleProps {
  refs: Pick<CanvasRefs, "canvasRef" | "fabricRef" | "screenshotRef">;
}

/**
 * Applies background, shadow and corner-radius changes to the Fabric canvas.
 * Functions read atom values via store.get() so they are stable (no useCallback
 * dep churn). Atom subscriptions trigger re-application automatically.
 */
export function useCanvasStyle({ refs }: UseCanvasStyleProps) {
  const store = useStore();

  // ── Background ─────────────────────────────────────────────────────────────
  const applyBackground = useCallback(() => {
    const canvas = refs.canvasRef.current;
    const fabric = refs.fabricRef.current;
    if (!canvas || !fabric) return;

    const background = store.get(backgroundAtom);
    const { width, height } = canvas;

    if (background.value === "transparent") {
      canvas.backgroundImage = undefined;
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
      return;
    }

    // ── Option B: Eid pattern via offscreen Canvas 2D ─────────────────────
    // Fully synchronous: pass the offscreen <canvas> element directly to
    // FabricImage so the background updates in the same tick as the resize.
    // Previously this used FabricImage.fromURL(dataUrl) which was async and
    // caused a visible flash of the stale background during padding drags.
    if (background.patternId) {
      const offscreen = document.createElement("canvas");
      drawEidPattern(
        background.patternId as EidPatternId,
        offscreen,
        width,
        height,
      );

      const img = new fabric.FabricImage(offscreen);
      img.set({ left: 0, top: 0, originX: "left", originY: "top" });
      canvas.backgroundImage = img;
      canvas.renderAll();
      return;
    }

    // ── Standard gradient or solid ────────────────────────────────────────
    canvas.backgroundImage = undefined;
    if (background.type === "gradient") {
      const fv = background.fabricValue;
      if (fv.startsWith("#") || fv.startsWith("rgb")) {
        canvas.backgroundColor = fv;
      } else {
        const grad = makeFabricGradient(fv, width, height, fabric);
        canvas.backgroundColor = grad ?? "#1a1a2e";
      }
    } else {
      canvas.backgroundColor = background.fabricValue ?? background.value;
    }

    canvas.renderAll();
  }, [store, refs.canvasRef, refs.fabricRef]);

  // ── Shadow + corner radius ─────────────────────────────────────────────────
  const applyStyle = useCallback(() => {
    const obj = refs.screenshotRef.current;
    const fabric = refs.fabricRef.current;
    if (!obj || !fabric) return;

    const shadow = store.get(shadowAtom);
    const cornerRadius = store.get(cornerRadiusAtom);

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
  }, [store, refs.screenshotRef, refs.fabricRef, refs.canvasRef]);

  // ── Subscribe to atom changes ─────────────────────────────────────────────
  // Replaces the two useEffects that re-ran applyBackground/applyStyle on every
  // useCallback identity change. store.sub fires only when atom values change.
  useEffect(() => {
    const unsubs = [
      store.sub(backgroundAtom, applyBackground),
      store.sub(shadowAtom, applyStyle),
      store.sub(cornerRadiusAtom, applyStyle),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [store, applyBackground, applyStyle]);

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
  const setUploadedImageDimensions = useSetAtom(setUploadedImageDimensionsAtom);
  const store = useStore();

  const loadImage = useCallback(
    (dataUrl: string) => {
      const canvas = refs.canvasRef.current;
      const fabric = refs.fabricRef.current;
      if (!canvas || !fabric) return;

      const shadowCfg = store.get(shadowAtom);
      const cr = store.get(cornerRadiusAtom);
      const pad = store.get(paddingAtom);
      const canvasMode = store.get(canvasModeAtom);
      const cWidth = store.get(canvasWidthAtom);
      const cHeight = store.get(canvasHeightAtom);

      fabric.FabricImage.fromURL(dataUrl)
        .then((img: FabricImage) => {
          if (img.width && img.height) {
            setUploadedImageDimensions({
              width: img.width,
              height: img.height,
            });
          }

          const { width: cw, height: ch } = canvas;

          let displayScale = 1;
          if (canvasMode === "manual") {
            displayScale = Math.min(cw / cWidth, ch / cHeight);
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
      store,
      refs.canvasRef,
      refs.fabricRef,
      refs.screenshotRef,
    ],
  );

  return { loadImage };
}

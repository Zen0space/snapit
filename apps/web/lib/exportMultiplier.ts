type FabricImage = InstanceType<typeof import("fabric").FabricImage>;
type FabricCanvas = InstanceType<typeof import("fabric").Canvas>;

/**
 * Calculates the export multiplier so the exported PNG is at the original
 * image resolution rather than the (potentially downscaled) display size.
 * Always returns at least 1 — never scales down.
 */
export function calculateExportMultiplier(
  canvas: FabricCanvas,
  img: FabricImage | null,
  uploadedImageWidth: number | null,
  uploadedImageHeight: number | null,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const displayWidth = canvas.width;
  const displayHeight = canvas.height;
  // Use original image dimensions for export quality; fall back to canvas dims
  const actualWidth = uploadedImageWidth || canvasWidth || displayWidth;
  const actualHeight = uploadedImageHeight || canvasHeight || displayHeight;

  if (img && img.scaleX && img.scaleY) {
    const imageScale = Math.min(img.scaleX, img.scaleY);
    const targetMultiplier = Math.min(
      actualWidth / (displayWidth * imageScale),
      actualHeight / (displayHeight * imageScale),
    );
    return Math.max(targetMultiplier, 1); // Never scale down
  }

  // Fallback: scale based on canvas dimensions only
  return (
    Math.min(actualWidth / displayWidth, actualHeight / displayHeight) || 1
  );
}

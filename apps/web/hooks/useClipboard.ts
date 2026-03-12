import { useEffect } from "react";

// Listens for paste events globally (Ctrl+V / Cmd+V) and returns the image data URL
export function useClipboard(onImage: (dataUrl: string) => void) {
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      try {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = (ev) => {
              const result = ev.target?.result;
              if (typeof result === "string") {
                onImage(result);
              }
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
          }
        }
      } catch {
        // Clipboard API not available or permission denied
      }
    };

    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [onImage]);
}

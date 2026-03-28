"use client";

import { useRef, useCallback } from "react";
import { useAtomValue } from "jotai";
import { hasImageAtom } from "@/store/atoms";
import { useClipboard } from "@/hooks/useClipboard";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DropZoneProps {
  onImage: (dataUrl: string) => void;
}

export default function DropZone({ onImage }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImage = useAtomValue(hasImageAtom);
  const { logEvent } = useAnalytics();

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          onImage(result);
          logEvent("image_uploaded", { meta: file.type });
        }
      };
      reader.readAsDataURL(file);
    },
    [onImage, logEvent],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Clipboard paste support via global hook
  useClipboard(
    useCallback(
      (dataUrl) => {
        onImage(dataUrl);
        logEvent("image_uploaded", { meta: "clipboard" });
      },
      [onImage, logEvent],
    ),
  );

  if (hasImage) return null;

  return (
    <div
      className="flex-1 flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        className="border-2 border-dashed border-white/20 rounded-2xl p-16 flex flex-col items-center gap-6 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all group max-w-lg w-full mx-4"
        onClick={() => inputRef.current?.click()}
      >
        {/* Upload icon */}
        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
          <svg
            className="w-10 h-10 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">
            Drop a screenshot here
          </p>
          <p className="text-white/50 text-sm">
            or click to browse · paste with{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-xs font-mono">
              ⌘V
            </kbd>
          </p>
        </div>

        <div className="flex items-center gap-2 text-white/30 text-xs">
          <span>PNG</span>
          <span>·</span>
          <span>JPG</span>
          <span>·</span>
          <span>WEBP</span>
          <span>·</span>
          <span>GIF</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}

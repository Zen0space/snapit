"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Toolbar from "@/components/editor/Toolbar";
import LeftPanel from "@/components/editor/LeftPanel";
import RightPanel from "@/components/editor/RightPanel";
import DropZone from "@/components/editor/DropZone";
import MobileRatioDropdown from "@/components/editor/MobileRatioDropdown";
import { useEditorStore } from "@/store/editorStore";

const EditorCanvas = dynamic(() => import("@/components/editor/EditorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function HomePage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const exportFnRef = useRef<(() => void) | null>(null);
  const { hasImage, setHasImage } = useEditorStore();

  const handleImage = useCallback(
    (dataUrl: string) => {
      setImageDataUrl(dataUrl);
      setHasImage(true);
    },
    [setHasImage],
  );

  const handleReset = useCallback(() => {
    setImageDataUrl(null);
    setHasImage(false);
  }, [setHasImage]);

  const handleExport = useCallback(() => {
    exportFnRef.current?.();
  }, []);

  const handleExportReady = useCallback((fn: () => void) => {
    exportFnRef.current = fn;
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar onExport={handleExport} onReset={handleReset} />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />

        <main className="flex-1 flex flex-col overflow-hidden">
          {hasImage && (
            <div className="lg:hidden px-3 py-2 border-b border-white/10 bg-[#0f0f0f]">
              <MobileRatioDropdown />
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {imageDataUrl ? (
              <EditorCanvas
                imageDataUrl={imageDataUrl}
                onExportReady={handleExportReady}
              />
            ) : (
              <DropZone onImage={handleImage} />
            )}
          </div>
        </main>

        <RightPanel />
      </div>
    </div>
  );
}

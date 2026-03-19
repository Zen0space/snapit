"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Toolbar from "@/components/editor/Toolbar";
import LeftPanel from "@/components/editor/LeftPanel";
import RightPanel from "@/components/editor/RightPanel";
import DropZone from "@/components/editor/DropZone";
import MobileRatioDropdown from "@/components/editor/MobileRatioDropdown";
import MobileBottomSheet from "@/components/editor/MobileBottomSheet";
import MobileEditButton from "@/components/editor/MobileEditButton";
import EidOverlay from "@/components/editor/EidOverlay";
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const exportFnRef = useRef<(() => void) | null>(null);
  const copyFnRef = useRef<(() => void) | null>(null);
  const alignmentFnsRef = useRef<{
    centerHorizontal: () => void;
    centerVertical: () => void;
    centerBoth: () => void;
  } | null>(null);
  const { hasImage, setHasImage } = useEditorStore();

  const handleImage = useCallback(
    (dataUrl: string) => {
      setImageDataUrl(dataUrl);
      setHasImage(true);
    },
    [setHasImage],
  );

  const handleExport = useCallback(() => {
    exportFnRef.current?.();
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    copyFnRef.current?.();
  }, []);

  const handleExportReady = useCallback((fn: () => void) => {
    exportFnRef.current = fn;
  }, []);

  const handleCopyReady = useCallback((fn: () => void) => {
    copyFnRef.current = fn;
  }, []);

  const handleAlignmentReady = useCallback(
    (fns: {
      centerHorizontal: () => void;
      centerVertical: () => void;
      centerBoth: () => void;
    }) => {
      alignmentFnsRef.current = fns;
    },
    [],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar
        onExport={handleExport}
        onCopyToClipboard={handleCopyToClipboard}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel alignmentFunctions={alignmentFnsRef.current} />

        <main
          className="flex-1 flex relative transition-all duration-300 ease-out bg-[#040f08]"
          style={{
            height: isSheetOpen ? "calc(100% - 40vh)" : "100%",
            overflow: isSheetOpen ? "auto" : "hidden",
            backgroundImage: [
              "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.07) 1px, transparent 0)",
              "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
              "linear-gradient(160deg, #041a0e 0%, #0a0a0a 60%, #070f0a 100%)",
            ].join(", "),
            backgroundSize: "24px 24px, 100% 100%, 100% 100%",
          }}
        >
          <EidOverlay />
          {hasImage && (
            <>
              {/* Mobile Controls Row - Ratio + Alignment */}
              <div className="lg:hidden absolute top-3 left-3 right-3 z-10 flex items-center gap-2">
                <MobileRatioDropdown />

                {alignmentFnsRef.current && (
                  <div className="flex gap-1.5 ml-auto">
                    <button
                      onClick={alignmentFnsRef.current.centerHorizontal}
                      className="p-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors"
                      aria-label="Center Horizontal"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="2" x2="12" y2="22" />
                        <line x1="4" y1="12" x2="10" y2="12" />
                        <line x1="14" y1="12" x2="20" y2="12" />
                      </svg>
                    </button>

                    <button
                      onClick={alignmentFnsRef.current.centerVertical}
                      className="p-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors"
                      aria-label="Center Vertical"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <line x1="12" y1="4" x2="12" y2="10" />
                        <line x1="12" y1="14" x2="12" y2="20" />
                      </svg>
                    </button>

                    <button
                      onClick={alignmentFnsRef.current.centerBoth}
                      className="p-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors"
                      aria-label="Center Both"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <MobileEditButton
                onClick={() => setIsSheetOpen(true)}
                isOpen={isSheetOpen}
              />
            </>
          )}
          {imageDataUrl ? (
            <EditorCanvas
              imageDataUrl={imageDataUrl}
              onExportReady={handleExportReady}
              onCopyReady={handleCopyReady}
              onAlignmentReady={handleAlignmentReady}
            />
          ) : (
            <DropZone onImage={handleImage} />
          )}
        </main>

        <RightPanel />
      </div>

      <MobileBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  );
}

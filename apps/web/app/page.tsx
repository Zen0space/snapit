"use client";

import { useState, useCallback, useRef, lazy, Suspense } from "react";
import Toolbar from "@/components/editor/Toolbar";
import LeftPanel from "@/components/editor/LeftPanel";
import RightPanel from "@/components/editor/RightPanel";
import DropZone from "@/components/editor/DropZone";
import MobileRatioDropdown from "@/components/editor/MobileRatioDropdown";
import MobileBottomSheet from "@/components/editor/MobileBottomSheet";
import MobileAlignmentButtons from "@/components/editor/MobileAlignmentButtons";
import MobileEditButton from "@/components/editor/MobileEditButton";
import EidOverlay from "@/components/editor/EidOverlay";
import { useAtom } from "jotai";
import { hasImageAtom } from "@/store/atoms";
import type { EditorCanvasHandle } from "@/components/editor/EditorCanvas";

// React.lazy preserves forwardRef (next/dynamic's LoadableComponent does not)
const EditorCanvas = lazy(() => import("@/components/editor/EditorCanvas"));

const CanvasSpinner = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function HomePage() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const editorRef = useRef<EditorCanvasHandle>(null);
  const [hasImage, setHasImage] = useAtom(hasImageAtom);

  const handleImage = useCallback(
    (dataUrl: string) => {
      setImageDataUrl(dataUrl);
      setHasImage(true);
    },
    [setHasImage],
  );

  const handleExport = useCallback(() => {
    editorRef.current?.exportImage();
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    editorRef.current?.copyToClipboard();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toolbar
        onExport={handleExport}
        onCopyToClipboard={handleCopyToClipboard}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftPanel editorRef={editorRef} />

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
                <MobileAlignmentButtons editorRef={editorRef} />
              </div>

              <MobileEditButton
                onClick={() => setIsSheetOpen(true)}
                isOpen={isSheetOpen}
              />
            </>
          )}
          {imageDataUrl ? (
            <Suspense fallback={<CanvasSpinner />}>
              <EditorCanvas ref={editorRef} imageDataUrl={imageDataUrl} />
            </Suspense>
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

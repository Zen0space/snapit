"use client";

import type { RefObject } from "react";
import AspectRatioPanel from "@/components/panels/AspectRatioPanel";
import ImageAlignmentPanel from "@/components/panels/ImageAlignmentPanel";
import type { EditorCanvasHandle } from "@/components/editor/EditorCanvas";

interface LeftPanelProps {
  editorRef: RefObject<EditorCanvasHandle | null>;
}

export default function LeftPanel({ editorRef }: LeftPanelProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#161616] overflow-y-auto">
      <AspectRatioPanel />

      <ImageAlignmentPanel
        onCenterHorizontal={() => editorRef.current?.centerHorizontal()}
        onCenterVertical={() => editorRef.current?.centerVertical()}
        onCenterBoth={() => editorRef.current?.centerBoth()}
      />
    </aside>
  );
}

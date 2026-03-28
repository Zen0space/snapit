"use client";

import type { RefObject } from "react";
import type { EditorCanvasHandle } from "@/components/editor/EditorCanvas";
import {
  CenterHorizontalIcon,
  CenterVerticalIcon,
  CenterBothIcon,
} from "@/components/ui/AlignmentIcons";

const BTN =
  "p-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors";
const ICON = "w-4 h-4 text-white";

interface MobileAlignmentButtonsProps {
  editorRef: RefObject<EditorCanvasHandle | null>;
}

export default function MobileAlignmentButtons({
  editorRef,
}: MobileAlignmentButtonsProps) {
  return (
    <div className="flex gap-1.5 ml-auto">
      <button
        onClick={() => editorRef.current?.centerHorizontal()}
        className={BTN}
        aria-label="Center Horizontal"
      >
        <CenterHorizontalIcon className={ICON} />
      </button>

      <button
        onClick={() => editorRef.current?.centerVertical()}
        className={BTN}
        aria-label="Center Vertical"
      >
        <CenterVerticalIcon className={ICON} />
      </button>

      <button
        onClick={() => editorRef.current?.centerBoth()}
        className={BTN}
        aria-label="Center Both"
      >
        <CenterBothIcon className={ICON} />
      </button>
    </div>
  );
}

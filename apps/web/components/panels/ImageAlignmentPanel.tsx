"use client";

import { useAtomValue } from "jotai";
import { hasImageAtom } from "@/store/atoms";
import { PanelSection } from "@/components/ui/PanelSection";
import {
  CenterHorizontalIcon,
  CenterVerticalIcon,
  CenterBothIcon,
} from "@/components/ui/AlignmentIcons";

interface ImageAlignmentPanelProps {
  onCenterHorizontal: () => void;
  onCenterVertical: () => void;
  onCenterBoth: () => void;
}

export default function ImageAlignmentPanel({
  onCenterHorizontal,
  onCenterVertical,
  onCenterBoth,
}: ImageAlignmentPanelProps) {
  const hasImage = useAtomValue(hasImageAtom);

  const btnClass = (enabled: boolean) =>
    `w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-transparent transition-colors ${
      enabled
        ? "hover:bg-white/5 text-white/70 cursor-pointer"
        : "text-white/30 cursor-not-allowed opacity-50"
    }`;

  return (
    <PanelSection title="Image Alignment">
      <div className="space-y-2">
        <button
          onClick={onCenterHorizontal}
          disabled={!hasImage}
          className={btnClass(hasImage)}
        >
          <CenterHorizontalIcon className="w-4 h-4 flex-shrink-0" />
          <span>Center Horizontal</span>
        </button>

        <button
          onClick={onCenterVertical}
          disabled={!hasImage}
          className={btnClass(hasImage)}
        >
          <CenterVerticalIcon className="w-4 h-4 flex-shrink-0" />
          <span>Center Vertical</span>
        </button>

        <button
          onClick={onCenterBoth}
          disabled={!hasImage}
          className={btnClass(hasImage)}
        >
          <CenterBothIcon className="w-4 h-4 flex-shrink-0" />
          <span>Center Both</span>
        </button>
      </div>
    </PanelSection>
  );
}

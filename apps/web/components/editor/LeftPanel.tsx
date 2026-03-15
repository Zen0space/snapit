"use client";

import AspectRatioPanel from "@/components/panels/AspectRatioPanel";
import ImageAlignmentPanel from "@/components/panels/ImageAlignmentPanel";

interface LeftPanelProps {
  alignmentFunctions?: {
    centerHorizontal: () => void;
    centerVertical: () => void;
    centerBoth: () => void;
  } | null;
}

export default function LeftPanel({ alignmentFunctions }: LeftPanelProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#161616] overflow-y-auto">
      <AspectRatioPanel />

      <ImageAlignmentPanel
        onCenterHorizontal={alignmentFunctions?.centerHorizontal}
        onCenterVertical={alignmentFunctions?.centerVertical}
        onCenterBoth={alignmentFunctions?.centerBoth}
      />
    </aside>
  );
}

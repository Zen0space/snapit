"use client";

import AspectRatioPanel from "@/components/panels/AspectRatioPanel";

export default function LeftPanel() {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#161616] overflow-y-auto">
      <AspectRatioPanel />
    </aside>
  );
}

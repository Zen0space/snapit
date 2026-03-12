"use client";

import BackgroundPicker from "@/components/panels/BackgroundPicker";
import ShadowControls from "@/components/panels/ShadowControls";
import AnnotationTools from "@/components/panels/AnnotationTools";

export default function RightPanel() {
  return (
    <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col border-l border-white/10 bg-[#161616] overflow-y-auto">
      <BackgroundPicker />
      <ShadowControls />
      <AnnotationTools />
    </aside>
  );
}

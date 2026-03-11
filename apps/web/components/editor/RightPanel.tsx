'use client'

import BackgroundPicker from '@/components/panels/BackgroundPicker'
import ShadowControls from '@/components/panels/ShadowControls'
import AnnotationTools from '@/components/panels/AnnotationTools'

export default function RightPanel() {
  return (
    <aside className="w-56 flex-shrink-0 border-l border-white/10 bg-[#161616] overflow-y-auto">
      <BackgroundPicker />
      <ShadowControls />
      <AnnotationTools />
    </aside>
  )
}

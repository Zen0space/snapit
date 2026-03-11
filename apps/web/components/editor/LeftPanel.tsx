'use client'

import AspectRatioPanel from '@/components/panels/AspectRatioPanel'

export default function LeftPanel() {
  return (
    <aside className="w-52 flex-shrink-0 border-r border-white/10 bg-[#161616] overflow-y-auto">
      <AspectRatioPanel />
    </aside>
  )
}

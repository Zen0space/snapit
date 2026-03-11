"use client";

interface PanelSectionProps {
  title: string;
  children: React.ReactNode;
}

export function PanelSection({ title, children }: PanelSectionProps) {
  return (
    <div className="px-5 py-3 border-b border-white/5">
      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

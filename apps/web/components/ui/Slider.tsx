"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: SliderProps) {
  return (
    <div className="w-full px-3 py-2.5 rounded-lg overflow-visible">
      <div className="flex items-center gap-2 overflow-visible">
        <span className="text-xs text-white/50 flex-shrink-0 w-[70px]">
          {label}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 min-w-0 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-400"
        />
        <span className="text-xs font-mono text-white/70 flex-shrink-0 w-[42px] text-right">
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}

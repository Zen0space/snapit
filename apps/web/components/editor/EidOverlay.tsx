/**
 * EidOverlay — Decorative twinkling gold stars for the Eid theme.
 * Absolutely positioned, pointer-events-none so it never blocks the canvas.
 */

const stars = [
  { top: "8%", left: "6%", size: "text-[10px]", delay: "0s", duration: "3s" },
  { top: "12%", right: "8%", size: "text-[8px]", delay: "1.2s", duration: "4s" },
  { top: "45%", left: "4%", size: "text-[7px]", delay: "0.6s", duration: "3.5s" },
  { top: "38%", right: "5%", size: "text-[9px]", delay: "2s", duration: "4.5s" },
  { bottom: "18%", left: "10%", size: "text-[8px]", delay: "1.8s", duration: "3.8s" },
  { bottom: "12%", right: "12%", size: "text-[6px]", delay: "0.3s", duration: "3.2s" },
] as const;

export default function EidOverlay() {
  return (
    <div
      className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className={`absolute ${star.size} text-amber-400/60`}
          style={{
            top: "top" in star ? star.top : undefined,
            bottom: "bottom" in star ? star.bottom : undefined,
            left: "left" in star ? star.left : undefined,
            right: "right" in star ? star.right : undefined,
            animation: `eidTwinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

"use client";

interface MobileEditButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MobileEditButton({
  onClick,
  isOpen,
}: MobileEditButtonProps) {
  if (isOpen) return null;

  return (
    <div className="lg:hidden absolute bottom-3 left-3 right-3 z-30">
      {/* Animated border wrapper */}
      <div
        className="relative p-[2px] rounded-xl overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #00f5ff, #00d4ff, #0099ff, #6b5eff, #b84eff, #ff4e91, #ff4e50, #00f5ff)",
          backgroundSize: "200% 100%",
          animation: "borderAnimation 3s linear infinite",
        }}
      >
        {/* Inner button */}
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0a0a0a] hover:bg-[#1a1a1a] text-white font-medium rounded-xl transition-all duration-300 relative group"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

          {/* Icon */}
          <svg
            className="w-5 h-5 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>

          {/* Text */}
          <span className="relative z-10 text-base">Edit</span>
        </button>
      </div>
    </div>
  );
}

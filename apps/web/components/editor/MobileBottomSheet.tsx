"use client";

import { useState } from "react";
import BackgroundPicker from "@/components/panels/BackgroundPicker";
import ShadowControls from "@/components/panels/ShadowControls";
import AnnotationTools from "@/components/panels/AnnotationTools";

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileBottomSheet({
  isOpen,
  onClose,
}: MobileBottomSheetProps) {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  const sheetStyle =
    isOpen && isDragging ? { transform: `translateY(${currentY}px)` } : {};

  return (
    <>
      {/* Animated border wrapper */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ease-out ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
        style={{
          height: "40vh",
          ...sheetStyle,
        }}
      >
        <div
          className="relative w-full h-full pt-[3px] rounded-t-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #00f5ff, #00d4ff, #0099ff, #6b5eff, #b84eff, #ff4e91, #ff4e50, #00f5ff)",
            backgroundSize: "200% 100%",
            animation: "borderAnimation 3s linear infinite",
          }}
        >
          {/* Inner sheet with dark background */}
          <div className="w-full h-full bg-[#1a1a1a] rounded-t-2xl overflow-hidden flex flex-col">
            {/* Header with handle and close button - ONLY this area is draggable */}
            <div
              className="flex items-center justify-between px-4 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-1 bg-white/30 rounded-full" />
              </div>
              <span className="text-white font-medium">Edit</span>
              <button
                onClick={onClose}
                className="p-1 text-white/50 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content - NOT draggable */}
            <div className="overflow-y-auto px-4 pb-4 space-y-4 flex-1">
              <BackgroundPicker />
              <ShadowControls />
              <AnnotationTools />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

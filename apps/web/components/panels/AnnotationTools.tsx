"use client";

import { useEditorStore } from "@/store/editorStore";
import { PanelSection } from "@/components/ui/PanelSection";
import type { ActiveTool } from "@snap-it/types";

interface ToolButton {
  tool: ActiveTool;
  label: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const TOOLS: ToolButton[] = [
  {
    tool: "select",
    label: "Select",
    description: "Move & resize objects",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
        />
      </svg>
    ),
  },
  {
    tool: "text",
    label: "Text",
    description: "Add text annotations",
    comingSoon: true,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
    ),
  },
  {
    tool: "blur",
    label: "Blur / Redact",
    description: "Hide sensitive info",
    comingSoon: true,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    ),
  },
];

export default function AnnotationTools() {
  const { activeTool, setActiveTool, hasImage } = useEditorStore();

  const handleTool = (tool: ActiveTool) => {
    setActiveTool(tool);
  };

  return (
    <PanelSection title="Tools">
      <div className="space-y-1">
        {TOOLS.map(({ tool, label, description, icon, comingSoon }) => (
          <button
            key={tool}
            onClick={() => handleTool(tool)}
            disabled={(!hasImage && tool !== "select") || comingSoon}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              activeTool === tool
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "hover:bg-white/5 text-white/70 border border-transparent"
            }`}
          >
            <span className="flex-shrink-0">{icon}</span>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium leading-none">{label}</span>
                {comingSoon && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                    COMING SOON
                  </span>
                )}
              </div>
              <div className="text-[11px] opacity-50 mt-0.5">{description}</div>
            </div>
          </button>
        ))}
      </div>

      {hasImage && activeTool === "select" && (
        <p className="mt-3 text-[11px] text-white/30 leading-relaxed">
          Select, move or resize objects on the canvas.
        </p>
      )}
    </PanelSection>
  );
}

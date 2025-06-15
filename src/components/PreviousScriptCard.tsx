
import React, { useState } from "react";
import { ArrowDown } from "lucide-react";

interface PreviousScriptCardProps {
  script: string;
  index: number;
  onRemove: () => void;
}

export const PreviousScriptCard: React.FC<PreviousScriptCardProps> = ({
  script,
  index,
  onRemove,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Show only the first line, or first 50 chars if not expanded
  const preview =
    script.trim().split("\n")[0].length > 50
      ? script.trim().split("\n")[0].slice(0, 50) + "..."
      : script.trim().split("\n")[0];

  return (
    <div className="setting-item mb-3 select-none">
      <div
        className="setting-row flex items-start gap-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/40 shadow-sm p-3 transition hover:bg-gray-100 dark:hover:bg-slate-800/60"
        onClick={() => setExpanded((v) => !v)}
        title={expanded ? "Collapse" : "Expand"}
        style={{ minHeight: "48px" }}
      >
        <span
          className="flex items-start justify-center"
          style={{ width: 40, minWidth: 40 }}
        >
          <button
            type="button"
            aria-label={expanded ? "Collapse script" : "Expand script"}
            tabIndex={0}
            className={`
              w-8 h-8 flex items-center justify-center
              bg-transparent border-none outline-none
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              transition-colors duration-150
              focus-visible:ring-2 focus-visible:ring-purple-400
            `}
            style={{ borderRadius: 4, padding: 0, margin: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            <ArrowDown
              size={24}
              strokeWidth={2}
              color="#8c8f94"
              className={`transition-transform duration-300 ease-in-out
                ${expanded ? "rotate-180" : "rotate-0"}
              `}
            />
          </button>
        </span>
        <div className="flex-1 text-gray-800 dark:text-gray-200 text-sm font-mono break-words min-h-8 flex items-start">
          {expanded ? (
            <span className="whitespace-pre-line">{script}</span>
          ) : (
            <span>
              {preview}
              {script.length > preview.length ? " ..." : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 text-gray-500 hover:text-red-600 transition-colors rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          title="Remove"
          aria-label="Remove script"
        >
          &#10005;
        </button>
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 px-3">
        script {index + 1}
      </div>
    </div>
  );
};


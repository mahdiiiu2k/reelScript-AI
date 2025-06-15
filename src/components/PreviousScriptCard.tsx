
import React, { useState } from "react";

interface PreviousScriptCardProps {
  script: string;
  index: number;
  onRemove: () => void;
}

export const PreviousScriptCard: React.FC<PreviousScriptCardProps> = ({ script, index, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  // Show only the first line, or first 50 chars if not expanded
  const preview =
    script.trim().split("\n")[0].length > 50
      ? script.trim().split("\n")[0].slice(0, 50) + "..."
      : script.trim().split("\n")[0];

  return (
    <div className="setting-item mb-3 select-none">
      <div
        className="setting-row flex items-center gap-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/40 shadow-sm p-3 transition hover:bg-gray-100 dark:hover:bg-slate-800/60"
        onClick={() => setExpanded((v) => !v)}
        title={expanded ? "Collapse" : "Expand"}
        style={{ minHeight: "48px" }}
      >
        <div className="setting-icon appearance-icon flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 p-2 rounded-md">
          {/* Simple arrow-down icon matching lucide-react 'arrow-down' */}
          <svg viewBox="0 0 24 24" width="24" height="24" className="stroke-current text-purple-700 dark:text-purple-300" fill="none" strokeWidth={2}>
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 text-gray-800 dark:text-gray-200 text-sm font-mono break-words">
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
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Remove"
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

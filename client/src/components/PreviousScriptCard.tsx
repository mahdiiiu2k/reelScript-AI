import React, { useState } from "react";

interface PreviousScriptCardProps {
  script: string;
  index: number;
  onRemove: () => void;
}

// Custom triangle icon component (solid downward-pointing triangle)
const TriangleDown = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    fill="#bdbdbd"
    style={{ display: "block" }}
  >
    <polygon points="12,17 4,7 20,7" />
  </svg>
);

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
        className="setting-row flex items-center gap-3 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/40 shadow-sm p-3 transition hover:bg-gray-100 dark:hover:bg-slate-800/60"
        onClick={() => setExpanded((v) => !v)}
        title={expanded ? "Collapse" : "Expand"}
        style={{ minHeight: "48px" }}
      >
        <button
          type="button"
          aria-label={expanded ? "Collapse script" : "Expand script"}
          tabIndex={0}
          className={`
            w-10 h-10 flex items-center justify-center
            bg-transparent
            border-none
            rounded-full
            p-0 m-0
            focus:outline-none
          `}
          style={{ boxShadow: "none" }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
        >
          <span
            className={`transition-transform duration-300 ease-in-out ${expanded ? "rotate-180" : "rotate-0"}`}
          >
            <TriangleDown size={24} />
          </span>
        </button>
        <div className="flex-1 min-w-0">
          <span className="font-sans text-base font-semibold leading-relaxed tracking-normal text-gray-900 dark:text-gray-100 transition-colors duration-200 break-words">
            {expanded ? (
              <span className="whitespace-pre-line">
                {script}
              </span>
            ) : (
              <>
                {preview}
                {script.length > preview.length ? " ..." : ""}
              </>
            )}
          </span>
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
      <div className="mt-1 px-3">
        <span className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400">
          script {index + 1}
        </span>
      </div>
    </div>
  );
};

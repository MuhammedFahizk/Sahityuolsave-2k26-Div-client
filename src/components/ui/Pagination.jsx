"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination
 *
 * Props:
 *   page        number   – current page (1-based)
 *   pages       number   – total pages
 *   total       number   – total records (optional, shown as label)
 *   onPage      (n) => void
 *   loading     boolean  – disables buttons while fetching
 *   className   string   – extra wrapper classes
 */
export default function Pagination({ page, pages, total, onPage, loading = false, className = "" }) {
  if (!pages || pages <= 1) return null;

  const isFirst = page <= 1;
  const isLast  = page >= pages;

  // Build visible page numbers — always show first, last, current ±1
  const buildRange = () => {
    const set = new Set([1, pages, page - 1, page, page + 1].filter(n => n >= 1 && n <= pages));
    const arr = [...set].sort((a, b) => a - b);

    // Insert ellipsis markers
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (i > 0 && arr[i] - arr[i - 1] > 1) result.push("…");
      result.push(arr[i]);
    }
    return result;
  };

  const range = buildRange();

  return (
    <div className={`flex items-center justify-between gap-3 px-1 ${className}`}>
      {/* Total label */}
      {total != null && (
        <span className="text-[11px] text-white/30 tabular-nums flex-shrink-0">
          {total} total
        </span>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Prev */}
        <button
          onClick={() => !isFirst && !loading && onPage(page - 1)}
          disabled={isFirst || loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.07]
            hover:bg-white/[0.10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} className="text-white/60" />
        </button>

        {/* Page numbers */}
        {range.map((item, i) =>
          item === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-white/25">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => item !== page && !loading && onPage(item)}
              disabled={loading}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-semibold border transition-colors
                ${item === page
                  ? "bg-white/[0.12] border-white/[0.15] text-white"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                } disabled:cursor-not-allowed`}
            >
              {item}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => !isLast && !loading && onPage(page + 1)}
          disabled={isLast || loading}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.07]
            hover:bg-white/[0.10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={14} className="text-white/60" />
        </button>
      </div>
    </div>
  );
}
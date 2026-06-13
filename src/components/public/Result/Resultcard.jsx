"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

// ── Shared helpers (exported for reuse) ───────────────────────────────────────

const GROUP_META = {
  "high school": { short: "HS",  bg: "bg-sky-500/10",     text: "text-sky-400",    border: "border-sky-500/20"    },
  "lower primary": { short: "LP",  bg: "bg-yellow-500/10",  text: "text-yellow-400", border: "border-yellow-500/20" },
  "upper primary": { short: "UP",  bg: "bg-yellow-500/10",  text: "text-yellow-400", border: "border-yellow-500/20" },
  "junior":      { short: "JR",  bg: "bg-emerald-500/10", text: "text-emerald-400",border: "border-emerald-500/20" },
  "senior":      { short: "SR",  bg: "bg-amber-500/10",   text: "text-amber-400",  border: "border-amber-500/20"  },
  "higher secondary": { short: "HSec",  bg: "bg-green-500/10",  text: "text-green-400", border: "border-green-500/20" },
  "general category-a": { short: "Gen-A",  bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "general category-b": { short: "Gen-B",  bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  "general" : { short: "Gen",  bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

export function groupMeta(group) {
  return GROUP_META[group?.toLowerCase()] || {
    short: group || "—",
    bg: "bg-white/[0.06]", text: "text-white/40", border: "border-white/10",
  };
}

export const POSITION_META = {
  1: { bg: "bg-amber-400/15",  text: "text-amber-400",  border: "border-amber-400/25",  label: "1st" },
  2: { bg: "bg-slate-400/15",  text: "text-slate-300",  border: "border-slate-400/25",  label: "2nd" },
  3: { bg: "bg-orange-600/15", text: "text-orange-400", border: "border-orange-600/25", label: "3rd" },
};

export function posMeta(pos) {
  return POSITION_META[pos] || {
    bg: "bg-white/[0.06]", text: "text-white/40", border: "border-white/[0.08]",
    label: `${pos}th`,
  };
}

// ── Entry Row (Mobile Optimized) ──────────────────────────────────────────────

function EntryRow({ entry, index }) {
  const pm    = posMeta(entry.position);
  const color = entry.teamId?.color || "#888";

  return (
    <div className={`flex items-center gap-2 px-3 py-3
      ${index !== 0 ? "border-t border-white/[0.045]" : ""}
      active:bg-white/[0.02] transition-colors duration-150`}
    >
      {/* Position Badge - Larger touch target */}
      <div className={`w-10 flex-shrink-0 text-center py-1.5 rounded-lg text-[12px] font-bold
        ${pm.bg} ${pm.text} border ${pm.border}`}>
        {pm.label}
      </div>
      
      {/* Name - Mobile font size */}
      <p className="flex-1 min-w-0 text-sm font-medium text-white/85 truncate">
        {entry.participantName}
      </p>
      
      {/* Team - Compact for mobile */}
      <div className="flex items-center gap-1.5 flex-shrink-0 max-w-[100px]">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[10px] text-white/40 truncate">{entry.teamId?.name || "—"}</span>
      </div>
      
      {/* Points - Larger for readability */}
      {/* <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-[14px] font-bold text-white/60 tabular-nums">
          {entry.points}
        </span>
        <span className="text-[8px] font-normal text-white/25 -mt-0.5">pts</span>
      </div> */}
    </div>
  );
}

// ── Mobile Optimized Result Card ─────────────────────────────────────────────

export default function ResultCard({ result, index = 0, onClick }) {
  const gm = groupMeta(result.group);
  const sortedEntries = [...(result.entries || [])].sort((a, b) => a.position - b.position);
  const hasMore = sortedEntries.length > 3;

  // Track touch start for ripple effect
  const handleTouchStart = (e) => {
    const target = e.currentTarget;
    target.style.transform = 'scale(0.98)';
  };

  const handleTouchEnd = (e) => {
    const target = e.currentTarget;
    target.style.transform = '';
  };

  const handleClick = () => {
    if (onClick) {
      // Add haptic feedback if supported
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      onClick(result);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group w-full text-left rounded-2xl overflow-hidden 
        bg-[#111111] border border-white/[0.07] 
        active:border-white/[0.12] transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-white/20
        cursor-pointer touch-manipulation"
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      <div className="relative">
        {/* Mobile touch feedback overlay */}
        <div className="absolute inset-0 opacity-0 active:opacity-100 
          bg-white/[0.03] pointer-events-none transition-opacity duration-100" />

        {/* Header - Optimized for thumbs */}
        <div className="flex items-center gap-3 px-3 py-3.5 bg-white/[0.03] 
          border-b border-white/[0.07] active:bg-white/[0.05] transition-colors">
          
          {/* Result Number - Larger tap area */}
          <div className="flex-shrink-0 min-w-[40px] h-8 flex items-center justify-center
            rounded-xl bg-white/[0.06] border border-white/[0.08]">
            <span className="text-[17px] font-bold text-white/60 tabular-nums">
              # {String(result.resultNumber).padStart(2, "0")}
            </span>
          </div>
          
          {/* Category Name - Mobile optimized */}
          <h3 className="flex-1 min-w-0 text-[17px] font-semibold text-white/90 truncate">
            {result.categoryName}
          </h3>
          
          {/* Group Badge - Larger for fat fingers */}
         <div className=" flex  justify-center items-center h-fit  gap-1">
           <span className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full
            border ${gm.bg} ${gm.text} ${gm.border}
            active:scale-95 transition-transform`}>
            {gm.short} 
          </span>
          <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />

         </div>
        </div>

        {/* Entries Preview - Top 3 optimized for mobile */}
        <div className="divide-y divide-white/[0.045]">
          {sortedEntries.slice(0, 3).map((entry, i) => (
            <EntryRow key={entry._id || i} entry={entry} index={i} />
          ))}
        </div>

        {/* More indicator - Touch friendly */}
        {hasMore && (
          <div className="px-3 py-3 border-t border-white/[0.04] 
            active:bg-white/[0.02] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/35">
                  +{sortedEntries.length - 3} more
                </span>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-white/30 flex items-center gap-1
                active:text-white/50 transition-colors">
                Tap to view all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" 
                  className="group-active:translate-x-0.5 transition-transform">
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" 
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Visual indicator for touch feedback */}
        <div className="absolute bottom-2 right-2 opacity-0 group-active:opacity-100 
          transition-opacity duration-100 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-ping" />
        </div>
      </div>
    </motion.button>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Images } from "lucide-react";

// ── Layout pattern — repeats every 9 items ───────────────────────────────────
// Grid is 3 columns. Each cell can span cols/rows.
// Pattern (0-based index within the 9-item tile):
//
//  ┌──────────┬────┬────┐
//  │          │  1 │  2 │  ← 0 = 2col×2row (featured), 1,2 = 1×1
//  │    0     ├────┼────┤
//  │          │  3 │  4 │  ← 3,4 = 1×1
//  ├────┬─────┴────┤    │
//  │  5 │    6     │    │  ← 5 = 1×1, 6 = 2col×1row, 4 extends
//  ├────┼────┬─────┤    │
//  │  7 │  8 │    │    │  ← wait, let's use a cleaner repeating pattern
//  └────┴────┴────┘

// Simpler proven pattern — 9-item tile that repeats:
// Items 0: col-span-2 row-span-2 (big)
// Items 1,2: 1×1
// Items 3,4: 1×1
// Item  5: col-span-2 row-span-1 (wide)
// Item  6: 1×1
// Items 7: col-span-1 row-span-2 (tall)
// Item  8: 1×1

const SPAN_PATTERN = [
  { col: 2, row: 1, }, // 0 — big featured
  { col: 1, row: 2 }, // 1
  { col: 1, row: 1 }, // 2
  { col: 1, row: 1 }, // 3
  { col: 1, row: 2 }, // 4
  { col: 2, row: 1 }, // 5 
  { col: 1, row: 1 }, // 6
  { col: 1, row: 1 }, // 7 
  { col: 1, row: 1 }, // 8
];

function getSpan(globalIndex) {
  return SPAN_PATTERN[globalIndex % SPAN_PATTERN.length];
}

// ── Single grid cell ──────────────────────────────────────────────────────────

export default function GridItem({ item, index, onClick }) {
  const span    = getSpan(index);
  const isVideo = item.mediaType === "cloudinary_video";
  const isYoutube = item.mediaType === "youtube";
  const [imgError, setImgError] = useState(false);

  // YouTube maxresdefault fallback
  const handleImgError = () => {
    if (item.thumbnailUrl?.includes("maxresdefault")) {
      // will trigger re-render with hqdefault via state
    }
    setImgError(true);
  };

  const thumbSrc = imgError && item.thumbnailUrl?.includes("maxresdefault")
    ? item.thumbnailUrl.replace("maxresdefault", "hqdefault")
    : item.thumbnailUrl;

  return (
    <button
      onClick={() => onClick(index)}
      className="relative w-full overflow-hidden bg-[#111] focus:outline-none group"
      style={{
        gridColumn: `span ${span.col}`,
        gridRow:    `span ${span.row}`,
        // maintain square unit cells — each unit is 33.3vw on mobile
        aspectRatio: span.col === span.row ? "1/1" : undefined,
      }}
    >
      {/* Thumbnail */}
      {thumbSrc && !imgError ? (
        <img
          src={thumbSrc}
          alt={item.caption || "Gallery item"}
          onError={handleImgError}
          className="absolute inset-0 w-full h-full object-cover
            transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#181818] flex items-center justify-center">
          <Play size={span.col > 1 ? 32 : 20} className="text-white/15" />
        </div>
      )}

      {/* Dark gradient — always present, stronger on featured */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Video play badge */}
      {isVideo &&  (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`rounded-full bg-black/50 backdrop-blur-sm border border-white/20
            flex items-center justify-center group-hover:scale-110 transition-transform duration-200
            ${span.col > 1 ? "w-14 h-14" : "w-9 h-9"}`}>
            <Play
              className={`text-white ml-0.5 ${span.col > 1 ? "w-5 h-5" : "w-3.5 h-3.5"}`}
              fill="white"
            />
          </div>
        </div>
      )}
         {/* YouTube badge */}
        {isYoutube &&  (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={`rounded-2xl bg-red-600/90 backdrop-blur-sm border border-red-600/50
            flex items-center justify-center group-hover:scale-110 transition-transform duration-200
            ${span.col > 1 ? "w-15 h-11" : "w-9 h-8"}`}>
            <Play

                className={`text-white ml-0.5 ${span.col > 1 ? "w-5 h-5" : "w-3.5 h-3.5"}`}
                fill="white"
            />
            </div>
        </div>
      )}

      {/* Caption on featured cell (col≥2) */}
      {span.col >= 2 && item.caption && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5
          bg-gradient-to-t from-black/80 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-[11px] text-white/80 font-medium line-clamp-2 leading-relaxed">
            {item.caption}
          </p>
        </div>
      )}
    </button>
  );
}

// ── Skeleton cell — exported for use in grid ───────────────────────────────────

export function SkeletonCell({ globalIndex }) {
  const span = getSpan(globalIndex);
  return (
    <div
      className="bg-white/[0.05] animate-pulse"
      style={{ gridColumn: `span ${span.col}`, gridRow: `span ${span.row}` }}
    />
  );
}

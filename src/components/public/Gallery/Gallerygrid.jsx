"use client";

import { useEffect, useRef } from "react";

import { Images }   from "lucide-react";
import GridItem from "./Griditem";
import GridSkeleton from "./Gridskeleton";

export default function GalleryGrid({
  items = [],
  loading,
  loadingMore,
  hasMore,
  total,
  onItemClick,
  onLoadMore,
}) {
  const loaderRef = useRef(null);

  // IntersectionObserver — fires onLoadMore when sentinel enters view
  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          <Images size={28} className="text-white/15" />
        </div>
        <p className="text-sm text-white/35">No gallery items yet</p>
      </div>
    );
  }

  // Each unit cell is 1/3 of the viewport width
  const CELL_SIZE = "calc(100vw / 3)";

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-3 gap-[1px] bg-[#1a1a1a]"
           style={{ gridAutoRows: CELL_SIZE }}>
        {loading ? (
          <GridSkeleton count={18} />
        ) : (
          <>
            {items.map((item, i) => (
              <GridItem
                key={item._id}
                item={item}
                index={i}
                onClick={onItemClick}
              />
            ))}
            {loadingMore && <GridSkeleton count={3} />}
          </>
        )}
      </div>

      {/* Sentinel / end state */}
      {!loading && (
        <div ref={loaderRef} className="py-8 flex items-center justify-center">
          {!hasMore && items.length > 0 ? (
            <p className="text-[11px] text-white/25 text-center">
              You've seen everything · {total ?? items.length} items
            </p>
          ) : loadingMore ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/15 border-t-white/50 animate-spin" />
          ) : null}
        </div>
      )}
    </div>
  );
}
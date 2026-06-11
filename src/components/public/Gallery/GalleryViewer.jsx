"use client";

import { useEffect, useRef, useState, useCallback, createRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ViewerItem from "./Vieweritem";

export default function GalleryViewer({
  isOpen,
  items = [],
  startIndex,
  onClose,
  onNearEnd,    // called when within 3 of end — triggers load more
  total,
}) {
  const scrollRef               = useRef(null);
  const itemRefs                = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(startIndex ?? 0);

  // Keep itemRefs in sync with items length
  useEffect(() => {
    itemRefs.current = items.map((_, i) => itemRefs.current[i] ?? createRef());
  }, [items.length]);

  // Scroll to startIndex when viewer opens or startIndex changes
  useEffect(() => {
    if (!isOpen) return;
    const idx = startIndex ?? 0;
    setCurrentIndex(idx);
    // small delay ensures refs are painted
    const t = setTimeout(() => {
      itemRefs.current[idx]?.current?.scrollIntoView({ behavior: "instant" });
    }, 40);
    return () => clearTimeout(t);
  }, [isOpen, startIndex]);

  // Lock body scroll while viewer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleVisible = useCallback((index) => {
    setCurrentIndex(index);
    // Trigger load more when near end
    if (index >= items.length - 3) onNearEnd?.();
  }, [items.length, onNearEnd]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* ── Top bar ── */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between
            px-4 pt-safe-top pt-4 pb-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-none">
              <ImageIcon size={14} className="text-white/50" />
              <span className="text-sm font-semibold text-white/70 tabular-nums">
                {currentIndex + 1}
                <span className="text-white/35 font-normal"> / {total ?? items.length}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="pointer-events-auto w-9 h-9 flex items-center justify-center
                rounded-full bg-black/50 backdrop-blur-sm border border-white/15
                hover:bg-black/70 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* ── Scroll container — snap ── */}
          <div
            ref={scrollRef}
            className="w-full h-full overflow-y-scroll"
            style={{
              scrollSnapType:    "y mandatory",
              scrollbarWidth:    "none",
              msOverflowStyle:   "none",
            }}
          >
            {items.map((item, i) => (
              <ViewerItem
                key={item._id}
                item={item}
                index={i}
                itemRef={itemRefs.current[i] ?? createRef()}
                onVisible={handleVisible}
              />
            ))}

            {/* Loading more indicator */}
            <div className="h-20 flex items-center justify-center flex-shrink-0">
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
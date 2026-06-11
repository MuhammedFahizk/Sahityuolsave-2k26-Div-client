"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Reusable BottomSheet / Modal
 *
 * Props:
 *   isOpen      boolean          – controls visibility
 *   onClose     () => void       – called on backdrop click or close button
 *   title       string           – header title (optional)
 *   accentColor string           – hex color used for the top accent bar (optional)
 *   maxHeight   string           – tailwind max-h-* class, default "max-h-[88vh]"
 *   children    ReactNode        – sheet body content
 *   showHandle  boolean          – show drag handle pill at top (default true)
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  accentColor,
  maxHeight = "max-h-[88vh]",
  children,
  showHandle = true,
}) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="bs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* ── Sheet ── */}
          <motion.div
            key="bs-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-[#0f0f0f] border-t border-white/[0.07] overflow-hidden"
          >
            {/* Accent bar */}
            {accentColor && (
              <div
                className="h-[3px] w-full flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              />
            )}

            {/* Drag handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] flex-shrink-0">
                <span className="text-sm font-semibold tracking-wide text-white/90">
                  {title}
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.13] transition-colors"
                >
                  <X size={15} className="text-white/60" />
                </button>
              </div>
            )}

            {/* Body — scrollable */}
            <div className={`overflow-y-auto ${maxHeight} overscroll-contain`}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
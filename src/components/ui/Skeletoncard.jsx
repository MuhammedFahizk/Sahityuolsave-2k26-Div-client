"use client";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111111]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
        <div className="w-9 h-7 rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="flex-1 h-4 rounded-md bg-white/[0.06] animate-pulse" />
        <div className="w-10 h-6 rounded-full bg-white/[0.06] animate-pulse" />
      </div>
      {/* Rows */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-t border-white/[0.04]">
          <div className="w-10 h-6 rounded-md bg-white/[0.05] animate-pulse" />
          <div className="flex-1 h-3 rounded bg-white/[0.05] animate-pulse" />
          <div className="w-20 h-3 rounded bg-white/[0.04] animate-pulse" />
          <div className="w-10 h-3 rounded bg-white/[0.04] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
"use client";

export default function GridSkeleton({ count = 18 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square w-full bg-white/[0.05] animate-pulse"
        />
      ))}
    </>
  );
}
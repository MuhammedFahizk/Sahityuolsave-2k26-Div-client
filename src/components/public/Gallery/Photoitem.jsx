"use client";

export default function PhotoItem({ item }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <img
        src={item.url}
        alt={item.caption || "Photo"}
        className="max-w-full max-h-full object-contain"
        draggable={false}
      />
    </div>
  );
}
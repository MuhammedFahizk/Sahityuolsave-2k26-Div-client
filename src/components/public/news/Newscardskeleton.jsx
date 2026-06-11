export default function NewsCardSkeleton() {
  return (
    <div
      className="flex gap-0 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(200,241,53,0.10)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
      }}
    >
      {/* Left image skeleton */}
      <div className="flex-shrink-0 p-[5px]" style={{ width: "36%" }}>
        <div
          className="w-full rounded-[10px] skeleton-shimmer"
          style={{ minHeight: 100 }}
        />
      </div>

      {/* Right content skeleton */}
      <div className="flex flex-col justify-between py-3 pr-3 pl-1 flex-1 gap-2">
        <div className="flex flex-col gap-2">
          {/* Category pill */}
          <div className="skeleton-shimmer rounded-full h-4 w-20" />
          {/* Title lines */}
          <div className="skeleton-shimmer rounded h-3.5 w-full" />
          <div className="skeleton-shimmer rounded h-3.5 w-4/5" />
          {/* Preview lines */}
          <div className="skeleton-shimmer rounded h-3 w-full" />
          <div className="skeleton-shimmer rounded h-3 w-3/5" />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center mt-1">
          <div className="skeleton-shimmer rounded h-3 w-20" />
          <div className="skeleton-shimmer rounded h-3 w-10" />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import VideoItem from "./Videoitem";
import PhotoItem from "./Photoitem";
import YoutubeItem from "./YoutubeItem";


export default function ViewerItem({ item, itemRef, onVisible, index }) {
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = itemRef?.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) onVisible(index);
      },
      { threshold: 0.6 }
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, [itemRef, index, onVisible]);

  const renderContent = () => {
    switch (item.mediaType) {
      case "photo":
        return <PhotoItem item={item} />;
      case "youtube":
        return <YoutubeItem item={item} isVisible={isVisible} />;
      case "cloudinary_video":
        return <VideoItem item={item} isVisible={isVisible} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={itemRef}
      className="relative w-full flex-shrink-0 flex flex-col"
      style={{ height: "100dvh", scrollSnapAlign: "start" }}
    >
      {/* Media content — fills all space above caption */}
      <div className="flex-1 relative overflow-hidden">
        {renderContent()}
      </div>

      {/* Caption overlay — gradient from bottom */}
      {(item.caption || item.album) && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-20
          bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
          {item.caption && (
            <p className="text-sm text-white/90 font-medium leading-relaxed mb-2">
              {item.caption}
            </p>
          )}
          <div className="flex items-center gap-2">
            {item.album && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                bg-white/15 backdrop-blur-sm text-white/70 border border-white/10">
                {item.album}
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
              bg-white/10 backdrop-blur-sm text-white/50 border border-white/[0.07] capitalize">
              {item.type === "cloudinary_video" ? "Video" : item.type === "youtube" ? "YouTube" : "Photo"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
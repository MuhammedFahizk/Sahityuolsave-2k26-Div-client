"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

// ── Skeleton ─────────────────────────────────────────────────────────────────

function VideoSkeleton({ thumbnailUrl }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
      {/* Thumbnail as blurred background if available */}
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105"
          aria-hidden
        />
      )}

      {/* Shimmer bar overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]
            bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        />
      </div>

      {/* Centered play icon placeholder */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-white/[0.08] border border-white/[0.10]
          flex items-center justify-center">
          <Play size={22} className="text-white/30 ml-1" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-2.5 w-40 rounded-full bg-white/[0.07] animate-pulse" />
          <div className="h-2 w-24 rounded-full bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VideoItem({ item, isVisible }) {
  const videoRef        = useRef(null);
  const [muted, setMuted]         = useState(true);
  const [playing, setPlaying]     = useState(false);
  const [ready, setReady]         = useState(false); // New state for loading

  // Autoplay / pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Only attempt to play if the video is ready
    if (isVisible && ready) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isVisible]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Skeleton — shown until video fires onLoadedData */}
      {!ready && <VideoSkeleton thumbnailUrl={item.thumbnailUrl} />}

      <video
        ref={videoRef}
        src={item.url}
        muted
        loop
        playsInline
        className="max-w-full max-h-full object-contain transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }} // Fade in the video
        // Set ready to true when enough data has loaded to play
        onLoadedData={() => setReady(true)}
      />

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-24 right-4 w-10 h-10 rounded-full
          bg-black/50 backdrop-blur-sm border border-white/20
          flex items-center justify-center transition-opacity hover:opacity-90"
      >
        {muted
          ? <VolumeX size={16} className="text-white" />
          : <Volume2 size={16} className="text-white" />
        }
      </button>
    </div>
  );
}
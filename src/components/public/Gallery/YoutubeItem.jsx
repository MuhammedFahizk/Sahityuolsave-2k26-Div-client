"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/embed\/([^?&/]+)/,
    /[?&]v=([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function postCommand(iframe, command) {
  if (!iframe) return;
  try {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "https://www.youtube.com"
    );
  } catch {}
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function YoutubeSkeleton({ thumbnailUrl }) {
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

export default function YoutubeItem({ item, isVisible }) {
  const iframeRef          = useRef(null);
  const videoId            = extractYouTubeId(item.url);
  const [ready, setReady]  = useState(false);   // true once iframe fires onLoad

  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&mute=1&playsinline=1`
    : null;

  // Play / pause via postMessage once iframe is ready
  useEffect(() => {
    if (!ready || !videoId) return;
    const iframe = iframeRef.current;
    const t = setTimeout(() => {
      postCommand(iframe, isVisible ? "playVideo" : "pauseVideo");
    }, 300);
    return () => clearTimeout(t);
  }, [isVisible, videoId, ready]);

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white/30 text-sm text-center px-6">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>

        {/* Skeleton — shown until iframe fires onLoad */}
        {!ready && <YoutubeSkeleton thumbnailUrl={item.thumbnailUrl} />}

        {/* iframe — invisible until loaded, then fades in */}
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full transition-opacity duration-500"
          style={{ opacity: ready ? 1 : 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={item.caption || "YouTube video"}
          onLoad={() => setReady(true)}
        />
      </div>
    </div>
  );
}
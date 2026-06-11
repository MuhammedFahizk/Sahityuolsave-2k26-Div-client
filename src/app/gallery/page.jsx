"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion }    from "framer-motion";
import { RefreshCw } from "lucide-react";

import { get }       from "@/utils/api";
import GalleryViewer from "@/components/public/Gallery/GalleryViewer";
import GalleryGrid from "@/components/public/Gallery/Gallerygrid";

const PAGE_SIZE = 18;

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/[0.07] flex items-center justify-center mb-4">
        <RefreshCw size={22} className="text-red-400/40" />
      </div>
      <p className="text-sm text-white/40 mb-1">Failed to load gallery</p>
      <p className="text-xs text-white/25 mb-5 max-w-[220px]">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl
          bg-white/[0.06] border border-white/[0.08] text-white/40
          hover:bg-white/[0.10] transition-colors"
      >
        <RefreshCw size={11} /> Try again
      </button>
    </div>
  );
}

export default function GalleryPage() {
  const [items, setItems]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [pagination, setPagination]   = useState({ hasMore: true, total: 0, photoCount: 0, videoCount: 0 });

  const pageRef    = useRef(1);
  const fetchingRef = useRef(false); // guard against double-fetch

  // Viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  // ── Fetch one page from /feed ──
  const fetchPage = useCallback(async (page, isFirst = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      if (isFirst) setLoading(true);
      else         setLoadingMore(true);
      setError(null);

      const res = await get(`/api/gallery/feed?page=${page}&limit=${PAGE_SIZE}`);

      // API returns: { success, data: [...], pagination: { hasMore, total, photoCount, videoCount } }
      const incoming = res.data        || [];
      const pag      = res.pagination  || {};

      setItems(prev => isFirst ? incoming : [...prev, ...incoming]);
      setPagination({
        hasMore:    pag.hasMore    ?? false,
        total:      pag.total      ?? 0,
        photoCount: pag.photoCount ?? 0,
        videoCount: pag.videoCount ?? 0,
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      if (isFirst) setLoading(false);
      else         setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => { fetchPage(1, true); }, []); // eslint-disable-line

  // Load next page
  const loadMore = useCallback(() => {
    if (fetchingRef.current || !pagination.hasMore) return;
    pageRef.current += 1;
    fetchPage(pageRef.current, false);
  }, [pagination.hasMore, fetchPage]);

  // Viewer handlers
  const openViewer  = useCallback((index) => { setStartIndex(index); setViewerOpen(true);  }, []);
  const closeViewer = useCallback(() => setViewerOpen(false), []);

  const retry = useCallback(() => {
    pageRef.current = 1;
    fetchPage(1, true);
  }, [fetchPage]);

  // Subtitle
  const subtitleParts = [];
  if (pagination.photoCount > 0) subtitleParts.push(`${pagination.photoCount} photos`);
  if (pagination.videoCount > 0) subtitleParts.push(`${pagination.videoCount} videos`);

  return (
    <div className="min-h-screen  text-white">

      {/* ── Header ── */}
      <div className="px-4 pt-10 pb-5">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
          <p className="text-sm text-white/30 mt-0.5">
            {loading
              ? "Loading…"
              : subtitleParts.length
                ? subtitleParts.join(" · ")
                : "Festival moments"
            }
          </p>
        </motion.div>
      </div>

      {/* ── Content ── */}
      {error && !loading ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <GalleryGrid
          items={items}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={pagination.hasMore}
          total={pagination.total}
          onItemClick={openViewer}
          onLoadMore={loadMore}
        />
      )}

      {/* ── Fullscreen Viewer ── */}
      <GalleryViewer
        isOpen={viewerOpen}
        items={items}
        startIndex={startIndex}
        onClose={closeViewer}
        onNearEnd={loadMore}
        total={pagination.total}
      />
    </div>
  );
}
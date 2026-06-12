"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Newspaper } from "lucide-react";

import { get } from "@/utils/api";
import NewsCard from "@/components/public/news/Newscard";
import NewsCardSkeleton from "@/components/public/news/Newscardskeleton";

/* ── Constants ───────────────────────────────────────────────────────── */
const LIMIT = 10;
const CATEGORIES = ["All", "Announcement", "Update", "Result", "General"];

const GREEN       = "#C8F135";
const GREEN_FAINT = "rgba(200,241,53,0.08)";
const GREEN_LINE  = "rgba(200,241,53,0.18)";

/* ══════════════════════════════════════════════════════════════════════ */
export default function NewsPage() {
  const [posts, setPosts]           = useState([]);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]           = useState(null);
  const [activeCat, setActiveCat]   = useState("All");

  const loaderRef    = useRef(null);
  const fetchingRef  = useRef(false);

  /* ── Fetch ─────────────────────────────────────────────────────────── */
  const fetchPosts = useCallback(
    async (pageNum, append = false) => {
      if (fetchingRef.current) return;
      try {
        fetchingRef.current = true;
        const catParam = activeCat === "All" ? "" : `&category=${activeCat}`;
        const res = await get(`/api/news/public?page=${pageNum}&limit=${LIMIT}${catParam}`);
        if (append) {
          setPosts((prev) => [...prev, ...res.data]);
        } else {
          setPosts(res.data);
        }
        setTotal(res.total);
        setHasMore(pageNum < res.pages);
        setPage(pageNum);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load news");
      } finally {
        fetchingRef.current = false;
      }
    },
    [activeCat]
  );

  /* ── Reset on category change ───────────────────────────────────── */
  useEffect(() => {
    const resetAndFetch = async () => {
      setLoading(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setError(null);
      await fetchPosts(1, false);
      setLoading(false);
    };
    resetAndFetch();
  }, [activeCat, fetchPosts]);

  /* ── Infinite scroll observer ───────────────────────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !loadingMore && !fetchingRef.current) {
          setLoadingMore(true);
          await fetchPosts(page + 1, true);
          setLoadingMore(false);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => { if (currentLoader) observer.unobserve(currentLoader); };
  }, [hasMore, loading, loadingMore, page, fetchPosts]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchPosts(1, false).finally(() => setLoading(false));
  };

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen pb-28 pt-20"
      style={{ backgroundColor: "#050c1a" }}
    >
      {/* ── circuit dot grid bg ── */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" aria-hidden
        style={{ zIndex: 0, opacity: 0.13 }}>
        <defs>
          <pattern id="dots-news" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <rect x="17.5" y="17.5" width="1" height="1" fill="rgba(40,90,255,0.7)" rx="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-news)"/>
      </svg>

      {/* ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ zIndex: 0, background: "radial-gradient(ellipse, rgba(30,70,255,0.10) 0%, transparent 70%)" }}/>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="relative z-10 px-5 pt-6 pb-5">
        {/* green top accent line */}
        <div style={{
          height: "1px", marginBottom: "20px",
          background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
          opacity: 0.4,
        }}/>

        <div className="flex items-end justify-between">
          <div>
           
            <h1 className="text-3xl font-display leading-none tracking-tight text-white">
              News
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.38)" }}>
              Latest updates &amp; announcements
            </p>
          </div>

          {/* total badge */}
          {total > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-xl px-3 py-2"
              style={{
                background: GREEN_FAINT,
                border: `0.5px solid ${GREEN_LINE}`,
              }}
            >
              <span className="text-[22px] font-bold leading-none"
                style={{
                  background: `linear-gradient(160deg,${GREEN} 20%,#a8d020 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{total}</span>
              <span className="text-[8px] tracking-[0.2em] uppercase mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}>posts</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Category Filter Pills ────────────────────────────────────── */}
      <div
        className="relative z-10 flex gap-2 px-5 pb-5 overflow-x-auto hide-scrollbar"
      >
        {CATEGORIES.map((cat) => {
          const active = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-wide transition-all duration-200 active:scale-95"
              style={{
                background: active
                  ? "linear-gradient(135deg,#daf76a 0%,#C8F135 50%,#a8d020 100%)"
                  : "rgba(255,255,255,0.04)",
                color: active ? "#050c1a" : "rgba(255,255,255,0.5)",
                border: active ? "none" : `0.5px solid ${GREEN_LINE}`,
                boxShadow: active ? "0 2px 12px rgba(200,241,53,0.25)" : "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-5 flex flex-col gap-3">

        {/* Loading — first page skeletons */}
        {loading && (
          <>
            {[...Array(4)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: GREEN_FAINT, border: `0.5px solid ${GREEN_LINE}` }}>
              <Newspaper size={20} style={{ color: GREEN, opacity: 0.7 }}/>
            </div>
            <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#daf76a 0%,#C8F135 50%,#a8d020 100%)",
                color: "#050c1a",
                boxShadow: "0 2px 16px rgba(200,241,53,0.22)",
              }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Posts list */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {posts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
              >
                {/* empty icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: GREEN_FAINT, border: `0.5px solid ${GREEN_LINE}` }}>
                  <Newspaper size={28} style={{ color: GREEN, opacity: 0.6 }}/>
                </div>

                {activeCat === "All" ? (
                  <>
                    <p className="text-base font-semibold text-white">No news yet</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Check back soon for updates
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-white">
                      No posts in this category
                    </p>
                    <button
                      onClick={() => setActiveCat("All")}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                      style={{
                        background: "linear-gradient(135deg,#daf76a 0%,#C8F135 50%,#a8d020 100%)",
                        color: "#050c1a",
                        boxShadow: "0 2px 16px rgba(200,241,53,0.22)",
                      }}
                    >
                      View all posts
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {posts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i < 6 ? i * 0.06 : 0 }}
                  >
                    <NewsCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Loading more skeletons */}
        {loadingMore && (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        )}

        {/* Infinite scroll trigger */}
        {!loading && hasMore && posts.length > 0 && (
          <div ref={loaderRef} className="h-8" />
        )}

        {/* All caught up */}
        {!loading && !hasMore && posts.length > 0 && (
          <div className="flex flex-col items-center py-6 gap-2">
            <div style={{
              width: "40px", height: "1px",
              background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
              opacity: 0.4,
            }}/>
            <p className="text-[11px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              All caught up · {total} {total === 1 ? "post" : "posts"}
            </p>
            <div style={{
              width: "40px", height: "1px",
              background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
              opacity: 0.4,
            }}/>
          </div>
        )}
      </div>
    </div>
  );
}
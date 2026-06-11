"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, RefreshCw, Calendar, Eye, Clock } from "lucide-react";

import { get } from "@/utils/api";
import NewsCard from "@/components/public/news/Newscard";
import ProseContent from "@/components/public/news/Prosecontent";

/* ── Category pill colours ───────────────────────────────────────────── */
const CATEGORY_STYLES = {
  Announcement: { bg: "#E6F1FB", text: "#185FA5", border: "#185FA5" },
  Update: { bg: "#FAEEDA", text: "#854F0B", border: "#854F0B" },
  Result: { bg: "#EAF3DE", text: "#3B6D11", border: "#3B6D11" },
  General: { bg: "#F3F4F6", text: "#6B7280", border: "#9CA3AF" },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatReadTime(content) {
  // Remove HTML tags and count words
  const text = content?.replace(/<[^>]*>/g, '') || '';
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/* ── Skeleton for single post ─────────────────────────────────────────── */
function PostSkeleton() {
  return (
    <div className="px-4 pt-4 flex flex-col gap-4">
      <div className="skeleton-shimmer rounded-xl w-full" style={{ height: 220 }} />
      <div className="skeleton-shimmer rounded-full h-6 w-24" />
      <div className="flex flex-col gap-2">
        <div className="skeleton-shimmer rounded h-7 w-full" />
        <div className="skeleton-shimmer rounded h-7 w-3/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="skeleton-shimmer rounded h-4 w-28" />
        <div className="skeleton-shimmer rounded h-4 w-20" />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-shimmer rounded h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function SinglePostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await get(`/api/news/${id}`);
      const data = res.data;
      setPost(data);

      const relRes = await get(`/api/news/public?category=${data.category}&limit=5`);
      const relatedFiltered = relRes.data
        .filter((p) => p._id !== id)
        .slice(0, 3);
      setRelated(relatedFiltered);
    } catch (err) {
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.title,
          url: window.location.href,
        });
      } catch (_) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  const catStyle = CATEGORY_STYLES[post?.category] || CATEGORY_STYLES.General;

  return (
    <div
      className="min-h-screen pt-20"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Sticky Top Bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: "var(--bg-base)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <button
          onClick={() => router.push("/news")}
          className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-70"
          style={{ color: "#185FA5" }}
        >
          <ArrowLeft size={18} />
          Back to News
        </button>

        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          News
        </span>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-full transition-all hover:bg-black/5"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Loading */}
      {loading && <PostSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(24, 95, 165, 0.1)" }}>
            <RefreshCw size={32} style={{ color: "#185FA5" }} />
          </div>
          <p className="text-base text-center" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <button
            onClick={fetchPost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#185FA5" }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Post not found */}
      {!loading && !error && !post && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(24, 95, 165, 0.1)" }}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#185FA5" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Post not found
          </p>
          <button
            onClick={() => router.push("/news")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#185FA5" }}
          >
            ← Browse All News
          </button>
        </div>
      )}

      {/* Post content */}
      {!loading && !error && post && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pb-16"
        >
          {/* Cover Image */}
          {post.coverImageUrl && (
            <div className="relative w-full px-4 mt-4 rounded-xl overflow-hidden">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full object-cover"
                style={{ height: "clamp(250px, 40vh, 400px)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, var(--bg-base) 100%)",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="px-4" style={{ marginTop: post.coverImageUrl ? "-30px" : "0" }}>
            <div
              className="rounded-t-2xl px-4 pt-6 pb-8"
              style={{
                backgroundColor: "var(--bg-base)",
                borderRadius: "24px 24px 0 0",
              }}
            >
              {/* Category */}
              <div className="mb-4">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-semibold"
                  style={{
                    backgroundColor: catStyle.bg,
                    color: catStyle.text,
                  }}
                >
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[28px] md:text-[32px] font-bold leading-tight mb-4 break-words"
                style={{ color: "var(--text-primary)" }}
              >
                {post.title}
              </h1>

              {/* Meta Info */}
              <div
                className="flex flex-wrap items-center gap-4 pt-2 pb-6 mb-6"
                style={{ borderBottom: "1px solid var(--border-default)" }}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: "var(--text-muted)" }} />
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: "var(--text-muted)" }} />
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {formatReadTime(post.content)}
                  </span>
                </div>
                
              </div>

              {/* Rich Text Content */}
              <div className="mt-4">
                <ProseContent html={post.content} />
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-10 px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Related Articles
                </h2>
                <button
                  onClick={() => router.push("/news")}
                  className="text-sm font-medium transition-all hover:opacity-70"
                  style={{ color: "#185FA5" }}
                >
                  View All →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {related.map((p) => (
                  <NewsCard key={p._id} post={p} />
                ))}
              </div>
            </div>
          )}
        </motion.article>
      )}

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-lg z-50"
          style={{ backgroundColor: "#185FA5" }}
        >
          Link copied to clipboard!
        </motion.div>
      )}
    </div>
  );
}
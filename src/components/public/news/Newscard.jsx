"use client";

import Link          from "next/link";
import { Newspaper } from "lucide-react";
import { motion }    from "framer-motion";

/* ── Category pill colours ─────────────────────────────────────────── */
const CATEGORY_STYLES = {
  Announcement: { bg: "rgba(200,241,53,0.10)", text: "#C8F135",  border: "rgba(200,241,53,0.25)" },
  Update:       { bg: "rgba(40,90,255,0.10)",  text: "#7EB3FF",  border: "rgba(40,90,255,0.25)"  },
  Result:       { bg: "rgba(200,241,53,0.07)", text: "#a8d020",  border: "rgba(200,241,53,0.18)" },
  General:      { bg: "rgba(255,255,255,0.05)",text: "rgba(255,255,255,0.45)", border: "rgba(255,255,255,0.12)" },
};

function CategoryPill({ category }) {
  const s = CATEGORY_STYLES[category] || CATEGORY_STYLES.General;
  return (
    <span
      className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full leading-tight tracking-wide uppercase"
      style={{ backgroundColor: s.bg, color: s.text, border: `0.5px solid ${s.border}` }}
    >
      {category}
    </span>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── NewsCard ───────────────────────────────────────────────────────── */
export default function NewsCard({ post, index = 0 }) {
  const { _id, title, preview, category, coverImageUrl, createdAt } = post;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/news/${_id}`} className="block no-underline">
        <div
          className="flex gap-0 rounded-2xl overflow-hidden active:scale-[0.985] transition-transform"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(200,241,53,0.12)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
          }}
        >
          {/* LEFT — Image */}
          <div className="flex-shrink-0 p-[5px]" style={{ width: "36%" }}>
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt={title}
                className="w-full h-full object-cover rounded-[10px]"
                style={{ minHeight: 96, maxHeight: 120 }}
              />
            ) : (
              <div
                className="w-full rounded-[10px] flex items-center justify-center"
                style={{
                  minHeight: 96,
                  maxHeight: 120,
                  height: "100%",
                  background: "rgba(200,241,53,0.05)",
                  border: "0.5px solid rgba(200,241,53,0.12)",
                }}
              >
                <Newspaper size={24} style={{ color: "rgba(200,241,53,0.35)" }} />
              </div>
            )}
          </div>

          {/* RIGHT — Content */}
          <div
            className="flex flex-col justify-between py-3 pr-3 pl-1"
            style={{ width: "64%" }}
          >
            <div className="flex flex-col gap-1.5">
              <CategoryPill category={category} />
              <p
                className="text-[13px] font-semibold leading-snug mt-0.5"
                style={{
                  color: "rgba(255,255,255,0.88)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </p>
              {preview && (
                <p
                  className="text-[11.5px] leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.38)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {preview}
                </p>
              )}
            </div>

            {/* Date + Read more */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                {formatDate(createdAt)}
              </span>
              <span
                className="text-[11px] font-semibold tracking-wide"
                style={{ color: "#C8F135" }}
              >
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Share2, Trophy, Medal, ExternalLink,
  Calendar, Crown, Award, Loader2, ImageIcon,
} from "lucide-react";
import { get } from "@/utils/api";

// ── Constants ─────────────────────────────────────────────────────────────────

const MEDAL_ICONS = {
  1: { icon: Crown, color: "text-amber-400",  bg: "from-amber-500/10 to-amber-600/5"  },
  2: { icon: Medal, color: "text-gray-300",   bg: "from-gray-400/10 to-gray-500/5"    },
  3: { icon: Medal, color: "text-amber-600",  bg: "from-amber-700/10 to-amber-800/5"  },
  4: { icon: Award, color: "text-blue-400",   bg: "from-blue-500/10 to-blue-600/5"    },
};

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function getPositionDisplay(p) {
  if (p === 1) return "🥇";
  if (p === 2) return "🥈";
  if (p === 3) return "🥉";
  return `#${p}`;
}

// ── Shared canvas helpers ─────────────────────────────────────────────────────
// MUST stay identical to admin-templates-page.jsx resolveX + drawWinnersOnCtx

function resolveX(align, x, canvasWidth) {
  if (align === "center") return canvasWidth / 2;
  if (align === "right")  return canvasWidth - x;
  return x; // left
}

/**
 * Draw winners block: for each winner, draws
 *   Line 1 (Y = slotY):           "position. participantName"   — w.color, w.fontSize, bold
 *   Line 2 (Y = slotY + lineGap): "teamName"                    — w.teamColor, w.teamFontSize, normal
 * Slots are spaced w.gapY apart.
 */
function drawWinnersOnCtx(ctx, w, entries, canvasWidth) {
  if (!w || !entries?.length) return;
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  sorted.forEach((winner, i) => {
    const slotY = w.startY + i * (w.gapY || 80);
    const nameX = resolveX(w.textAlign, w.startX, canvasWidth);
    // Participant name
    ctx.save();
    ctx.font         = `bold ${w.fontSize || 28}px "Poppins", "Segoe UI", system-ui`;
    ctx.fillStyle    = w.color || "#FFD700";
    ctx.textAlign    = w.textAlign || "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(`${winner.position}. ${winner.participantName}`, nameX, slotY);
    ctx.restore();

    // Team name
    const teamName = winner.teamId?.name || winner.team || "shdfhsoef";
    if (teamName) {
      ctx.save();
      ctx.font         = `normal ${w.teamFontSize || 20}px "Poppins", "Segoe UI", system-ui`;
      ctx.fillStyle    = w.teamColor || "#ffffff";
      ctx.textAlign    = w.textAlign || "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(teamName, nameX, slotY + (w.lineGap || 28));
      ctx.restore();
    }
  });
}

async function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

export async function generatePosterOnCanvas(template, result) {
  const bgImage = await loadImg(template.imagePath);
  const canvas  = document.createElement("canvas");
  canvas.width  = bgImage.naturalWidth;
  canvas.height = bgImage.naturalHeight;
  const ctx     = canvas.getContext("2d");
  const W       = canvas.width;

  // Background
  ctx.drawImage(bgImage, 0, 0, W, canvas.height);

  // Result Number
  const rn = template.resultNumber;
  if (rn) {
    ctx.save();
    ctx.font         = `${rn.fontWeight || "normal"} ${rn.fontSize || 40}px "Poppins", "Segoe UI", system-ui`;
    ctx.fillStyle    = rn.color || "#ffffff";
    ctx.textAlign    = rn.textAlign || "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
      String(result.resultNumber).padStart(2, "0"),
      resolveX(rn.textAlign, rn.x, W),
      rn.y
    );
    ctx.restore();
  }

  // Category Name
  const cn = template.categoryName;
  if (cn) {
    ctx.save();
    ctx.font         = `${cn.fontWeight || "normal"} ${cn.fontSize || 32}px "Poppins", "Segoe UI", system-ui`;
    ctx.fillStyle    = cn.color || "#ffffff";
    ctx.textAlign    = cn.textAlign || "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
      result.categoryName || "",
      resolveX(cn.textAlign, cn.x, W),
      cn.y
    );
    ctx.restore();
  }

  // Group
  const gr = template.group;
  if (gr && result.group) {
    ctx.save();
    ctx.font         = `${gr.fontWeight || "normal"} ${gr.fontSize || 24}px "Poppins", "Segoe UI", system-ui`;
    ctx.fillStyle    = gr.color || "#ffffff";
    ctx.textAlign    = gr.textAlign || "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(
      result.group,
      resolveX(gr.textAlign, gr.x, W),
      gr.y
    );
    ctx.restore();
  }

  // Winners — name + team stacked (shared helper)
  drawWinnersOnCtx(ctx, template.winners, result.entries, W);
  console.log("Poster " , template.winners)
  return canvas;
}

// ── Template Selector ─────────────────────────────────────────────────────────

function TemplateSelector({ templates, selected, onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
        Choose template
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {templates.map((t) => (
          <button
            key={t._id}
            onClick={() => onSelect(t)}
            className={`flex-shrink-0 relative w-16 h-20 rounded-xl overflow-hidden border-2
              transition-all duration-200 focus:outline-none
              ${selected?._id === t._id
                ? "border-amber-400/70 scale-105"
                : "border-white/[0.08] hover:border-white/25"}`}
          >
            <Image
              src={t.imagePath} alt={t.name} fill
              className="object-cover"
              unoptimized={t.imagePath.includes("cloudinary.com")}
            />
            {selected?._id === t._id && (
              <div className="absolute inset-0 bg-amber-400/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="#000" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Generated Poster Preview ──────────────────────────────────────────────────

function GeneratedPoster({ dataUrl, onDownload, onShare, downloading, sharing }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
        Result Poster 
      </h3>
      <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt="Generated poster" className="w-full h-auto object-cover" />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onDownload} disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold
            hover:bg-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          Download
        </button>
        <button
          onClick={onShare} disabled={sharing}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-white/[0.05] border border-white/[0.08] text-white/50 text-xs font-semibold
            hover:bg-white/[0.09] active:scale-95 transition-all disabled:opacity-50"
        >
          {sharing ? <Loader2 size={13} className="animate-spin" /> : <Share2 size={13} />}
          Share
        </button>
      </div>
    </div>
  );
}

// ── Main Sheet ────────────────────────────────────────────────────────────────

export default function ResultDetailSheet({ result, isOpen, onClose }) {

  const [shareSuccess,    setShareSuccess]    = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [imageError,      setImageError]      = useState(false);

  const [templates,        setTemplates]        = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generating,       setGenerating]       = useState(false);
  const [generatedDataUrl, setGeneratedDataUrl] = useState(null);
  const [generateError,    setGenerateError]    = useState(null);
  const [downloading,      setDownloading]      = useState(false);
  const [sharing,          setSharing]          = useState(false);

  const hasServerImage = result?.resultUrl && result.resultUrl.trim() !== "" && !imageError;
  const needsTemplate  = result && !hasServerImage;

  useEffect(() => {
    setImageError(false);
    setGeneratedDataUrl(null);
    setGenerateError(null);
    setSelectedTemplate(null);
  }, [result?._id]);

  useEffect(() => {
    if (!isOpen || !needsTemplate || templates.length > 0) return;
    setTemplatesLoading(true);
    get("/api/templates")
      .then((res) => {
        const active = (res.data || []).filter((t) => t.active !== false);
        setTemplates(active);
        if (active.length > 0) setSelectedTemplate(active[0]);
      })
      .catch(() => {})
      .finally(() => setTemplatesLoading(false));
  }, [isOpen, needsTemplate]); // eslint-disable-line

  useEffect(() => {
    if (!selectedTemplate || !result) return;
    setGenerating(true);
    setGenerateError(null);
    setGeneratedDataUrl(null);

    generatePosterOnCanvas(selectedTemplate, result)
      .then((canvas) => setGeneratedDataUrl(canvas.toDataURL("image/png")))
      .catch((err)   => setGenerateError(err.message || "Generation failed"))
      .finally(()    => setGenerating(false));
  }, [selectedTemplate, result]);

  // ── Server image handlers ──
  const handleDownloadServer = async () => {
    if (!hasServerImage) return;
    try {
      const blob = await fetch(result.resultUrl).then(r => r.blob());
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement("a"), {
        href: url, download: `${result.categoryName}_result_${result.resultNumber}.png`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) { console.error("Download failed:", err); }
  };

  const handleShareServer = async () => {
    const top  = [...(result.entries || [])].sort((a, b) => a.position - b.position).slice(0, 4);
    const text = `🏆 ${result.categoryName} Results\n\n${top.map(e =>
      `${getPositionDisplay(e.position)} ${e.participantName}${e.teamId?.name ? ` (${e.teamId.name})` : ""}`
    ).join("\n")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${result.categoryName} - Results`, text, url: result.resultUrl });
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${result.resultUrl}`);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) { if (err.name !== "AbortError") console.error(err); }
  };

  // ── Generated poster handlers ──
  const handleDownloadGenerated = async () => {
    if (!generatedDataUrl) return;
    setDownloading(true);
    try {
      const a = Object.assign(document.createElement("a"), {
        href: generatedDataUrl,
        download: `${result.categoryName}_result_${result.resultNumber}.png`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } finally { setDownloading(false); }
  };

  const handleShareGenerated = async () => {
    if (!generatedDataUrl) return;
    setSharing(true);
    try {
      const blob = await fetch(generatedDataUrl).then(r => r.blob());
      const file = new File([blob], `${result.categoryName}_result.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: result.categoryName });
      } else {
        const url = URL.createObjectURL(blob);
        const a   = Object.assign(document.createElement("a"), { href: url, download: file.name });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) { if (err.name !== "AbortError") console.error(err); }
    finally { setSharing(false); }
  };

  if (!result) return null;

  const topEntries = [...(result.entries || [])].sort((a, b) => a.position - b.position).slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f0f0f]
              shadow-2xl z-50 overflow-y-auto border-l border-white/[0.07]"
          >
            {/* Header */}
            <div className="sticky z-50 top-0 bg-[#0f0f0f]/95 backdrop-blur-sm
              border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-white/90 truncate">{result.categoryName}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/35">#{result.resultNumber}</span>
                    {result.group && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                        bg-white/[0.06] border border-white/[0.08] text-white/40">
                        {result.group}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasServerImage && (
                    <>
                      <button onClick={handleShareServer}
                        className="relative p-2 rounded-xl hover:bg-white/[0.08] transition-all group active:scale-95">
                        <Share2 size={18} className="text-white/40 group-hover:text-white/70" />
                        {shareSuccess && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px]
                            font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                      <button onClick={handleDownloadServer}
                        className="relative p-2 rounded-xl hover:bg-white/[0.08] transition-all group active:scale-95">
                        <Download size={18} className="text-white/40 group-hover:text-white/70" />
                        {downloadSuccess && (
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px]
                            font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            Downloaded!
                          </span>
                        )}
                      </button>
                    </>
                  )}
                  <button onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/[0.08] transition-all active:scale-95">
                    <X size={18} className="text-white/40 hover:text-white/70" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5">

              {/* Published date */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={12} className="text-white/30" />
                  <span className="text-[10px] font-semibold text-white/30 uppercase">Published</span>
                </div>
                <p className="text-sm font-medium text-white/70">{formatDate(result.createdAt)}</p>
              </div>

              {/* ── POSTER SECTION ── */}

              {/* Case 1: Server image */}
              {hasServerImage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Result Poster
                    </h3>
                    <a href={result.resultUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
                      <ExternalLink size={10} /> Open original
                    </a>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-white/[0.08]
                    bg-white/[0.02] min-h-[200px]">
                    {!imageError ? (
                      <Image
                        src={result.resultUrl}
                        alt={`${result.categoryName} result`}
                        width={800} height={600}
                        className="w-full h-auto object-cover"
                        onError={() => setImageError(true)}
                        unoptimized={result.resultUrl.includes("cloudinary.com")}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-xs text-white/30 mt-2">Failed to load image</p>
                        <a href={result.resultUrl} target="_blank" rel="noopener noreferrer"
                          className="mt-3 text-[10px] text-amber-500/60 hover:text-amber-500 transition-colors">
                          View directly →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Case 2: Template-based generation */}
              {needsTemplate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={13} className="text-white/25" />
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Result Poster
                    </h3>
                  </div>

                  {templatesLoading ? (
                    <div className="flex items-center gap-2 text-white/30 text-xs py-2">
                      <Loader2 size={13} className="animate-spin" /> Loading templates…
                    </div>
                  ) : templates.length === 0 ? (
                    <p className="text-xs text-white/25 py-2">No templates available</p>
                  ) : (
                    <TemplateSelector
                      templates={templates}
                      selected={selectedTemplate}
                      onSelect={(t) => { setSelectedTemplate(t); setGeneratedDataUrl(null); }}
                    />
                  )}

                  {generating && (
                    <div className="flex items-center justify-center gap-2 py-8
                      border border-white/[0.06] rounded-xl bg-white/[0.02]">
                      <Loader2 size={18} className="animate-spin text-amber-400/60" />
                      <span className="text-xs text-white/35">Generating poster…</span>
                    </div>
                  )}

                  {!generating && generateError && (
                    <div className="flex flex-col items-center gap-2 py-6
                      border border-red-500/10 rounded-xl bg-red-500/[0.03] text-center">
                      <p className="text-xs text-red-400/60">{generateError}</p>
                      <button
                        onClick={() => setSelectedTemplate({ ...selectedTemplate })}
                        className="text-[10px] text-white/35 hover:text-white/55 transition-colors"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {!generating && generatedDataUrl && (
                    <GeneratedPoster
                      dataUrl={generatedDataUrl}
                      onDownload={handleDownloadGenerated}
                      onShare={handleShareGenerated}
                      downloading={downloading}
                      sharing={sharing}
                    />
                  )}
                </div>
              )}

              {/* ── TOP PERFORMERS ── */}
              {topEntries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                    🏆 Top Performers
                  </h3>
                  <div className="space-y-2">
                    {topEntries.map((entry) => {
                      const ms   = MEDAL_ICONS[entry.position] || MEDAL_ICONS[4];
                      const Icon = ms.icon;
                      const top3 = entry.position <= 3;
                      return (
                        <motion.div key={entry._id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: entry.position * 0.05 }}
                          className={`relative overflow-hidden rounded-xl border transition-all
                            ${top3
                              ? `bg-gradient-to-r ${ms.bg} border-white/[0.08]`
                              : "bg-white/[0.03] border-white/[0.06]"
                            } hover:border-white/[0.12] group`}
                        >
                          <div className="flex items-center gap-3 p-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center
                              justify-center text-lg ${ms.color}
                              ${top3 ? "bg-black/20" : "bg-white/[0.05]"}`}>
                              {getPositionDisplay(entry.position)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white/90 truncate">{entry.participantName}</p>
                              {entry.teamId?.name && (
                                <p className="text-[11px] text-white/40 truncate mt-0.5">
                                  {entry.teamId.color && (
                                    <span
                                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                                      style={{ backgroundColor: entry.teamId.color }}
                                    />
                                  )}
                                  {entry.teamId.name}
                                </p>
                              )}
                            </div>
                            <Icon size={16}
                              className={`${ms.color} opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
                          </div>
                          {entry.position === 1 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent
                              via-amber-400/5 to-transparent -translate-x-full
                              group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  {result.entries?.length > 4 && (
                    <p className="text-center text-[10px] text-white/25 pt-2">
                      +{result.entries.length - 4} more participant{result.entries.length - 4 !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}

              {topEntries.length === 0 && (
                <div className="text-center py-8">
                  <Trophy size={32} className="text-white/10 mx-auto mb-2" />
                  <p className="text-sm text-white/30">No participant data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
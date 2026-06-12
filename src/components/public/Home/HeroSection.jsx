"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

function FadeImage({ src, alt, width, height, priority = false, className = "", style = {} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={className}
      style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      onLoad={() => setLoaded(true)}
    />
  );
}

function CircuitOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 2 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="rgba(40,90,255,0.12)" strokeWidth="1" fill="none">
        <line x1="75%" y1="0" x2="75%" y2="12%" />
        <line x1="75%" y1="12%" x2="100%" y2="12%" />
        <circle cx="75%" cy="12%" r="3" fill="rgba(40,90,255,0.2)" stroke="none" />
        <line x1="20%" y1="0" x2="20%" y2="8%" />
        <line x1="0" y1="8%" x2="20%" y2="8%" />
        <circle cx="20%" cy="8%" r="3" fill="rgba(40,90,255,0.2)" stroke="none" />
        <line x1="0" y1="60%" x2="6%" y2="60%" />
        <line x1="6%" y1="60%" x2="6%" y2="70%" />
        <circle cx="6%" cy="60%" r="3" fill="rgba(40,90,255,0.18)" stroke="none" />
        <line x1="100%" y1="55%" x2="94%" y2="55%" />
        <line x1="94%" y1="55%" x2="94%" y2="65%" />
        <circle cx="94%" cy="55%" r="3" fill="rgba(40,90,255,0.18)" stroke="none" />
      </g>
    </svg>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);

  // bg load state
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden circuit-bg"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Solid dark fallback — always visible, fades out when bg loads ── */}
      <AnimatePresence>
        {!bgLoaded && (
          <motion.div
            key="fallback"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{ background: "#050c1a", zIndex: 1 }}
          />
        )}
      </AnimatePresence>

      {/* ── BG poster (parallax, fades in on load) ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -mt-15 w-full h-[110%]"
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: bgLoaded ? 1 : 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{ zIndex: 0 }}
        >
          <Image
            src="/files/heroBg.png"
            alt=""
            fill
            priority
            unoptimized
            style={{ objectFit: "cover", objectPosition: "center top" }}
            onLoad={() => setBgLoaded(true)}
          />
        </motion.div>
      </motion.div>


      {/* ── top fade into nav ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "110px",
          background: "linear-gradient(to bottom, #050c1a 0%, rgba(5,12,26,0.5) 55%, transparent 100%)",
          zIndex: 4,
        }}
      />


      {/* ══════════════════════════════
          CONTENT — renders immediately
      ══════════════════════════════ */}
      <div
        className="relative w-full flex flex-col items-center justify-end text-center px-4 "
        style={{ minHeight: "100dvh", zIndex: 10, paddingTop: "56px" }}
      >
        {/* Division label */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="w-full max-w-[300px] mx-auto -mb-8"
        >
          <h1 className="text-[16px] uppercase tracking-[0.4em] font-display  text-[rgb(254,251,251)]">
            <span className="text-[28px]">M</span>avoor Divisio<span className="text-[26px]">n</span>
          </h1>
        </motion.div>

        {/* sahiText logo */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="w-full max-w-[300px] mx-auto -mb-4"
        >
          <FadeImage
            src="/files/sahiText.png"
            alt="Sahityotsav 2026"
            width={720}
            height={192}
            priority
            className="w-full h-auto object-contain"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(85%) sepia(80%) saturate(500%) hue-rotate(30deg) brightness(105%)",
            }}
          />
        </motion.div>

        {/* edition caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[10px] tracking-[0.28em] uppercase font-medium"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          33rd Edition · Since 1993
        </motion.p>

        {/* DATE BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-[280px] rounded-2xl px-5 py-4"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(46px)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex flex-col items-end">
              <span className="text-[12px] font-light leading-none" style={{ color: "rgba(255,255,255,0.35)" }}>
                2026
              </span>
              <span className="text-[14px] font-bold tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>
                June
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <div className="flex flex-col items-center">
                <span className="text-[54px] font-bold leading-none" style={{ color: "#fff" }}>13</span>
                <span className="text-[8px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: "#C8F135" }}>SAT</span>
              </div>
              <span className="text-[28px] font-light pb-3" style={{ color: "rgba(255,255,255,0.15)" }}>—</span>
              <div className="flex flex-col items-center">
                <span className="text-[54px] font-bold leading-none" style={{ color: "#fff" }}>14</span>
                <span className="text-[8px] font-bold tracking-[0.18em] uppercase mt-0.5" style={{ color: "#C8F135" }}>SUN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <MapPin size={13} strokeWidth={2} style={{ color: "#C8F135", flexShrink: 0 }} />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Peruvayal
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
      style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}
      onLoad={() => setLoaded(true)}
    />
  );
}

/* ── SVG circuit overlay ── */
function CircuitOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 1 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="rgba(40,90,255,0.18)" strokeWidth="1" fill="none">
        {/* top-right corner trace */}
        <line x1="75%" y1="0" x2="75%" y2="12%" />
        <line x1="75%" y1="12%" x2="100%" y2="12%" />
        <circle cx="75%" cy="12%" r="3" fill="rgba(40,90,255,0.25)" stroke="none" />

        {/* top-left trace */}
        <line x1="20%" y1="0" x2="20%" y2="8%" />
        <line x1="0" y1="8%" x2="20%" y2="8%" />
        <circle cx="20%" cy="8%" r="3" fill="rgba(40,90,255,0.25)" stroke="none" />

        {/* mid-left node */}
        <line x1="0" y1="45%" x2="8%" y2="45%" />
        <line x1="8%" y1="45%" x2="8%" y2="55%" />
        <circle cx="8%" cy="45%" r="4" fill="rgba(40,90,255,0.2)" stroke="none" />
        <circle cx="8%" cy="45%" r="7" strokeWidth="0.8" stroke="rgba(40,90,255,0.15)" />

        {/* mid-right node */}
        <line x1="100%" y1="38%" x2="92%" y2="38%" />
        <line x1="92%" y1="38%" x2="92%" y2="50%" />
        <circle cx="92%" cy="38%" r="4" fill="rgba(40,90,255,0.2)" stroke="none" />
        <circle cx="92%" cy="38%" r="7" strokeWidth="0.8" stroke="rgba(40,90,255,0.15)" />

        {/* bottom-left corner trace */}
        <line x1="15%" y1="100%" x2="15%" y2="88%" />
        <line x1="0" y1="88%" x2="15%" y2="88%" />
        <circle cx="15%" cy="88%" r="3" fill="rgba(40,90,255,0.2)" stroke="none" />

        {/* bottom-right corner trace */}
        <line x1="85%" y1="100%" x2="85%" y2="90%" />
        <line x1="85%" y1="90%" x2="100%" y2="90%" />
        <circle cx="85%" cy="90%" r="3" fill="rgba(40,90,255,0.2)" stroke="none" />
      </g>

      {/* ambient glow blobs */}
      <radialGradient id="glowA" cx="80%" cy="10%" r="30%">
        <stop offset="0%" stopColor="#1a3fff" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#1a3fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="glowB" cx="15%" cy="75%" r="28%">
        <stop offset="0%" stopColor="#1a3fff" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#1a3fff" stopOpacity="0" />
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#glowA)" />
      <rect width="100%" height="100%" fill="url(#glowB)" />
    </svg>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const centerY = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <section
      ref={containerRef}
      className="relative h-[104dvh] w-full pt-14 overflow-hidden flex flex-col items-center circuit-bg"
    >
      {/* ── circuit overlay ── */}
      <CircuitOverlay />

      {/* ── top vignette ── */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #050c1a 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ── bottom vignette ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050c1a 0%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════
          LAYER 1 — BACKGROUND MANDALAS
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: -25 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="absolute pointer-events-none"
        style={{ top: "-14%", right: "-27%", width: "68vw", maxWidth: 280, zIndex: 1 }}
      >
        <FadeImage
          src="/files/art1.png"
          alt=""
          width={560}
          height={700}
          priority
          className="w-full h-auto"
          style={{ opacity: 0.12, mixBlendMode: "screen", filter: "hue-rotate(160deg) saturate(1.4)" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: -25 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="absolute pointer-events-none"
        style={{ top: "-8%", left: "-32%", width: "68vw", maxWidth: 280, zIndex: 2 }}
      >
        <FadeImage
          src="/files/art3.png"
          alt=""
          width={560}
          height={700}
          priority
          className="w-full h-auto"
          style={{ opacity: 0.06, mixBlendMode: "screen", filter: "hue-rotate(160deg) saturate(1.4)" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.75, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 40 }}
        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute pointer-events-none"
        style={{ bottom: "-33%", left: "-38%", width: "88vw", maxWidth: 360, zIndex: 1 }}
      >
        <FadeImage
          src="/files/art1.png"
          alt=""
          width={680}
          height={680}
          priority
          className="w-full h-auto"
          style={{ opacity: 0.10, mixBlendMode: "screen", filter: "hue-rotate(160deg) saturate(1.4)" }}
        />
      </motion.div>

      {/* ══════════════════════════════════════
          LAYER 3 — TEXT CONTENT
      ══════════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center w-full text-center px-6"
        style={{ zIndex: 10, paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* ── Year display ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="flex flex-col items-center pt-20 mb-2"
        >
          <div className="flex flex-col items-center leading-none">
            <span
              className="font-display block tracking-[-0.04em]"
              style={{
                fontSize: "clamp(60px, 18vw, 80px)",
                lineHeight: 0.9,
                background: "linear-gradient(170deg, #C8F135 20%, #a8d020 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              2026
            </span>
            {/* <span
              className="font-display block tracking-[-0.04em]"
              style={{
                fontSize: "clamp(60px, 18vw, 80px)",
                lineHeight: 0.9,
                background: "linear-gradient(170deg, #a8d020 20%, #7aaa00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              26
            </span> */}
          </div>

          {/* separator */}
          <div
            className="mt-2"
            style={{ width: 40, height: 1, background: "rgba(200,241,53,0.4)" }}
          />
        </motion.div>

        {/* ── sector meta ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-1"
          style={{ color: "rgba(200,241,53,0.6)" }}
        >
          SSF · <span className=" text-[18px] font-display  tracking-[0.2em]" >Kunnamangalam</span> Division
        </motion.p>

        {/* ── sahityotsav logo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="w-full max-w-[340px] mx-auto my-1"
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

        {/* ── edition + since ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.72 }}
          className="text-[11px] tracking-[0.22em] uppercase font-medium mb-6"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          33rd Edition · Since 1993
        </motion.p>

        {/* ── DATE BLOCK ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.78 }}
          className="relative w-full max-w-[280px] rounded-2xl mb-5 px-5 py-4"
          style={{
            background: "rgba(200,241,53,0.04)",
            border: "0.5px solid rgba(200,241,53,0.18)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* top shimmer line */}
          <div
            className="absolute left-8 right-8 -top-px h-px rounded-full"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(200,241,53,0.45),transparent)",
            }}
          />

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex flex-col items-end">
              <span
                className="text-[12px] font-light leading-none"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                2026
              </span>
              <span
                className="text-[14px] font-bold tracking-[0.14em] uppercase"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                May
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <div className="flex flex-col items-center">
                <span
                  className="text-[54px] font-bold leading-none"
                  style={{ color: "#fff" }}
                >
                  23
                </span>
                <span
                  className="text-[8px] font-bold tracking-[0.18em] uppercase mt-0.5"
                  style={{ color: "#C8F135" }}
                >
                  FRI
                </span>
              </div>
              <span
                className="text-[28px] font-light pb-3"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                —
              </span>
              <div className="flex flex-col items-center">
                <span
                  className="text-[54px] font-bold leading-none"
                  style={{ color: "#fff" }}
                >
                  24
                </span>
                <span
                  className="text-[8px] font-bold tracking-[0.18em] uppercase mt-0.5"
                  style={{ color: "#C8F135" }}
                >
                  SAT
                </span>
              </div>
            </div>
          </div>

          {/* location */}
          <div className="flex items-center justify-center gap-1.5">
            <MapPin
              size={14}
              strokeWidth={2}
              style={{ color: "#C8F135", flexShrink: 0 }}
            />
            <span
              className="text-[11.5px] font-medium uppercase  tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Peruvayal
            </span>
          </div>
        </motion.div>

       
      </div>

      {/* ── scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.0 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ zIndex: 20 }}
        aria-hidden
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 20,
            background:
              "linear-gradient(to bottom,rgba(200,241,53,0.5),transparent)",
            borderRadius: 1,
          }}
        />
      </motion.div>
    </section>
  );
}
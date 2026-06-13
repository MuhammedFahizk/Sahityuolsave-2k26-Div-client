"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Feather, Users, Sparkles, BookOpen, Quote, ArrowRight, Flag, MapPin, Calendar } from "lucide-react";
import Image from "next/image";

/* ── FadeImage ── */
function FadeImage({ src, alt, width, height, fill, priority, className = "", style = {} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={src} alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      unoptimized
      className={className}
      style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease" }}
      onLoad={() => setLoaded(true)}
    />
  );
}

/* ── Theme tokens ── */
const GREEN       = "#C8F135";
const GREEN_DIM   = "rgba(200,241,53,0.55)";
const GREEN_FAINT = "rgba(200,241,53,0.10)";
const GREEN_LINE  = "rgba(200,241,53,0.20)";
const NAVY        = "#050c1a";

/* ── Stat Card ── */
const StatCard = ({ number, label, icon: Icon, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="flex flex-col items-center justify-center gap-1.5 py-5 px-3"
    >
      <Icon size={15} strokeWidth={1.5} style={{ color: GREEN, marginBottom: 2 }} />
      <span
        className="leading-none font-display"
        style={{
          fontSize: "clamp(2rem, 8vw, 2.8rem)",
          background: "linear-gradient(160deg,#C8F135 20%,#a8d020 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.02em",
        }}
      >{number}</span>
      <span
        className="text-[9px] tracking-[0.24em] uppercase font-medium"
        style={{ color: "rgba(255,255,255,0.32)" }}
      >{label}</span>
    </motion.div>
  );
};

/* ── Para with green left bar ── */
const Para = ({ children, delay, strength = "40" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -14 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative pl-4"
      style={{ borderLeft: `1.5px solid rgba(200,241,53,${Number(strength) / 100})` }}
    >
      {children}
    </motion.div>
  );
};

/* ── Circuit SVG background dots ── */
function CircuitDots() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden
      xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.18 }}>
      <defs>
        <pattern id="circuit-about" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect x="17.5" y="17.5" width="1" height="1" fill="rgba(40,90,255,0.6)" rx="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-about)"/>
    </svg>
  );
}

/* ── Event info pill ── */
function EventPill({ icon: Icon, text }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: GREEN_FAINT,
        border: `0.5px solid ${GREEN_LINE}`,
      }}
    >
      <Icon size={10} style={{ color: GREEN }} strokeWidth={2} />
      <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: GREEN }}>
        {text}
      </span>
    </div>
  );
}

/* ── AI Image Panel — the right side creative placement ── */
function AIImagePanel({ isInView, imgY }) {
  return (
    <div className="relative hidden lg:flex items-stretch overflow-hidden">

      {/* Dark fade from left — blends left text panel into image zone */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: `linear-gradient(105deg, ${NAVY} 0%, rgba(5,12,26,0.60) 35%, rgba(5,12,26,0.10) 100%)`,
      }}/>

      {/* Subtle green vignette top + bottom */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(5,12,26,0.55) 0%, transparent 30%, transparent 70%, rgba(5,12,26,0.55) 100%)",
      }}/>

      {/* AI Brain image — full bleed with parallax */}
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        {/*
          The AI brain/Malayalam theme image.
          Black background image so it naturally bleeds into the dark navy panel.
          We invert-overlay it with a mix-blend-mode so it integrates organically.
        */}
        <div className="absolute inset-0" style={{ background: "#000" }} />
        <Image
          src="/files/theme.png"
          alt="AI Malayalam theme illustration — Sahityotsav 33rd edition"
          fill
          unoptimized
          style={{
            objectFit: "contain",
            objectPosition: "center",
            mixBlendMode: "screen",       // black bg disappears, white art glows
            opacity: 0.82,
          }}
        />
      </motion.div>

      {/* Green left-edge border strip */}
      <div className="absolute left-0 top-0 bottom-0 z-20" style={{ width: "1.5px" }}>
        <div style={{
          width: "100%", height: "100%",
          background: `linear-gradient(to bottom, transparent 0%, ${GREEN} 50%, transparent 100%)`,
          opacity: 0.35,
        }}/>
      </div>

      {/* Corner bracket — top left */}
      <svg className="absolute top-6 left-6 w-10 h-10 z-30" viewBox="0 0 48 48" fill="none"
        style={{ opacity: 0.45 }}>
        <path d="M4 20 L4 4 L20 4" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>

      {/* Corner bracket — bottom right */}
      <svg className="absolute bottom-6 right-6 w-10 h-10 z-30" viewBox="0 0 48 48" fill="none"
        style={{ opacity: 0.45 }}>
        <path d="M44 28 L44 44 L28 44" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>

      {/* Watermark year */}
      <div className="absolute top-8 right-8 select-none pointer-events-none z-20"
        style={{ color: GREEN, opacity: 0.06 }}>
        <span className="font-bold leading-none"
          style={{ fontFamily:"Georgia,serif", fontSize:"clamp(3rem,8vw,6rem)" }}>
          1993
        </span>
      </div>

      {/* Bottom info card */}
      <div className="relative z-20 flex flex-col justify-end p-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="rounded-2xl p-5"
          style={{
            background: "rgba(5,12,26,0.78)",
            border: `0.5px solid ${GREEN_LINE}`,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          {/* shimmer line */}
          <div style={{
            height: "1px", marginBottom: "14px",
            background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
            opacity: 0.35,
          }}/>

          {/* Theme name */}
          <p className="text-[10px] tracking-[0.22em] uppercase font-bold mb-2"
            style={{ color: GREEN_DIM }}>
            Sahityolsave 2026's theme
          </p>
          <p className="text-sm font-semibold text-white/75 leading-snug mb-4">
          AI എഴുതുമ്പോൾ മനുഷ്യൻ വായിക്കുന്നത്
          </p>
          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            "What AI writes, humans read" — exploring the boundary between machine intelligence and human expression.
          </p>

          {/* Event pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <EventPill icon={Calendar} text="June 13–14" />
            <EventPill icon={MapPin}   text="Peruvayal" />
            <EventPill icon={Flag}     text="33rd Year" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Mobile theme image (below text on small screens) ── */
function MobileThemeImage({ isInView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="lg:hidden mx-4 mb-8 rounded-2xl overflow-hidden relative"
      style={{
        // border: `0.5px solid ${GREEN_LINE}`,
        // background: "#000",
        aspectRatio: "4/3",
      }}
    >
      <Image
        src="/files/theme.png"
        alt="AI Malayalam theme illustration — Sahityotsav 33rd edition"
        fill
        unoptimized
        style={{
          objectFit: "contain",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />

      {/* bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
        <p className="text-[10px] tracking-[0.18em] uppercase font-bold" style={{ color: GREEN }}>
          Sahityotsav 2026's theme
        </p>
        <p className="text-xs text-white/65 mt-0.5">
          AI എഴുതുന്നത് മനുഷ്യൻ വായിക്കുന്നത്
        </p>
      </div>
    </motion.div>
  );
}


/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      
    >
      {/* circuit dot grid */}
      <CircuitDots />

      {/* ambient glows */}
      <div className="absolute -top-48 -left-36 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,70,255,0.09) 0%, transparent 70%)" }}/>
      <div className="absolute -bottom-32 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,241,53,0.04) 0%, transparent 70%)" }}/>

      {/* ════════════════════════════════════
          GRID
      ════════════════════════════════════ */}
      <div className="relative z-10 grid lg:grid-cols-2 min-h-[70vh]">

        {/* ── LEFT / TEXT ── */}
        <div className="relative flex flex-col justify-center px-7 md:px-14 lg:px-16 py-6 lg:py-28 overflow-hidden">

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 self-start mb-8 px-4 py-1.5 rounded-full"
            style={{
              background: GREEN_FAINT,
              border: `0.5px solid ${GREEN_LINE}`,
              backdropFilter: "blur(8px)",
            }}
          >
            <BookOpen size={11} strokeWidth={2} style={{ color: GREEN }}/>
            <span className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: GREEN }}>
              Our Legacy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="leading-none -mb-8 tracking-tight z-10 font-display text-white text-[40px] sm:text-4xl md:text-5xl lg:text-6xl"
          >The Story of</motion.h2>

          {/* sahityotsav SVG logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="self-start z-10 -mb-8"
          >
            <img
              src="/files/sahiText.png"
              alt="Sahityotsav"
              style={{
                width: "clamp(180px,75vw,320px)",
                height: "auto",
                filter: "brightness(0) saturate(100%) invert(85%) sepia(80%) saturate(500%) hue-rotate(30deg) brightness(105%)",
              }}
            />
          </motion.div>

          {/* Edition tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="self-start z-10 mb-8"
          >
            <span
              className="inline-block px-3 py-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{
                color: GREEN,
                borderTop: `1px solid ${GREEN_LINE}`,
                borderBottom: `1px solid ${GREEN_LINE}`,
                background: GREEN_FAINT,
              }}
            >33rd Edition · Since 1993</span>
          </motion.div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-8 flex z-10 gap-3 items-start"
          >
            <Quote size={36} strokeWidth={1.5} style={{ color: GREEN, opacity: 0.5, flexShrink: 0, marginTop: 2 }}/>
            <p className="italic text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Where words find their wings and young voices echo through generations
            </p>
          </motion.div>

          {/* Paragraphs */}
          <div className="space-y-5 mb-10 z-10">
            <Para delay={0.35} strength="45">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>
                <span className="font-bold float-left mr-1 leading-none"
                  style={{ fontFamily:"Georgia,serif", fontSize:"2.4em", color: GREEN, lineHeight:0.82, marginTop:"0.06em" }}>
                  I
                </span>
                ncepted{" "}
                <strong style={{ color: "rgba(255,255,255,0.88)" }}>33 years ago in 1993</strong>
                , it has its commencement from the grassroot level — a family Sahityotsav. Crossing units, sectors, divisions, districts and{" "}
                <strong style={{ color: "rgba(255,255,255,0.88)" }}>26 states</strong>{" "}
                across the country, it finds its actualization at the national level each year.
              </p>
            </Para>

            <Para delay={0.45} strength="28">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
                Sahityotsav focuses on the embellishment of creativity for thousands of students across India, and has become one of the{" "}
                <strong style={{ color: "rgba(255,255,255,0.82)" }}>towering figures</strong>{" "}
                in the realm of India's cultural festivals.
              </p>
            </Para>

           

            <Para delay={0.55} strength="14">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Thousands of young, vibrant students are ready to question all anti-social hullabaloos using their talents —{" "}
                <em className="font-semibold not-italic" style={{ color: "rgba(255,255,255,0.75)" }}>
                  writing, drawing, criticizing…
                </em>
              </p>
            </Para>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="grid grid-cols-3 divide-x rounded-2xl overflow-hidden "
            style={{
              background: "rgba(200,241,53,0.03)",
              border: `0.5px solid ${GREEN_LINE}`,
              backdropFilter: "blur(12px)",
            }}
          >
            {[
              { number: "33+", label: "Years",    icon: Sparkles, delay: 0.70 },
              { number: "26",  label: "States",   icon: Users,    delay: 0.78 },
              { number: "50K+",label: "Students", icon: Feather,  delay: 0.86 },
            ].map((s) => (
              <div key={s.label} style={{ borderColor: GREEN_LINE }}>
                <StatCard {...s}/>
              </div>
            ))}
          </motion.div>

          {/* CTA button
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="self-start z-10"
          >
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl font-semibold text-sm no-underline transition-all duration-200 active:scale-95"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg,#daf76a 0%,#C8F135 50%,#a8d020 100%)",
                color: NAVY,
                boxShadow: "0 2px 20px rgba(200,241,53,0.18)",
                letterSpacing: "0.02em",
              }}
            >
              Learn More <ArrowRight size={14} strokeWidth={2.2}/>
            </a>
          </motion.div> */}
        </div>

        {/* ── RIGHT — AI theme image panel (desktop) ── */}
        <AIImagePanel isInView={isInView} imgY={imgY} />
      </div>

      {/* ── Mobile theme image strip ── */}
      <MobileThemeImage isInView={isInView} />

    </section>
  );
}
"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Feather, Users, Sparkles, BookOpen, Quote, ArrowRight } from "lucide-react";
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
const GREEN_FAINT = "rgba(200,241,53,0.12)";
const GREEN_LINE  = "rgba(200,241,53,0.22)";

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

/* ── Geometric art border strip ── */
function ArtBorder({ side = "left" }) {
  return (
    <div
      style={{
        position: "absolute",
        [side]: 0,
        top: 0,
        bottom: 0,
        width: "5px",
        overflow: "hidden",
        zIndex: 20,
      }}
    >
      <div style={{ position: "relative", width: "5px", height: "100%" }}>
        <Image
          src="/files/image.png"
          alt=""
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: side === "left" ? "left center" : "right center" }}
        />
        {/* darken overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,12,26,0.35)" }} />
      </div>
    </div>
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
  const mY1  = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const mY2  = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#050c1a" }}
    >
      {/* circuit dot grid */}
      <CircuitDots />

      {/* blue ambient glows */}
      <div className="absolute -top-48 -left-36 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,70,255,0.10) 0%, transparent 70%)" }}/>
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,241,53,0.05) 0%, transparent 70%)" }}/>

     

      

      {/* ════════════════════════════════════
          GRID
      ════════════════════════════════════ */}
      <div className="relative z-10 grid lg:grid-cols-2 min-h-[80vh]">

        {/* ── LEFT / TEXT ── */}
        <div className="relative flex flex-col justify-center px-7 md:px-14 lg:px-16  py-4 lg:py-28 overflow-hidden">

          {/* left art border strip (desktop) */}
          <div className="hidden lg:block">
            <ArtBorder side="left" />
          </div>

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
            className="leading-none tracking-tight z-10 font-display text-white text-[40px] sm:text-4xl md:text-5xl lg:text-6xl"
          >The Story of</motion.h2>

          {/* sahityotsav SVG logo — green filtered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="self-start z-10"
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
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                As a prime aim, Sahityotsav focuses on the embellishment of creativity for thousands of students across India, and has become one of the{" "}
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
            className="grid grid-cols-3 divide-x rounded-2xl overflow-hidden mb-8"
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

          {/* CTA button */}
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
                color: "#050c1a",
                boxShadow: "0 2px 20px rgba(200,241,53,0.22)",
                letterSpacing: "0.02em",
              }}
            >
              Learn More <ArrowRight size={14} strokeWidth={2.2}/>
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT — art image (desktop) ── */}
        <div className="relative hidden lg:flex items-stretch overflow-hidden">

          {/* Dark overlay so image doesn't overpower */}
          <div className="absolute inset-0 z-10" style={{
            background: "linear-gradient(105deg, rgba(5,12,26,0.88) 0%, rgba(5,12,26,0.45) 40%, rgba(5,12,26,0.15) 100%)",
          }}/>

          {/* Geometric art image — full bleed */}
          <motion.div style={{ y: imgY }} className="absolute inset-0">
            <Image
              src="/files/image.png"
              alt="Abstract geometric art"
              fill
              unoptimized
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </motion.div>

          {/* Green border strip on left edge of right panel */}
          <div className="absolute left-0 top-0 bottom-0 z-20" style={{ width: "3px" }}>
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(to bottom, transparent, ${GREEN}, transparent)`,
              opacity: 0.45,
            }}/>
          </div>

          {/* Floating content over image */}
          <div className="relative z-20 flex flex-col justify-end p-10 w-full">

            {/* Watermark year */}
            <div className="absolute top-8 right-8 select-none pointer-events-none"
              style={{ color: "#fff", opacity: 0.05 }}>
              <span className="font-bold leading-none"
                style={{ fontFamily:"Georgia,serif", fontSize:"clamp(3rem,8vw,6rem)" }}>
                1993
              </span>
            </div>

            {/* Corner bracket — top left */}
            <svg className="absolute top-6 left-6 w-10 h-10 z-30" viewBox="0 0 48 48" fill="none"
              style={{ opacity: 0.5 }}>
              <path d="M4 20 L4 4 L20 4" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            </svg>

            {/* Corner bracket — bottom right */}
            <svg className="absolute bottom-6 right-6 w-10 h-10 z-30" viewBox="0 0 48 48" fill="none"
              style={{ opacity: 0.5 }}>
              <path d="M44 28 L44 44 L28 44" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            </svg>

            {/* Info card at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(5,12,26,0.75)",
                border: `0.5px solid ${GREEN_LINE}`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {/* top shimmer */}
              <div style={{
                height: "1px", marginBottom: "14px",
                background: `linear-gradient(90deg,transparent,${GREEN},transparent)`,
                opacity: 0.4,
              }}/>

              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
                SSF Thathoor Sector's annual celebration of literature, debate and creative expression — 
                uniting students across Kerala in a festival that has grown into a national movement.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                {["May 23–24", "Thathoore", "33rd Year"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      color: GREEN,
                      background: GREEN_FAINT,
                      border: `0.5px solid ${GREEN_LINE}`,
                    }}
                  >{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

     

      {/* Bottom divider */}
    
    </section>
  );
}
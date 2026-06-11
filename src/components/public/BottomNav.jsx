"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Route config ─────────────────────────────────────────── */
const TABS = [
  { href: "/",        label: "Home",    icon: HomeIcon },
  { href: "/results", label: "Results", icon: TrophyIcon },
  { href: "/teams",   label: "Teams",   icon: ShieldIcon },
  { href: "/gallery", label: "Gallery", icon: PhotoIcon },
  { href: "/news",    label: "News",    icon: NewsIcon },
];

/* ─── Icons ─────────────────────────────────────────────────── */
function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function TrophyIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4" />
      <path d="M5 3H3v5a4 4 0 004 4h.5M19 3h2v5a4 4 0 01-4 4h-.5" />
      <path d="M7 3h10v7a5 5 0 01-10 0V3z" />
    </svg>
  );
}
function ShieldIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.5C16.5 21.15 20 16.25 20 11V5l-8-3z" />
    </svg>
  );
}
function PhotoIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}
function NewsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ─── Theme tokens ───────────────────────────────────────────── */
const GREEN        = "#C8F135";
const GREEN_DIM    = "rgba(200,241,53,0.65)";
const GREEN_BORDER = "rgba(200,241,53,0.18)";
const GREEN_GLOW   = "rgba(200,241,53,0.28)";
const BG_DARK      = "rgba(5,12,26,0.82)";
const BG_DARK_LITE = "rgba(5,12,26,0.48)";

/* Filter to tint sahiText.png to the chartreuse green */
const greenFilter =
  "brightness(0) saturate(100%) invert(85%) sepia(80%) saturate(500%) hue-rotate(30deg) brightness(105%)";

/* ═══════════════════════════════════════════════════════════════
   AppNav
═══════════════════════════════════════════════════════════════ */
export default function AppNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 52);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE — top bar + bottom pill nav
      ══════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden"
        style={{
          height: scrolled ? "52px" : "62px",
          transition: "height 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      />

      {/* ── Mobile top bar ── */}
      <header
        className="lg:hidden fixed rounded-b-2xl top-0 left-0 right-0 z-40"
        style={{
          height: scrolled ? "62px" : "72px",
          background: scrolled ? BG_DARK : BG_DARK_LITE,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: scrolled
            ? `0.5px solid ${GREEN_BORDER}`
            : "0.5px solid rgba(200,241,53,0.08)",
          boxShadow: scrolled
            ? `0 4px 32px rgba(0,0,0,0.55), 0 1px 0 ${GREEN_BORDER} inset`
            : "none",
          transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        {/* Green top accent line */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "1.5px",
            background: `linear-gradient(90deg, transparent 5%, ${GREEN} 30%, #a8d020 70%, transparent 95%)`,
            opacity: scrolled ? 0.45 : 0.75,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* logo left — sahiText right */}
        <div className="flex items-center justify-between w-full h-full px-4">
          {/* Logo icon */}
          <Link href="/" aria-label="Sahityotsav home" className="flex items-center no-underline">
            <div
              className="rounded-md overflow-hidden"
              style={{
                width: scrolled ? "34px" : "38px",
                height: scrolled ? "38px" : "40px",
               
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
                flexShrink: 0,
              }}
            >
              <img
                src="/files/logo.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* sahiText — right side */}
          <Link href="/" aria-label="Sahityotsav home" className="no-underline flex items-center" style={{ gap: "12px" }}>
            <img
              src="/files/sahiText.png"
              alt="Sahityotsav"
              style={{
                width: scrolled ? "78px" : "100px",
                height: "auto",
                filter: greenFilter,
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
                flexShrink: 0,
                display: "block",
              }}
            />
             <div
              className="rounded-md overflow-hidden"
              style={{
                width: scrolled ? "44px" : "48px",
                height: scrolled ? "48px" : "50px",
               
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
                flexShrink: 0,
              }}
            >
             <img
                src="/files/theme.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
              </div>
          </Link>
          
        </div>
      </header>

      {/* ── Mobile bottom pill navigation ── */}
      <nav
        aria-label="Main navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
      >
        <div
          className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: "rgba(5,12,26,0.92)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: `0.5px solid ${GREEN_BORDER}`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(200,241,53,0.1) inset`,
          }}
        >
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                aria-label={tab.label}
                className="relative flex items-center justify-center rounded-full no-underline select-none transition-all duration-200 active:scale-90"
                style={{
                  width: "62px",
                  height: "44px",
                  background: active
                    ? "linear-gradient(135deg, #daf76a 0%, #C8F135 50%, #a8d020 100%)"
                    : "transparent",
                  color: active ? "#050c1a" : GREEN_DIM,
                  boxShadow: active ? `0 2px 16px ${GREEN_GLOW}` : "none",
                }}
              >
                <Icon active={active} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          DESKTOP — floating glass navbar
      ══════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:block"
        style={{
          height: scrolled ? "52px" : "66px",
          transition: "height 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      />

      <div
        className="hidden lg:block fixed top-0 left-0 right-0 z-50"
        style={{
          padding: scrolled ? "10px 48px 0" : "0",
          transition: "padding 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            height: scrolled ? "52px" : "66px",
            paddingLeft: scrolled ? "20px" : "40px",
            paddingRight: scrolled ? "20px" : "40px",
            borderRadius: scrolled ? "20px" : "0px",
            background: scrolled ? BG_DARK : BG_DARK_LITE,
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: scrolled ? `0.5px solid ${GREEN_BORDER}` : "none",
            borderBottom: !scrolled ? "0.5px solid rgba(200,241,53,0.10)" : undefined,
            boxShadow: scrolled
              ? `0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(200,241,53,0.12) inset`
              : "0 2px 16px rgba(0,0,0,0.3)",
            transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Green top accent */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1.5px",
              background: `linear-gradient(90deg, transparent 5%, ${GREEN} 30%, #a8d020 70%, transparent 95%)`,
              opacity: scrolled ? 0.4 : 0.7,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Desktop brand — logo only, no text label */}
          <Link
            href="/"
            aria-label="Sahityotsav home"
            className="flex items-center no-underline shrink-0"
            style={{ gap: "12px" }}
          >
            <div
              style={{
                width: "30px",
                height: "38px",
                flexShrink: 0,
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
                transform: scrolled ? "scale(0.88)" : "scale(1)",
              }}
            >
              <img
                src="/files/logo.png"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav aria-label="Primary links">
            <ul
              className="flex items-center list-none m-0 p-0"
              style={{
                gap: scrolled ? "2px" : "4px",
                background: scrolled ? "rgba(200,241,53,0.05)" : "transparent",
                borderRadius: scrolled ? "14px" : "0",
                padding: scrolled ? "5px" : "0",
                border: scrolled ? `0.5px solid rgba(200,241,53,0.12)` : "none",
                transition: "all 0.45s cubic-bezier(0.34,1.1,0.64,1)",
              }}
            >
              {TABS.map((tab) => {
                const active = isActive(tab.href);
                return (
                  <li key={tab.href}>
                    <Link
                      href={tab.href}
                      aria-current={active ? "page" : undefined}
                      className="relative inline-flex items-center rounded-[10px] no-underline font-medium transition-all duration-200"
                      style={{
                        fontSize: scrolled ? "12.5px" : "13.5px",
                        paddingLeft: scrolled ? "12px" : "16px",
                        paddingRight: scrolled ? "12px" : "16px",
                        paddingTop: scrolled ? "5px" : "7px",
                        paddingBottom: scrolled ? "5px" : "7px",
                        background: active
                          ? "linear-gradient(135deg, #daf76a 0%, #C8F135 50%, #a8d020 100%)"
                          : "transparent",
                        color: active ? "#050c1a" : "rgba(255,255,255,0.65)",
                        fontWeight: active ? 600 : 400,
                        boxShadow: active ? `0 2px 12px ${GREEN_GLOW}` : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {tab.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop right side — sahiText + CTA */}
          <div className="flex items-center shrink-0" style={{ gap: "16px" }}>
            {/* sahiText — right side, fades slightly on scroll */}
            <img
              src="/files/sahiText.png"
              alt="Sahityotsav"
              style={{
                width: scrolled ? "90px" : "116px",
                height: "auto",
                filter: greenFilter,
                opacity: scrolled ? 0.75 : 1,
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
              }}
            />

            {/* Register CTA */}
            <div
              className="rounded-md overflow-hidden"
              style={{
                width: scrolled ? "44px" : "48px",
                height: scrolled ? "48px" : "50px",
               
                transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
                flexShrink: 0,
              }}
            >
             <img
                src="/files/theme.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Code, Heart, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Simple SVG Icons
const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 22c-2 0-7-6-7-10a7 7 0 1 1 14 0c0 4-5 10-7 10z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AwardIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const NewspaperIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M8 21h8M12 17v4" />
    <path d="M5 3H3v5a4 4 0 0 0 4 4h.5M19 3h2v5a4 4 0 0 1-4 4h-.5" />
    <path d="M7 3h10v7a5 5 0 0 1-10 0V3z" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const HelpCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.5 4.5-1.35 8-6.25 8-11.5V5l-8-3z" />
  </svg>
);

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
       {/* ── Mobile — art image accent strip at bottom ── */}
      <div className="relative  lg:hidden w-full overflow-hidden" style={{ height: "60px" }}>
        <Image
          src="/files/image.png"
          alt=""
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center 70%" }}
        />
        
        <div
        className="-top-10"
         style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,12,26,0.1) 0%, rgba(5,12,26,0.98) 100%)",
        }}/>
       
        {/* green shimmer line at top of fade */}
        
      </div>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--color-gold)] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[var(--color-gold)] blur-[100px]" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 md:pb-12 border-b border-white/10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/files/theme.png"
                alt="Logo"
                className="w-10 h-12 md:w-12 md:h-14 object-contain brightness-0 invert"
              />
              <img
                src="https://www.keralasahityotsav.com/images/sahi_title_white.svg"
                alt="Sahityotsav"
                className="h-8 md:h-10 w-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(72%) sepia(60%) saturate(600%) hue-rotate(5deg) brightness(95%)",
                }}
              />
            </div>
            <p className="text-xs text-gray-400 max-w-md text-center md:text-left">
              Celebrating language, art, and culture since 1993
            </p>
          </div>

          <div className="flex gap-3">
            {[
              {
                icon: FacebookIcon,
                href: "https://facebook.com",
                label: "Facebook",
              },
              {
                icon: InstagramIcon,
                href: "https://instagram.com",
                label: "Instagram",
              },
              {
                icon: TwitterIcon,
                href: "https://twitter.com",
                label: "Twitter",
              },
              {
                icon: YoutubeIcon,
                href: "https://youtube.com",
                label: "YouTube",
              },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-[var(--color-gold)] hover:scale-110 active:scale-95"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Main Links Grid - 5 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10  py-12">
          {/* Column 1: Main Pages */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/", icon: null },
                { label: "Results", href: "/results", icon: TrophyIcon },
                { label: "Teams", href: "/teams", icon: UsersIcon },
                { label: "Gallery", href: "/gallery", icon: ImageIcon },
                { label: "News", href: "/news", icon: NewspaperIcon },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-200"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About Us */}
          {/* <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]">
              About
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Our Story", href: "/about", icon: InfoIcon },
                { label: "History", href: "/history", icon: CalendarIcon },
                { label: "Organizing Team", href: "/team", icon: UsersIcon },
                { label: "Sponsors", href: "/sponsors", icon: HeartIcon },
                { label: "Contact Us", href: "/contact", icon: PhoneIcon },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-200"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Column 5: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPinIcon />
                <span>Chittaripilakkal, Thathoore Sector, Kerala</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <PhoneIcon />
                <a
                  href="tel:+918828570036"
                  className="hover:text-[var(--color-gold)] transition-colors"
                >
                  +91 8828 570 036
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MailIcon />
                <a
                  href="mailto:info@sahityotsav.com"
                  className="hover:text-[var(--color-gold)] transition-colors"
                >
                  info@sahityotsav.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <ClockIcon />
                <span> Sat - sunday: 10 AM - 6 PM</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            {/* <div className="pt-4">
              <p className="text-xs text-gray-500 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                />
                <button className="px-3 py-2 text-xs bg-[var(--color-gold)] text-black rounded-lg font-semibold hover:bg-[var(--color-gold-dark)] transition-colors">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          

          <div className="text-xs text-gray-500 space-y-2 mb-10">
            <p>© {year} Sahityotsav. All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-end gap-2">
              <span className="text-gray-600">Powered by</span>
              <a
                href="https://ramfif.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-amber-500/10 transition-all duration-300"
              >
                <Code size={12} className="text-amber-500" />
                <span className="text-xs font-medium text-gray-400 group-hover:text-amber-500 transition-colors">
                  RAMFIF Technology
                </span>
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="tel:9961130563"
                className="group flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-500 transition-colors"
              >
                <Smartphone size={10} />
                <span>Dev: 9961130563</span>
              </a>
            </div>
           <p className="text-[12px] text-gray-600/60">
  Created with precision by RAMFIF • Let's build something great together
</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-34 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-gold)] text-black flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}

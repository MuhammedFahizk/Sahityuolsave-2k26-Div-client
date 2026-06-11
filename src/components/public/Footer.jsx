"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  // Facebook,
  // Instagram,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Trophy,
  Users,
  ImageIcon,
  Newspaper,
  ArrowUp,
  Code,
  Smartphone,
  MessageCircle,   // WhatsApp stand-in
  AtSign,          // Threads stand-in
} from "lucide-react";
import { BsFacebook, BsInstagram, BsThreads, BsWhatsapp } from "react-icons/bs";
// Threads SVG (not in lucide) — minimal inline


// WhatsApp SVG (not in lucide)
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socials = [
    {
      Icon: BsWhatsapp,
      href: "https://chat.whatsapp.com/HCC9oCFcrh1Fp0Ao1V0M5c",
      label: "WhatsApp Group",
    },
    {
      Icon: BsInstagram,
      href: "https://www.instagram.com/ssfmavoordivision?igsh=OHVqZWM4dzlweG4x",
      label: "Instagram",
    },
    {
      Icon: BsFacebook,
      href: "https://www.facebook.com/share/1BLAJkYS7T/",
      label: "Facebook",
    },
    {
      Icon: BsThreads,
      href: "https://www.threads.net/@ssfmavoordivision",
      label: "Threads",
    },
    {
      // WhatsApp Channel — separate from group
      Icon: MessageCircle,
      href: "https://whatsapp.com/channel/0029VbAhqJW1t90knxNciZ3I",
      label: "WhatsApp Channel",
    },
  ];

  const navLinks = [
    { label: "Home", href: "/", Icon: null },
    { label: "Results", href: "/results", Icon: Trophy },
    { label: "Teams", href: "/teams", Icon: Users },
    { label: "Gallery", href: "/gallery", Icon: ImageIcon },
    { label: "News", href: "/news", Icon: Newspaper },
  ];

  return (
    <footer className="relative bg-[#050c1a] text-white overflow-hidden">
      {/* Mobile art image accent strip */}
      <div className="relative lg:hidden w-full overflow-hidden" style={{ height: "60px" }}>
        <Image
          src="/files/image.png"
          alt=""
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center 70%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,12,26,0.1) 0%, rgba(5,12,26,0.98) 100%)",
          }}
        />
      </div>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#C8F135] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-500 opacity-[0.04] blur-[100px]" />
      </div>

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8F135] to-transparent opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">

        {/* ── Top: logo + socials ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 md:pb-12 border-b border-white/10">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/files/logo.png"
                alt="Logo"
                className="w-5 h-8 md:w-12 md:h-14 object-contain brightness-0 invert"
              />
              <img
                src="/files/sahiText.png"
                alt="Sahityotsav"
                className="h-8 md:h-10 w-auto"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(78%) sepia(50%) saturate(500%) hue-rotate(35deg) brightness(110%)",
                }}
              />
            </div>
            <p className="text-xs text-gray-400 max-w-md text-center md:text-left">
              Celebrating language, art, and culture since 1993
            </p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="group w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-[#C8F135] hover:border-[#C8F135] hover:text-black hover:scale-110 active:scale-95 text-gray-400"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 py-12">

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C8F135]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C8F135] transition-colors duration-200"
                  >
                    {Icon && <Icon size={14} className="opacity-70" />}
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social channels */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C8F135]">
              Follow Us
            </h3>
            <ul className="space-y-3">
              {socials.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#C8F135] transition-colors duration-200"
                  >
                    <Icon size={14} className="opacity-70 shrink-0" />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C8F135]">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={15} className="shrink-0 mt-0.5 text-[#C8F135] opacity-70" />
                <span>Peruvayal, Kozhikode , Kerala</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={15} className="shrink-0 text-[#C8F135] opacity-70" />
                <a
                  href="mailto:ssfmavoordivision@gmail.com"
                  className="hover:text-[#C8F135] transition-colors"
                >
                 ssfmavoordivision@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={15} className="shrink-0 text-[#C8F135] opacity-70" />
                <span>9  AM – 10 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          <div className="text-xs text-gray-500 space-y-2 mb-10">
            <p>© {year} Sahityotsav. All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="text-gray-600">Powered by</span>
              <a
                href="https://ramfif.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-[#C8F135]/10 transition-all duration-300"
              >
                <Code size={12} className="text-[#C8F135]" />
                <span className="text-xs font-medium text-gray-400 group-hover:text-[#C8F135] transition-colors">
                  RAMFIF Technology
                </span>
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="tel:9961130563"
                className="group flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C8F135] transition-colors"
              >
                <Smartphone size={10} />
                <span>Dev: 9961130563</span>
              </a>
            </div>
            <p className="text-[11px] text-gray-600/60">
              Created with precision by RAMFIF • Let&apos;s build something great together
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-34 right-6 z-50 w-12 h-12 rounded-full bg-[#C8F135] text-black flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-[#C8F135]/20 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}
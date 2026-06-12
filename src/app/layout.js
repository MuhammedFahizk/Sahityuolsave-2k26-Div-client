import { Outfit, Luckiest_Guy, Leckerli_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavigationHandler from "@/components/NavigationHandler";
import Image from "next/image";
import { Analytics } from '@vercel/analytics/next';

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest",
  subsets: ["latin"],
  weight: "400",
});

const leckerliOne = Leckerli_One({
  variable: "--font-leckerli",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: {
    default: "SSF Sahityolsave 2026",
    template: "%s | SSF Sahityolsave 2026",
  },
  description: "SSF Thathoor Sector Sahityolsave 2026 — results, teams, gallery, and news.",
  keywords: ["SSF", "Sahityolsave", "Thathoor", "festival", "arts", "cultural"],
  authors: [{ name: "SSF Thathoor Sector" }],
  openGraph: {
    title: "SSF Sahityolsave 2026",
    description: "SSF Thathoor Sector — results, teams, gallery, and news.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${outfit.variable}
        ${luckiestGuy.variable}
        ${leckerliOne.variable}
        h-full
      `}
      suppressHydrationWarning
    >
      <body
        className="mb-2 relative"
        style={{ background: "#050c1a" }}
      >
        {/* ── LEFT art border strip ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: "6px",
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* art image — left edge slice */}
          <img
            src="/files/image.png"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "120px",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left center",
            }}
          />
          {/* darken overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,12,26,0.4)",
          }} />
          {/* green shimmer — fades in/out top and bottom */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(200,241,53,0.5) 0%, transparent 18%, transparent 82%, rgba(200,241,53,0.5) 100%)",
          }} />
        </div>

        {/* ── RIGHT art border strip ── */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "6px",
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* art image — right edge slice */}
          <img
            src="/files/image.png"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,12,26,0.4)",
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(200,241,53,0.5) 0%, transparent 18%, transparent 82%, rgba(200,241,53,0.5) 100%)",
          }} />
        </div>
          {/* ── Art image — top decorative strip (mobile) ── */}
      <div className="relative lg:hidden w-full z-50 overflow-hidden" style={{ height: "10px" }}>
        <Image
          src="/files/image.png"
          alt="Art"
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* heavy fade to section bg */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,12,26,0.1) 0%, rgba(5,12,26,0.98) 100%)",
        }}/>
        
      </div>
        {/* ── Page content ── */}
        <AuthProvider>
          <NavigationHandler>
            {children}
          </NavigationHandler>
        </AuthProvider>
        <div className="relative lg:hidden w-full overflow-hidden z-50" style={{ height: "20px" }}>
        <Image
          src="/files/image.png"
          alt="Art"
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* heavy fade to section bg */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,12,26,0.1) 0%, rgba(5,12,26,0.98) 100%)",
        }}/>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
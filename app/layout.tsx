import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif, Pinyon_Script } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import SiteDock from "@/components/SiteDock";
import Crosshair from "@/components/reactbits/Crosshair";
import BendsBackground from "@/components/BendsBackground";
import Loader from "@/components/Loader";
import { site, profile } from "@/lib/content";

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

// Serif italic untuk judul hero (gaya andreas.vision)
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s — ${profile.firstName} | ARSMTHHH` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    // gambar preview dibuat otomatis oleh app/opengraph-image.tsx
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${archivo.variable} ${plexMono.variable} ${script.variable} ${serif.variable}`}>
      <body className="grain min-h-dvh">
        <noscript>
          <style>{"#site-loader{display:none}"}</style>
        </noscript>
        <Loader />
        {/* React Bits — ColorBends: latar animasi di belakang bagian setelah hero */}
        <BendsBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue focus:px-4 focus:py-2 focus:text-white"
        >
          Lompat ke konten
        </a>
        <SmoothScroll>
          {children}
          <SiteDock />
          <ScrollToTop />
        </SmoothScroll>
        {/* React Bits — Crosshair di seluruh halaman (tanpa containerRef = menutupi viewport).
            Navy agar tetap terlihat di latar putih maupun blok biru; pointer-events none, jadi tidak menghalangi klik. */}
        <Crosshair
          color="#1B365D"
          targetEffect="lock"
          thickness={1}
          opacity={0.5}
          smoothing={0.35}
          gap={8}
          fade={0.35}
          showCoordinates
        />
      </body>
    </html>
  );
}

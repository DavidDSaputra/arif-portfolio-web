import type { Metadata, Viewport } from "next";
import { Fustat, Ranga } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import SiteDock from "@/components/SiteDock";
import Crosshair from "@/components/reactbits/Crosshair";
import Loader from "@/components/Loader";
import { site, profile } from "@/lib/content";

// Font ala pontofuba.com: Ranga (judul, condensed) + Fustat (teks)
const ranga = Ranga({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ranga",
  display: "swap",
});

const fustat = Fustat({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-fustat",
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
  themeColor: "#DCEDF5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${ranga.variable} ${fustat.variable}`}>
      <body className="grain min-h-dvh">
        <noscript>
          <style>{"#site-loader{display:none}"}</style>
        </noscript>
        <Loader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-blue focus:px-4 focus:py-2 focus:text-cream"
        >
          Lompat ke konten
        </a>
        <SmoothScroll>
          {children}
          <SiteDock />
          <ScrollToTop />
        </SmoothScroll>
        {/* React Bits — Crosshair di seluruh halaman (tanpa containerRef = menutupi viewport).
            Biru agar terlihat di latar pastel; pointer-events none, jadi tidak menghalangi klik. */}
        <Crosshair
          color="#005A9C"
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

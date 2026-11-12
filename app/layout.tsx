import type { Metadata, Viewport } from "next";
import { Anton, Share_Tech_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import SiteDock from "@/components/SiteDock";
import Cursor from "@/components/Cursor";
import Loader from "@/components/Loader";
import { site, profile } from "@/lib/content";

// Font ala yeahright.co: condensed super tebal (pengganti Druk) + mono + piksel
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-share-tech",
  display: "swap",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
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
  themeColor: "#E4E8FF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${anton.variable} ${shareTech.variable} ${silkscreen.variable}`}>
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
        {/* Kursor kustom (kotak kecil, membesar di atas link) */}
        <Cursor />
        {/* bingkai halaman (di atas semua konten, tidak menghalangi klik) */}
        <div aria-hidden className="page-frame" />
      </body>
    </html>
  );
}

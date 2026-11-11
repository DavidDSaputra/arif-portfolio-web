"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type FC, type SVGProps } from "react";
import Dock, { type DockItemData } from "./reactbits/Dock";
import { useLenis } from "./SmoothScroll";
import { contact, profile } from "@/lib/content";
import { Briefcase, Chart, Download, Home, Instagram, Layers, Mail, User, WhatsApp } from "./icons";

/** Section di beranda → item dock yang menyala (titik indikator). */
const SECTIONS = {
  top: ["top"],
  about: ["about"],
  work: ["work", "video-editing", "design-graphics", "cinematic", "event"],
  insight: ["insight"],
  skills: ["skills"],
  contact: ["brief", "contact"],
} as const;
type Key = keyof typeof SECTIONS;

/** Warna dock disesuaikan dengan palet portofolio (navy / biru / biru langit / biru es). */
const THEME = {
  "--dock-panel": "rgba(255, 255, 255, 0.78)",
  "--dock-panel-edge": "rgba(27, 54, 93, 0.12)",
  "--dock-panel-highlight": "rgba(255, 255, 255, 0.95)",
  "--dock-panel-shadow": "0 22px 44px -22px rgba(27, 54, 93, 0.45), 0 6px 18px -10px rgba(0, 90, 156, 0.3)",
  "--dock-tile": "linear-gradient(180deg, #ffffff 0%, #e4f3f9 100%)",
  "--dock-tile-edge": "rgba(27, 54, 93, 0.1)",
  "--dock-tile-highlight": "#ffffff",
  "--dock-tile-shadow": "0 4px 10px -5px rgba(27, 54, 93, 0.4)",
  "--dock-ink": "#005A9C",
  "--dock-label": "#1B365D",
  "--dock-label-ink": "#ffffff",
  "--dock-dot": "#005A9C",
  "--dock-separator": "rgba(27, 54, 93, 0.16)",
  "--dock-press": "brightness(0.92)",
} as CSSProperties;

function useMediaQuery(query: string, initial = true) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

const glyph = (Icon: FC<SVGProps<SVGSVGElement>>) => <Icon className="h-[1em] w-[1em]" />;

/** Navigasi dock (React Bits — Dock) di bawah layar, bertema portofolio. */
export default function SiteDock() {
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const wide = useMediaQuery("(min-width: 640px)");
  const [active, setActive] = useState<Key | null>("top");

  // Scrollspy: tandai section yang sedang dibaca
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const entries = Object.entries(SECTIONS) as [Key, readonly string[]][];
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((r) => {
          if (!r.isIntersecting) return;
          const hit = entries.find(([, ids]) => ids.includes(r.target.id));
          if (hit) setActive(hit[0]);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    entries.flatMap(([, ids]) => ids).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const go = (id: string) => {
    if (pathname !== "/") {
      router.push(id === "top" ? "/" : `/#${id}`);
      return;
    }
    const el = id === "top" ? null : document.getElementById(id);
    if (lenis) lenis.scrollTo(el ?? 0, { offset: el ? -72 : 0, duration: 1.4 });
    else if (el) el.scrollIntoView();
    else window.scrollTo({ top: 0 });
  };

  const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const downloadCv = () => {
    const a = document.createElement("a");
    a.href = profile.cv.href;
    a.download = "";
    a.click();
  };

  const nav = (key: Key, label: string, Icon: FC<SVGProps<SVGSVGElement>>, id: string = key): DockItemData => ({
    icon: glyph(Icon),
    label,
    active: active === key,
    onClick: () => go(id),
  });

  const items: DockItemData[] = [
    nav("top", "Beranda", Home),
    nav("about", "About", User),
    nav("work", "Karya", Briefcase),
    ...(wide ? [nav("insight", "Insight", Chart), nav("skills", "Skills", Layers)] : []),
    nav("contact", "Kontak", Mail),
    { separator: true },
    { icon: glyph(WhatsApp), label: "WhatsApp", onClick: () => openExternal(contact.whatsapp.href) },
    { icon: glyph(Instagram), label: "Instagram", onClick: () => openExternal(contact.instagram.href) },
    { icon: glyph(Download), label: profile.cv.label, className: "dock-cv", onClick: downloadCv },
  ];

  return (
    <nav aria-label="Navigasi cepat" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-28">
      <Dock
        items={items}
        theme="light"
        baseItemSize={46}
        magnification={68}
        distance={180}
        panelHeight={62}
        gap={8}
        roundness={0.55}
        accentColor="#005A9C"
        badgeColor="#60C1E5"
        className="pointer-events-auto"
        style={THEME}
      />
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, profile, site, socials } from "@/lib/content";
import { Scramble, WaveText } from "./ui";

const clockFmt = new Intl.DateTimeFormat(site.locale, {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const dateFmt = new Intl.DateTimeFormat(site.locale, {
  timeZone: site.timeZone,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, hour: "numeric", hour12: false });

/** Shift otomatis berdasarkan jam WIB. */
const shiftOf = (d: Date) => {
  const h = Number(hourFmt.format(d)) % 24;
  if (h >= 5 && h < 11) return "Shift pagi";
  if (h >= 11 && h < 15) return "Shift siang";
  if (h >= 15 && h < 19) return "Shift sore";
  return "Shift malam";
};

function StatusBar() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid gap-4 border-y border-line py-5 font-mono text-xs uppercase sm:grid-cols-4 sm:text-sm">
      <p className="flex items-center gap-2 text-blue">
        <i className="h-2 w-2 animate-pulse bg-blue" /> <Scramble text="Tersedia untuk proyek" />
      </p>
      <p className="text-fg">{profile.location} — WIB</p>
      <p className="text-fg sm:text-center">
        <time suppressHydrationWarning>{now ? `${clockFmt.format(now)} WIB` : "--:--:-- WIB"}</time>
        <span className="mt-1 block text-[11px] text-mute" suppressHydrationWarning>
          {now ? dateFmt.format(now) : " "}
        </span>
      </p>
      <p className="text-mute sm:text-right" suppressHydrationWarning>
        {now ? `${shiftOf(now)} (auto)` : " "}
      </p>
    </div>
  );
}

export default function Footer() {
  const year = new Intl.DateTimeFormat(site.locale, { timeZone: site.timeZone, year: "numeric" }).format(new Date());

  return (
    <footer className="border-t border-line">
      {/* pb ekstra agar baris terakhir tidak tertutup tombol scroll-to-top */}
      <div className="mx-auto max-w-[1600px] px-4 pb-48 pt-16 sm:px-8 md:pb-32">
        <StatusBar />
        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <WaveText lines={[`${profile.handle}.`]} className="display text-[clamp(3rem,9vw,7rem)] text-fg" />
            <p className="mt-3 font-mono text-xs uppercase text-mute">
              {profile.role} — [{profile.label}]
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="mb-4 font-mono text-xs uppercase text-blue">[ Menu ]</p>
              <ul className="space-y-2 font-mono text-sm uppercase">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="hover:text-navy">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-xs uppercase text-blue">[ Sosial ]</p>
              <ul className="space-y-2 font-mono text-sm uppercase">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-navy">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 font-mono text-xs uppercase text-blue">[ Lainnya ]</p>
              <ul className="space-y-2 font-mono text-sm uppercase">
                <li>
                  <a href={profile.cv.href} download className="hover:text-navy">
                    Unduh PDF
                  </a>
                </li>
                <li>
                  <a href="#main" className="hover:text-navy">
                    Kembali ke atas ↑
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase text-mute sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.handle.toUpperCase()} — Dibuat dengan cerita, bukan sekadar posting.
          </p>
          <p>Dibuat dengan Next.js — palet bisa diganti lewat tombol “Bosan?”</p>
        </div>
      </div>
    </footer>
  );
}

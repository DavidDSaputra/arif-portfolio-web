"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, profile, site, socials } from "@/lib/content";
import { Spark } from "./icons";

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

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute">
      <span className="text-blue">●</span> Waktu sekarang{" "}
      <time suppressHydrationWarning className="text-fg">
        {now ? `${clockFmt.format(now)} WIB` : "--:--:-- WIB"}
      </time>
      <span className="mt-1 block" suppressHydrationWarning>
        {now ? dateFmt.format(now) : " "}
      </span>
    </p>
  );
}

export default function Footer() {
  const year = new Intl.DateTimeFormat(site.locale, { timeZone: site.timeZone, year: "numeric" }).format(new Date());

  return (
    <footer className="border-t border-line">
      {/* pb ekstra agar baris terakhir tidak tertutup tombol scroll-to-top */}
      <div className="mx-auto max-w-[1440px] px-4 pb-48 pt-16 sm:px-8 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-[clamp(2.5rem,7vw,5rem)] text-blue">
              {profile.firstName}
              <Spark className="ml-2 inline h-[0.5em] w-[0.5em] align-middle text-fg" />
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-mute">
              {profile.role} — [{profile.label}]
            </p>
            <div className="mt-8">
              <Clock />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-blue">[ Menu ]</p>
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
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-blue">[ Sosial ]</p>
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
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-blue">[ Lainnya ]</p>
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

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-mute sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.handle.toUpperCase()} — Dibuat dengan cerita, bukan sekadar posting.
          </p>
          <p>Terinspirasi template “Fearless” by Oversight</p>
        </div>
      </div>
    </footer>
  );
}

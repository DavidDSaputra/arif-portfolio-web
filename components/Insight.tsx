"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { insights, insightTotals, sectionCopy, site } from "@/lib/content";
import { Kicker, Reveal, ScriptTitle } from "./ui";

const compact = new Intl.NumberFormat(site.locale, { notation: "compact", maximumFractionDigits: 1 });
const full = new Intl.NumberFormat(site.locale);

function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(value);
    const c = animate(0, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: setN });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} aria-label={format(value)}>
      <span aria-hidden>{format(n)}</span>
    </span>
  );
}

const stats = [
  { value: insightTotals.views, label: `Total tayangan dari ${insightTotals.videos} video`, fmt: (n: number) => compact.format(n).toUpperCase() },
  { value: insightTotals.topViews, label: "Tayangan video tertinggi", fmt: (n: number) => compact.format(n).toUpperCase() },
  { value: insightTotals.followers, label: "Pengikut baru dari 10 video", fmt: (n: number) => compact.format(n).toUpperCase() },
  { value: insightTotals.videos, label: "Video dengan data TikTok Studio", fmt: (n: number) => String(Math.round(n)) },
];

export default function Insight() {
  return (
    <section id="insight" aria-labelledby="insight-title" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-sky/25 blur-[120px]" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <Reveal>
          <Kicker title={sectionCopy.insight.kicker} tag={sectionCopy.insight.tag} />
          <ScriptTitle id="insight-title" words={["Insight", "Content"]} className="mt-6 text-[clamp(3rem,10vw,8rem)]" />
        </Reveal>

        <dl className="mt-14 grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex min-w-0 flex-col-reverse justify-end gap-3 border-b border-r border-line p-4 sm:p-8">
              <dt className="font-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-mute sm:text-xs">{s.label}</dt>
              <dd className="display whitespace-nowrap text-[clamp(1.75rem,8vw,4.5rem)] text-sky lg:text-[clamp(2rem,3.6vw,4.5rem)]">
                <CountUp value={s.value} format={s.fmt} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* Strip screenshot */}
      <div className="mt-14">
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:gap-6 sm:px-8"
          aria-label="Screenshot analitik TikTok Studio"
          tabIndex={0}
        >
          {insights.map((d, i) => (
            <li key={d.img.src} className="group w-[62vw] max-w-[230px] shrink-0 snap-start sm:w-[220px]">
              <figure>
                <div className="relative aspect-[504/1026] overflow-hidden rounded-[1.6rem] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
                  <Image src={d.img.src} alt={d.img.alt} fill sizes="230px" className="object-cover" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between font-mono text-xs uppercase">
                  <span className="text-mute">#{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-semibold text-sky">{full.format(d.views)}</span> views
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

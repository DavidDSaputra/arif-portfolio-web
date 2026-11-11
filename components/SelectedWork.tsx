"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { sectionCopy, works } from "@/lib/content";
import { ArrowUpRight } from "./icons";
import { Kicker, Reveal } from "./ui";

export default function SelectedWork() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-32">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="display text-[clamp(3rem,9vw,7.5rem)] text-orange-deep md:col-span-7">{sectionCopy.work.range}</p>
          <div className="md:col-span-5 md:pb-3 md:text-right">
            <h2 id="work-title" className="font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
              <span className="text-orange-deep">{sectionCopy.work.kicker}</span>{" "}
              <span className="mt-1 block text-ink/60 sm:inline">{sectionCopy.work.tag}</span>
            </h2>
          </div>
        </Reveal>

        <ul className="relative mt-14 border-t-2 border-ink" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          {works.map((w, i) => (
            <li
              key={w.slug}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                const r = e.currentTarget.parentElement!.getBoundingClientRect();
                if (active === null) {
                  // lompat langsung ke kursor agar preview tidak "terbang" dari pojok
                  sx.jump(e.clientX - r.left);
                  sy.jump(e.clientY - r.top);
                }
                x.set(e.clientX - r.left);
                y.set(e.clientY - r.top);
                setActive(i);
              }}
              className="border-b-2 border-ink"
            >
              <Link
                href={`/work/${w.slug}`}
                onFocus={() => setActive(null)}
                className="group relative grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-6 outline-none transition-colors duration-300 hover:bg-orange focus-visible:bg-orange sm:px-4 sm:py-8 md:grid-cols-[11rem_6rem_1fr_auto]"
              >
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] md:text-sm">{w.category}</span>
                <span className="hidden font-mono text-xs font-semibold md:block md:text-sm">{w.year ?? "—"}</span>
                <span className="display col-span-2 text-[clamp(2rem,6.5vw,5.25rem)] transition-transform duration-500 group-hover:translate-x-3 md:col-span-1">
                  {w.title}
                </span>
                <span className="col-start-2 row-start-1 grid h-11 w-11 place-items-center rounded-full border-2 border-ink transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-orange md:col-start-4 md:h-14 md:w-14">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                {/* thumbnail mobile */}
                <span className="relative col-span-2 block aspect-[16/9] overflow-hidden rounded-lg md:hidden">
                  <Image src={w.cover.src} alt="" fill sizes="100vw" className="object-cover" />
                </span>
                <span className="sr-only">
                  {w.year ? `, ${w.year}` : ""} — lihat detail
                </span>
              </Link>
            </li>
          ))}

          {/* Preview mengikuti kursor (desktop) */}
          <AnimatePresence>
            {active !== null && !reduce && (
              <motion.div
                aria-hidden
                key="preview"
                style={{ x: sx, y: sy }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
              >
                <div className="-translate-x-1/2 -translate-y-1/2 rotate-[-6deg]">
                  <div className="relative h-72 w-56 overflow-hidden rounded-xl border-4 border-ink shadow-2xl">
                    {works.map((w, i) => (
                      <Image
                        key={w.slug}
                        src={w.cover.src}
                        alt=""
                        fill
                        sizes="224px"
                        className={`object-cover transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

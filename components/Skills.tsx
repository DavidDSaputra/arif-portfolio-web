"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { sectionCopy, skills } from "@/lib/content";
import { Kicker, Marquee, Reveal, ScriptTitle, outExpo } from "./ui";

export default function Skills() {
  const reduce = useReducedMotion();

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative scroll-mt-20 overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:gap-10">
        {/* Kiri: judul + daftar (seperti slide PDF) */}
        <Reveal className="lg:col-span-5">
          <Kicker title={sectionCopy.skills.kicker} tag={sectionCopy.skills.tag} />
          <ScriptTitle id="skills-title" words={["Software", "Skills"]} className="mt-6 text-[clamp(2.75rem,7vw,6rem)]" />

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-sm uppercase tracking-[0.08em] sm:text-base">
            {skills.software.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                {s}
              </li>
            ))}
          </ul>

          <p className="mb-3 mt-12 font-mono text-xs uppercase tracking-[0.18em] text-mute">[ Keahlian ]</p>
          <ul className="flex flex-wrap gap-2">
            {skills.expertise.map((s) => (
              <li key={s} className="rounded-full bg-surface-2 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em]">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Kanan: grid logo 3×3 dengan glow oranye */}
        <div className="relative lg:col-span-7">
          <div aria-hidden className="pointer-events-none absolute inset-[12%] rounded-full bg-sky/25 blur-[90px]" />
          <ul className="relative mx-auto grid max-w-[520px] grid-cols-3 gap-x-5 gap-y-8 sm:gap-x-10 sm:gap-y-10" aria-label="Logo software yang dikuasai">
            {skills.logos.map((l, i) => (
              <motion.li
                key={l.name}
                initial={reduce ? false : { opacity: 0, scale: 0.6, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.12, ease: outExpo }}
                className="group flex flex-col items-center"
              >
                <div className="relative aspect-square w-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-2 group-hover:scale-105">
                  {/* glow per logo — terlihat juga lewat huruf W/X yang transparan, persis di PDF */}
                  <span aria-hidden className="absolute inset-[18%] rounded-full bg-sky/55 blur-xl transition-opacity duration-500 group-hover:bg-sky/80" />
                  <Image
                    src={l.src}
                    alt={`Logo ${l.name}`}
                    fill
                    sizes="(min-width: 640px) 150px, 28vw"
                    className="object-contain p-[6%] drop-shadow-[0_0_18px_rgba(0,90,156,0.45)]"
                  />
                </div>
                <span className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-mute transition-colors group-hover:text-blue sm:text-xs">
                  {l.name}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rotate-1 border-y border-blue py-4 text-blue">
        <Marquee items={[...new Set([...skills.logos.map((l) => l.name), ...skills.software])]} reverse duration={40} className="display text-[clamp(1.5rem,4vw,2.75rem)] [&_svg]:text-sky" />
      </div>
    </section>
  );
}

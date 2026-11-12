"use client";

import { motion, useReducedMotion } from "motion/react";
import { experience, profile, sectionCopy, skills } from "@/lib/content";
import { Squiggle } from "./icons";
import { Kicker, Reveal, ScriptTitle } from "./ui";
import IdLanyard from "./IdLanyard";

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-[1440px] scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Kartu ID 3D (React Bits — Lanyard); tali menggantung dari tepi atas section */}
        <div className="relative mx-auto -mt-24 w-full max-w-md md:-mt-32 lg:col-span-5 lg:max-w-none">
          <IdLanyard className="h-[560px] sm:h-[640px] lg:h-[720px]" />
          <p className="pointer-events-none mt-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
            [ Tarik kartunya · klik untuk membalik ]
          </p>
        </div>

        {/* Teks */}
        <div className="lg:col-span-7 lg:pl-6">
          <Reveal>
            <Kicker title={sectionCopy.about.kicker} />
            <h2 id="about-title" className="display mt-4 text-[clamp(3.5rem,17vw,10.5rem)] text-blue lg:text-[clamp(3.5rem,10.5vw,10.5rem)]">
              {profile.firstName}
            </h2>
            <p className="mt-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-mute sm:text-sm">
              {sectionCopy.about.tag}
            </p>
          </Reveal>

          <Squiggle className="my-8 w-36 text-blue" />

          <div className="space-y-5">
            {profile.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.08} y={24}>
                <p className={`font-mono leading-relaxed ${i === 2 ? "text-lg text-blue sm:text-xl" : "text-base text-fg/85 sm:text-lg"}`}>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-mute">[ Proyek untuk ]</p>
            <ul className="flex flex-wrap gap-2">
              {skills.fields.map((f) => (
                <li key={f} className="rounded-full border border-blue/60 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-blue">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Job Experience */}
      <div className="mt-28 md:mt-36">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <ScriptTitle words={["Job", "Experience"]} className="text-[clamp(2.75rem,8vw,6.5rem)]" />
          <Kicker title={sectionCopy.experience.tag} className="md:pb-3" />
        </Reveal>

        <ol className="mt-10 border-t border-line">
          {experience.map((e, i) => (
              <motion.li
                key={e.no}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 border-b border-line py-6 transition-colors hover:bg-panel sm:grid-cols-[5rem_1fr_auto] sm:px-4 sm:py-8"
              >
                <span className="font-mono text-sm font-semibold text-blue sm:text-base">{e.no}</span>
                <span className="display text-[clamp(1.6rem,5vw,3.75rem)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-navy">
                  {e.company}
                </span>
                {(e.role || e.period) && (
                  <span className="col-start-2 font-mono text-xs uppercase tracking-[0.14em] text-mute sm:col-start-3">
                    {[e.role, e.period].filter(Boolean).join(" · ")}
                  </span>
                )}
              </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

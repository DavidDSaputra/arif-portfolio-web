"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { credentials, experience, profile, sectionCopy, skills } from "@/lib/content";
import { Squiggle } from "./icons";
import { Kicker, Reveal, Scramble, ScriptTitle } from "./ui";
import IdLanyard from "./IdLanyard";

export default function About() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-[1440px] scroll-mt-20 px-4 py-24 sm:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Kartu ID 3D (React Bits — Lanyard); tali menggantung dari tepi atas section */}
        <div className="relative mx-auto -mt-24 w-full max-w-md md:-mt-32 lg:col-span-5 lg:max-w-none">
          <IdLanyard className="h-[560px] sm:h-[640px] lg:h-[720px]" />
          <p className="pointer-events-none mt-2 text-center font-mono text-[11px] uppercase text-mute">
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
            <p className="mt-2 font-mono text-xs uppercase text-mute sm:text-sm">
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
            <p className="mb-3 font-mono text-xs uppercase text-mute">[ Proyek untuk ]</p>
            <ul className="flex flex-wrap gap-2">
              {skills.fields.map((f) => (
                <li key={f} className="rounded-full border border-blue/60 px-4 py-2 font-mono text-xs uppercase text-blue">
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
          {experience.map((e, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={e.no}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-line"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`exp-${e.no}`}
                  data-cursor={isOpen ? "Tutup" : "Detail"}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 text-left transition-colors hover:bg-panel sm:grid-cols-[4rem_1fr_auto_2rem] sm:px-4 sm:py-8"
                >
                  <span className="font-mono text-sm text-blue sm:text-base">{e.no}</span>
                  <span className="display text-[clamp(1.75rem,5vw,4rem)] transition-transform duration-300 group-hover:translate-x-2">
                    {e.company}
                  </span>
                  <span className="col-start-2 font-mono text-xs uppercase text-mute sm:col-start-3 sm:text-sm">
                    {e.role} · {e.period}
                  </span>
                  <span
                    aria-hidden
                    className={`col-start-3 row-start-1 font-mono text-xl text-blue transition-transform duration-300 sm:col-start-4 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`exp-${e.no}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="grid gap-2 pb-8 pl-[3.5rem] pr-4 font-mono text-sm text-fg/85 sm:pl-[5rem] sm:text-base">
                        {e.points.map((p) => (
                          <li key={p} className="flex gap-3">
                            <span className="text-blue">→</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Pendidikan, pelatihan & kemampuan (dari CV) */}
      <div className="mt-24 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
        <div className="bg-paper p-6 sm:p-8">
          <p className="font-mono text-xs uppercase text-blue sm:text-sm">
            <Scramble text="[Pendidikan]" />
          </p>
          <p className="display mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)]">{credentials.education.school}</p>
          <p className="mt-2 font-mono text-sm uppercase text-mute">{credentials.education.major}</p>
          <p className="mt-8 font-mono text-xs uppercase text-blue sm:text-sm">
            <Scramble text="[Bahasa]" />
          </p>
          <p className="mt-3 font-mono text-sm text-fg/85">{credentials.languages}</p>
        </div>
        <div className="bg-paper p-6 sm:p-8">
          <p className="font-mono text-xs uppercase text-blue sm:text-sm">
            <Scramble text="[Pelatihan]" />
          </p>
          <ul className="mt-4 space-y-3 font-mono text-sm text-fg/85">
            {credentials.training.map((tr) => (
              <li key={tr} className="flex gap-3">
                <span className="text-blue">→</span>
                <span>{tr}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-paper p-6 sm:p-8">
          <p className="font-mono text-xs uppercase text-blue sm:text-sm">
            <Scramble text="[Hard skills]" />
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {credentials.hardSkills.map((s) => (
              <li key={s} className="border border-fg/20 px-2.5 py-1 font-mono text-xs uppercase">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-xs uppercase text-blue sm:text-sm">
            <Scramble text="[Soft skills]" />
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {credentials.softSkills.map((s) => (
              <li key={s} className="border border-fg/20 px-2.5 py-1 font-mono text-xs uppercase">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

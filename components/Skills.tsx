"use client";

import { sectionCopy, skills } from "@/lib/content";
import { Spark } from "./icons";
import { Kicker, Marquee, Reveal, ScriptTitle } from "./ui";

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Kicker title={sectionCopy.skills.kicker} tag={sectionCopy.skills.tag} />
          <ScriptTitle id="skills-title" words={["Software", "Skills"]} className="mt-6 text-[clamp(2.75rem,7vw,6rem)]" />

          <p className="mb-3 mt-12 font-mono text-xs uppercase tracking-[0.18em] text-mute">[ Keahlian ]</p>
          <ul className="flex flex-wrap gap-2">
            {skills.expertise.map((s) => (
              <li key={s} className="rounded-full bg-ink-3 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em]">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        <ol className="lg:col-span-7">
          {skills.software.map((s, i) => (
            <li key={s} className="group flex items-center justify-between border-b border-line py-3 sm:py-4">
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[clamp(1.75rem,5vw,3.75rem)] text-white/90 transition-colors duration-300 group-hover:text-orange">
                  {s}
                </span>
              </span>
              <Spark className="h-5 w-5 scale-0 text-orange transition-transform duration-300 group-hover:scale-100" />
            </li>
          ))}
        </ol>
      </div>

      <div className="rotate-1 border-y border-orange py-4 text-orange">
        <Marquee items={skills.software} reverse duration={36} className="display text-[clamp(1.5rem,4vw,2.75rem)] [&_svg]:text-white" />
      </div>
    </section>
  );
}

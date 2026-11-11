"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getWork, showcases, type Media } from "@/lib/content";
import { Play } from "./icons";
import { DetailLink, PhoneFrame, SlideHeader, outExpo } from "./ui";

type VideoMedia = Extract<Media, { kind: "video" }>;

/** Layar HP: poster + "Video menyusul", atau video yang main saat di-hover / diketuk. */
function ReelScreen({ m }: { m: VideoMedia }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => ref.current?.play().catch(() => {});
  const pause = () => ref.current?.pause();
  const toggle = () => (ref.current?.paused ? play() : pause());

  return (
    <div className="relative aspect-[9/16] w-full bg-surface" onMouseEnter={m.src ? play : undefined} onMouseLeave={m.src ? pause : undefined}>
      {m.src ? (
        <video
          ref={ref}
          src={m.src}
          poster={m.poster.src}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image src={m.poster.src} alt={m.poster.alt} fill sizes="(min-width: 768px) 230px, 45vw" className="object-cover" />
      )}

      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-gradient-to-t from-navy/50 via-transparent to-transparent">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-blue text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5" />
          </span>
        </div>
      )}

      {m.src ? (
        <button type="button" onClick={toggle} className="absolute inset-0" aria-label={`${playing ? "Jeda" : "Putar"} video: ${m.poster.alt}`} />
      ) : (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue">
          Video menyusul
        </span>
      )}
    </div>
  );
}

const tilt = [-2.5, 1.5, -1.5, 2.5];

/** Slide "Video Editing — Short / Vertical / Reels Videos" dari PDF. */
export default function VideoEditing() {
  const s = showcases.videoEditing;
  const work = getWork(s.slug);
  const reduce = useReducedMotion();
  if (!work) return null;
  const reels = work.media.filter((m): m is VideoMedia => m.kind === "video");

  return (
    <section id="video-editing" aria-labelledby="video-editing-title" className="relative scroll-mt-20 overflow-hidden border-b border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-10 h-[26rem] w-[26rem] rounded-full bg-sky/20 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-sky/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        <SlideHeader id="video-editing-title" words={s.words} subtitle={s.subtitle} tag={s.tag} />

        <ul className="mx-auto mt-14 grid max-w-[520px] grid-cols-2 gap-x-5 gap-y-10 sm:max-w-5xl sm:grid-cols-4 sm:gap-x-6 lg:mt-20 lg:gap-x-10">
          {reels.map((m, i) => (
            <motion.li
              key={m.poster.src}
              className="group"
              initial={reduce ? false : { opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : tilt[i % tilt.length] }}
              whileHover={reduce ? undefined : { y: -10, rotate: 0, transition: { duration: 0.5, ease: outExpo } }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: outExpo }}
            >
              <PhoneFrame>
                <ReelScreen m={m} />
              </PhoneFrame>
              {m.caption && <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.14em] text-mute">{m.caption}</p>}
            </motion.li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center lg:justify-end">
          <DetailLink href={`/work/${s.slug}`} />
        </div>
      </div>
    </section>
  );
}

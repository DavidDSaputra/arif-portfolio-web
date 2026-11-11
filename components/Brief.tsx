"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact, sectionCopy } from "@/lib/content";
import { ArrowRight, LongArrow } from "./icons";

type Fields = { name: string; email: string; location: string };
type Status = { type: "idle" } | { type: "error"; errors: Partial<Record<keyof Fields, string>> } | { type: "success"; link: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Nama minimal 2 huruf.";
  if (!emailRe.test(f.email.trim())) errors.email = "Format email belum benar.";
  if (f.location.trim().length < 2) errors.location = "Lokasi wajib diisi.";
  return errors;
}

const fieldsDef: { key: keyof Fields; label: string; type: string; autoComplete: string }[] = [
  { key: "name", label: "Nama depan", type: "text", autoComplete: "given-name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "location", label: "Lokasi", type: "text", autoComplete: "address-level2" },
];

export default function Brief() {
  const [f, setF] = useState<Fields>({ name: "", email: "", location: "" });
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(f);
    if (Object.keys(errors).length) {
      setStatus({ type: "error", errors });
      return;
    }
    const text = `Halo Arif! Saya ${f.name.trim()} dari ${f.location.trim()} (${f.email.trim()}). Saya tertarik kerja sama — boleh ngobrol soal proyek saya?`;
    const link = `${contact.whatsapp.href}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
    setStatus({ type: "success", link });
  };

  const errors = status.type === "error" ? status.errors : {};

  return (
    <section aria-labelledby="brief-title" className="relative overflow-hidden bg-orange text-ink">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-8 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="brief-title" className="display text-[clamp(2.5rem,6.5vw,5.25rem)]">
            {sectionCopy.brief.title}
          </h2>
          <p className="mt-6 max-w-md font-mono text-sm font-medium uppercase leading-relaxed">{sectionCopy.brief.body}</p>
          <LongArrow className="mt-10 hidden w-56 rotate-[8deg] lg:block" />
        </div>

        <form noValidate onSubmit={onSubmit} className="lg:col-span-7" aria-describedby="brief-status">
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {fieldsDef.map((d, i) => (
              <div key={d.key} className={i === 2 ? "sm:col-span-2" : ""}>
                <label htmlFor={`brief-${d.key}`} className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
                  {d.label} *
                </label>
                <input
                  id={`brief-${d.key}`}
                  name={d.key}
                  type={d.type}
                  required
                  autoComplete={d.autoComplete}
                  value={f[d.key]}
                  onChange={(e) => setF((p) => ({ ...p, [d.key]: e.target.value }))}
                  aria-invalid={!!errors[d.key]}
                  aria-describedby={errors[d.key] ? `brief-${d.key}-err` : undefined}
                  className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 font-mono text-lg outline-none placeholder:text-ink/40 focus:border-paper"
                />
                {errors[d.key] && (
                  <p id={`brief-${d.key}-err`} className="mt-2 font-mono text-xs font-semibold">
                    ✕ {errors[d.key]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-orange transition-colors hover:bg-paper hover:text-ink"
          >
            Kirim via WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div id="brief-status" aria-live="polite" className="mt-6 min-h-[3rem]">
            <AnimatePresence mode="wait">
              {status.type === "success" && (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-ink px-5 py-4 font-mono text-sm text-paper"
                >
                  ✓ Mantap, {f.name.trim()}! WhatsApp sudah dibuka di tab baru. Tidak terbuka?{" "}
                  <a href={status.link} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-4">
                    Klik di sini
                  </a>
                  .
                </motion.p>
              )}
              {status.type === "error" && (
                <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-mono text-sm font-semibold">
                  Ups — cek lagi kolom yang ditandai ya.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}

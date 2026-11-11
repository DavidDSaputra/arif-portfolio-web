import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MediaItem from "@/components/MediaItem";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Marquee, Pill } from "@/components/ui";
import { contact, works } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = works.find((x) => x.slug === slug);
  if (!w) return {};
  return {
    title: `${w.title} — ${w.category}`,
    description: w.summary,
    openGraph: { images: [{ url: w.cover.src, width: w.cover.w, height: w.cover.h }] },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const index = works.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const w = works[index];
  const next = works[(index + 1) % works.length];

  return (
    <>
      <Header />
      <main id="main" className="pt-24">
        <article>
          <header className="mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-8 md:pb-16">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-mute transition-colors hover:text-blue"
            >
              <ArrowLeft className="h-4 w-4" /> Semua karya
            </Link>

            <p className="mt-10 font-mono text-xs font-semibold uppercase tracking-[0.18em] sm:text-sm">
              <span className="text-blue">{w.category.toUpperCase()}</span>
              <span className="ml-3 text-mute">[{w.year ?? w.format.toUpperCase()}]</span>
            </p>
            <h1 className="display mt-4 text-[clamp(3rem,11vw,10rem)] text-blue">{w.title}</h1>

            <div className="mt-10 grid gap-10 lg:grid-cols-12">
              <p className="font-mono text-base leading-relaxed text-navy/85 sm:text-lg lg:col-span-7">{w.summary}</p>
              <dl className="grid grid-cols-1 gap-px self-start overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                {w.client && (
                  <div className="bg-white p-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Klien / Tempat</dt>
                    <dd className="mt-1 font-mono text-sm">{w.client}</dd>
                  </div>
                )}
                <div className="bg-white p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Output</dt>
                  <dd className="mt-1 font-mono text-sm">{w.format}</dd>
                </div>
                {w.facts.map((f) => (
                  <div key={f.label} className="bg-white p-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{f.label}</dt>
                    <dd className="mt-1 font-mono text-sm">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </header>

          <div className="bg-blue py-3 text-white">
            <Marquee items={[w.category, w.title, w.format]} duration={22} className="display text-2xl sm:text-4xl" />
          </div>

          <section aria-label="Galeri karya" className="mx-auto grid max-w-[1440px] gap-6 px-4 py-16 sm:grid-cols-2 sm:px-8 md:py-24 lg:grid-cols-3">
            {w.media.map((m, i) => (
              <MediaItem key={i} m={m} index={i} />
            ))}
          </section>
        </article>

        {/* Next project */}
        <section aria-label="Karya berikutnya" className="border-t border-line">
          <Link href={`/work/${next.slug}`} className="group mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-16 sm:px-8 md:grid-cols-12 md:py-24">
            <div className="md:col-span-8">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-mute">
                Karya berikutnya <span className="text-blue">[{next.category.toUpperCase()}]</span>
              </p>
              <p className="display mt-4 flex items-center gap-4 text-[clamp(2.5rem,8vw,7rem)] text-navy transition-colors group-hover:text-blue">
                {next.title}
                <ArrowRight className="h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-500 group-hover:translate-x-3" />
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:col-span-4">
              <Image src={next.cover.src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </Link>
        </section>

        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-3 px-4 pb-20 sm:px-8">
          <Pill href={contact.whatsapp.href} external>
            Let&apos;s talk <ArrowRight className="h-4 w-4" />
          </Pill>
          <Pill href="/#work" variant="ghost">
            Lihat semua karya
          </Pill>
        </div>
      </main>
      <Footer />
    </>
  );
}

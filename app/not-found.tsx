import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="display text-[clamp(6rem,30vw,18rem)] text-orange">404</p>
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-mute">[Halaman ini tidak ditemukan]</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-orange px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}

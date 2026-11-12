import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="display text-[clamp(6rem,30vw,18rem)] text-blue">404</p>
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-mute">[Halaman ini tidak ditemukan]</p>
        <Link href="/" className="mt-8 inline-block rounded-full border-2 border-blue bg-cream px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-blue">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}

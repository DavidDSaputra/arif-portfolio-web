# Portofolio ARSMTHHH

Website portofolio Samsul Maarif (ARSMTHHH), Social Media Specialist. Kontennya diambil dari PDF "NEW PORTFOLIO ARSMTHHH". Gayanya mengikuti template **Fearless**: latar gelap, aksen oranye, judul besar, kicker `[DALAM KURUNG SIKU]`, dan marquee.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (`motion/react`) · Lenis

## Menjalankan di komputer

```bash
npm install
npm run dev        # buka http://localhost:3000
npm run build      # cek build produksi
npm run typecheck  # cek TypeScript
```

## Ganti data = edit satu file

Semua teks, kontak, karya, skill, dan angka insight ada di **`lib/content.ts`**. Komponen hanya membaca dari file itu.

| Mau ganti… | Edit di `lib/content.ts` |
| --- | --- |
| Nama, role, bio | `profile` |
| WhatsApp, email, Instagram | `contact` |
| Pengalaman kerja (bisa tambah `role` & `period`) | `experience` |
| Deskripsi di kotak hero | `profile.summary` |
| Skill & software | `skills` (logo: `skills.logos`) |
| Angka TikTok Studio | `insights` (total dihitung otomatis) |
| Karya + halaman detail | `works` (1 item = 1 halaman `/work/<slug>`) |
| Section Event Project di beranda | `eventProject` |
| Kicker/judul section | `sectionCopy` |

## Slot aset

```
public/
├─ assets/photos/   hero.jpg, about.jpg            ← sudah ada (dari PDF)
├─ assets/work/     poster, banner, tiket, merch    ← sudah ada
├─ assets/insight/  insight-01..10.jpg             ← sudah ada (crop dari PDF)
├─ assets/software/ 9 logo software (PNG transparan) ← sudah ada (dari PDF)
├─ videos/          ← BELUM ADA: taruh file .mp4 di sini
└─ cv/              portfolio-arsmthhh.pdf         ← sudah ada (PDF asli, 13 MB)
```

### Menambahkan video (menyusul)

1. Di Canva, buka desain → **Bagikan → Unduh**. Pilih jenis file **MP4 Video**, lalu pilih halaman video yang mau diunduh. Untuk video yang di-upload sendiri, file aslinya juga bisa langsung dipakai.
2. Simpan dengan nama berikut:
   - `public/videos/reel-1.mp4` … `reel-4.mp4` (Short / Vertical / Reels)
   - `public/videos/bugel-beach.mp4` (Cinematic: Trip to Sukabumi)
3. Di `lib/content.ts`, tambahkan `src` pada item `kind: "video"`, contoh:
   ```ts
   { kind: "video", src: "/videos/reel-1.mp4", poster: reelPoster(1, …), caption: "Reels 01" },
   ```
   Selama `src` belum diisi, yang tampil adalah thumbnail dengan label **"Video menyusul"**.

Usahakan tiap video di bawah ±20 MB (kompres dengan HandBrake atau CapCut, 1080p, bitrate sedang). Kalau ingin lebih ringan, unggah ke YouTube/TikTok dan pakai link-nya.

## Deploy ke Vercel

1. Push repo ini ke GitHub:
   ```bash
   git remote add origin https://github.com/<username>/<nama-repo>.git
   git push -u origin main
   ```
2. Buka https://vercel.com/new → **Import** repo tersebut. Framework akan otomatis terdeteksi sebagai Next.js, jadi tidak ada setting yang perlu diubah.
3. (Opsional) Tambahkan Environment Variable `NEXT_PUBLIC_SITE_URL` = domain final, misalnya `https://arsmthhh.vercel.app`, agar preview link (Open Graph) memakai URL yang benar.
4. Klik **Deploy**. Setelah itu, setiap `git push` ke `main` otomatis memicu deploy ulang.

## Catatan

- Animasi (marquee, reveal, parallax, smooth scroll) otomatis mati bila perangkat memakai *Reduce Motion*.
- Jam di footer memakai zona waktu `Asia/Jakarta` (WIB) dengan locale `id-ID`.
- Form "Kirim brief" tidak butuh backend. Isinya dirangkai jadi pesan lalu dikirim lewat WhatsApp (`wa.me`).
- Gaya visual terinspirasi template "Fearless" by Oversight. Semua kode dan aset di repo ini milik pemilik portofolio.

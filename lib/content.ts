/**
 * SEMUA konten website ada di file ini.
 * Sumber: PDF "NEW PORTFOLIO ARSMTHHH" + poster yang dikirim terpisah.
 * Mau ganti data? Cukup edit file ini — komponen hanya membaca dari sini.
 */

export type Img = { src: string; w: number; h: number; alt: string };

export type Media =
  | ({ kind: "image"; caption?: string } & Img)
  | {
      kind: "video";
      /** Path file video di /public/videos. Kosongkan (undefined) bila belum ada → tampil poster + label "Video menyusul". */
      src?: string;
      poster: Img;
      caption?: string;
    };

export type Work = {
  slug: string;
  title: string;
  category: string;
  /** Tahun yang tertera di karya. Kosong bila PDF tidak menyebutkan. */
  year?: string;
  format: string;
  client?: string;
  cover: Img;
  summary: string;
  facts: { label: string; value: string }[];
  media: Media[];
};

/* ───────────────────────── IDENTITAS ───────────────────────── */

export const profile = {
  /** Nama tampilan (hero memakai firstName + lastName). */
  fullName: "Samsul Maarif",
  firstName: "SAMSUL",
  lastName: "MAARIF",
  handle: "arsmthhh",
  role: "Social Media Specialist",
  label: "Creative Design",
  experienceYears: "2+",
  intro:
    "Social Media Specialist dengan pengalaman lebih dari 2 tahun di dunia digital kreatif.",
  /** Deskripsi di "kotak ngebuka" hero (draf — silakan disesuaikan). */
  summary:
    "Samsul Maarif adalah Social Media Specialist dengan pengalaman lebih dari 2 tahun di dunia digital kreatif. Ia mengelola strategi konten, editing, dan fotografi untuk berbagai proyek — mulai dari brand, wedding, hingga event konser. Baginya, media sosial bukan sekadar posting, tapi cerita yang berkesan bagi audiens.",
  statement: ["LET'S WORK", "TOGETHER"],
  statementBody:
    "Saya percaya bahwa media sosial bukan sekadar posting, tapi tentang bagaimana menciptakan cerita dan pengalaman yang berkesan bagi audiens.",
  bio: [
    "Saya seorang Social Media Specialist dengan pengalaman lebih dari 2 tahun di dunia digital kreatif.",
    "Berpengalaman mengelola strategi konten, editing, dan fotografi untuk berbagai proyek — mulai dari brand, wedding, hingga event konser.",
    "Saya percaya bahwa media sosial bukan sekadar posting, tapi tentang bagaimana menciptakan cerita dan pengalaman yang berkesan bagi audiens.",
  ],
  photos: {
    hero: {
      src: "/assets/photos/hero.jpg",
      w: 651,
      h: 1156,
      alt: "Potret hitam-putih Samsul Maarif di hutan pinus, mengenakan masker dan jaket hitam",
    },
    about: {
      src: "/assets/photos/about.jpg",
      w: 900,
      h: 1600,
      alt: "Potret Samsul Maarif duduk santai berbaju hitam dengan poster-poster di dinding belakang",
    },
  } satisfies Record<string, Img>,
  cv: { href: "/cv/portfolio-arsmthhh.pdf", label: "Unduh Portofolio (PDF)" },
};

/* ───────────────────────── KONTAK ───────────────────────── */

const waNumber = "6287887092138";

export const contact = {
  whatsapp: {
    display: "0878-8709-2138",
    href: `https://wa.me/${waNumber}`,
    number: waNumber,
  },
  email: {
    display: "shoesofsmith3@gmail.com",
    href: "mailto:shoesofsmith3@gmail.com",
  },
  instagram: {
    display: "@arsmthhh",
    href: "https://instagram.com/arsmthhh",
  },
  ctas: { primary: "GET IN TOUCH", secondary: "LET'S START" },
};

export const socials = [
  { label: "Instagram", handle: contact.instagram.display, href: contact.instagram.href },
  { label: "WhatsApp", handle: contact.whatsapp.display, href: contact.whatsapp.href },
  { label: "Email", handle: contact.email.display, href: contact.email.href },
] as const;

/* ───────────────────────── PENGALAMAN ───────────────────────── */

/** PDF hanya mencantumkan nama tempat. Isi `role` / `period` bila ingin ditampilkan. */
export const experience: { no: string; company: string; role?: string; period?: string }[] = [
  { no: "01", company: "Lexus Auto Cars" },
  { no: "02", company: "Keranggan Fest" },
  { no: "03", company: "Permata Mutia Autocars" },
  { no: "04", company: "Permata Mutia Body Repair" },
];

/* ───────────────────────── SKILL ───────────────────────── */

export const skills = {
  expertise: ["Strategi Konten", "Video Editing", "Fotografi", "Desain Grafis", "Cinematic Video", "Event Project"],
  software: ["Canva", "CapCut", "Photoshop", "VN", "PicsArt", "Lightroom", "Microsoft Excel", "Microsoft Word"],
  /** Bidang proyek yang disebut di bio. */
  fields: ["Brand", "Wedding", "Event Konser"],
};

/* ───────────────────────── INSIGHT (TikTok Studio) ───────────────────────── */

/** Angka diambil dari 10 screenshot "Analisis video" TikTok Studio di PDF. */
export const insights: { views: number; newFollowers: number; img: Img }[] = [
  { views: 220179, newFollowers: 2448 },
  { views: 235504, newFollowers: 314 },
  { views: 445775, newFollowers: 278 },
  { views: 504293, newFollowers: 275 },
  { views: 498114, newFollowers: 1079 },
  { views: 859139, newFollowers: 1329 },
  { views: 2296817, newFollowers: 6499 },
  { views: 819981, newFollowers: 1022 },
  { views: 1695465, newFollowers: 3177 },
  { views: 368404, newFollowers: 794 },
].map((d, i) => ({
  ...d,
  img: {
    src: `/assets/insight/insight-${String(i + 1).padStart(2, "0")}.jpg`,
    w: 504,
    h: 1026,
    alt: `Screenshot TikTok Studio: ${d.views.toLocaleString("id-ID")} tayangan, ${d.newFollowers.toLocaleString("id-ID")} pengikut baru`,
  },
}));

export const insightTotals = {
  videos: insights.length,
  views: insights.reduce((a, b) => a + b.views, 0),
  followers: insights.reduce((a, b) => a + b.newFollowers, 0),
  topViews: Math.max(...insights.map((i) => i.views)),
};

/* ───────────────────────── KARYA ───────────────────────── */

const reelPoster = (n: number, w: number, h: number, alt: string): Img => ({
  src: `/assets/work/reel-${n}.jpg`,
  w,
  h,
  alt,
});

export const works: Work[] = [
  {
    slug: "keranggan-festival",
    title: "Keranggan Festival",
    category: "Event Project",
    year: "2024",
    format: "Banner / Ticket / Merchandise / Social Media",
    client: "Keranggan Fest",
    cover: {
      src: "/assets/work/poster-keranggan-fest.webp",
      w: 692,
      h: 864,
      alt: "Poster Keranggan Fest Vol.1 bertema luar angkasa dengan foto band-band pengisi acara",
    },
    summary:
      "Keranggan Fest Vol.1 — “a Decade Together”. Bazaar & Music Festival di Lap. Sepak Bola BKK Cere Keranggan, 7 Desember 2024. Identitas visual event dikerjakan menyeluruh: poster, banner panggung, tiket, merchandise official, hingga konten media sosial.",
    facts: [
      { label: "Tanggal", value: "7 Desember 2024" },
      { label: "Lokasi", value: "Lap. Sepak Bola BKK Cere Keranggan" },
      { label: "Tiket", value: "35K" },
      { label: "Merch", value: "Workshirt IDR 200K · T-Shirt IDR 150K" },
    ],
    media: [
      { kind: "image", src: "/assets/work/poster-keranggan-fest.webp", w: 692, h: 864, alt: "Poster utama Keranggan Fest Vol.1", caption: "Poster" },
      { kind: "image", src: "/assets/work/kf-banner-top.png", w: 1200, h: 220, alt: "Banner segitiga atap panggung Keranggan Fest", caption: "Banner — atap panggung" },
      { kind: "image", src: "/assets/work/kf-banner.jpg", w: 4671, h: 857, alt: "Banner panggung Keranggan Fest bertema galaksi", caption: "Banner panggung" },
      { kind: "image", src: "/assets/work/kf-ticket.png", w: 1000, h: 87, alt: "Desain gelang tiket Keranggan Fest Music Festival 7 Desember 2024", caption: "Ticket" },
      { kind: "image", src: "/assets/work/kf-merch-workshirt.png", w: 608, h: 1080, alt: "Poster merchandise workshirt official Keranggan Fest IDR 200K", caption: "Merchandise — Workshirt" },
      { kind: "image", src: "/assets/work/kf-merch-tshirt.png", w: 608, h: 1080, alt: "Poster merchandise T-shirt official Keranggan Fest IDR 150K", caption: "Merchandise — T-Shirt" },
      { kind: "image", src: "/assets/work/kf-social-feed.jpg", w: 334, h: 720, alt: "Feed Instagram Keranggan Fest berisi dokumentasi konser", caption: "Social Media" },
    ],
  },
  {
    slug: "short-vertical-reels",
    title: "Short / Vertical / Reels",
    category: "Video Editing",
    format: "Short-form video",
    client: "Showroom mobil",
    cover: reelPoster(2, 1280, 2276, "Frame reels: model berpose di depan MPV hitam dengan teks “Mobil seharga Avanza tapi senyaman Innova”"),
    summary:
      "Video vertikal untuk konten showroom mobil — hook kuat di detik pertama, teks besar yang langsung terbaca, dan ritme potongan yang pas untuk Reels & TikTok.",
    facts: [
      { label: "Format", value: "9:16 — Reels / TikTok / Shorts" },
      { label: "Hook", value: "“Cuma 9 juta aja”, “Mau tampil keren tapi budget ga nyampe?”" },
    ],
    media: [
      { kind: "video", poster: reelPoster(1, 1280, 2276, "Frame reels: MPV Kia hitam di jalan perumahan"), caption: "Reels 01" },
      { kind: "video", poster: reelPoster(2, 1280, 2276, "Frame reels: “Mobil seharga Avanza tapi senyaman Innova”"), caption: "Reels 02" },
      { kind: "video", poster: reelPoster(3, 406, 720, "Frame reels: BMW silver di showroom dengan teks “Cuma 9 juta aja”"), caption: "Reels 03" },
      { kind: "video", poster: reelPoster(4, 1280, 2276, "Frame reels: sedan hitam modifikasi dengan teks “Mau tampil keren tapi budget ga nyampe?”"), caption: "Reels 04" },
    ],
  },
  {
    slug: "poster-pamflet-brosur",
    title: "Poster / Pamflet / Brosur",
    category: "Digital Design Graphics",
    year: "2024 — 2025",
    format: "Print & digital",
    client: "Lexus Auto Cars · Permata Mutia Body Repair · Pemuda Keranggan",
    cover: {
      src: "/assets/work/promo-mazda-cx5.png",
      w: 486,
      h: 864,
      alt: "Poster promo Mazda CX-5 Elite 2019 TDP 0% dari Lexus Auto Cars",
    },
    summary:
      "Materi promosi untuk showroom, bengkel, dan acara warga — dari price list mobil, promo TDP 0%, price list body repair, sampai poster peringatan HUT RI ke-80.",
    facts: [
      { label: "Lexus Auto Cars", value: "Car Pricelist & promo Mazda CX-5 Elite 2019" },
      { label: "Permata Mutia", value: "Body Repair Price List" },
      { label: "Event", value: "Keranggan Fest Vol.1 · HUT RI ke-80 (17/08/2025)" },
    ],
    media: [
      { kind: "image", src: "/assets/work/promo-mazda-cx5.png", w: 486, h: 864, alt: "Poster promo Mazda CX-5 Elite 2019 TDP 0%", caption: "Promo — Lexus Auto Cars" },
      { kind: "image", src: "/assets/work/pricelist-lexus.png", w: 486, h: 864, alt: "Car Pricelist New Stock Oktober Lexus Auto Cars", caption: "Car Pricelist — Lexus Auto Cars" },
      { kind: "image", src: "/assets/work/pricelist-body-repair.png", w: 610, h: 864, alt: "Body Repair Price List Permata Mutia", caption: "Price List — Permata Mutia Body Repair" },
      { kind: "image", src: "/assets/work/poster-hut-ri-80.webp", w: 611, h: 864, alt: "Poster peringatan HUT RI ke-80 sekaligus menyambut Maulid Nabi", caption: "Poster — HUT RI ke-80" },
      { kind: "image", src: "/assets/work/poster-keranggan-fest.webp", w: 692, h: 864, alt: "Poster Keranggan Fest Vol.1", caption: "Poster — Keranggan Fest" },
    ],
  },
  {
    slug: "trip-to-sukabumi",
    title: "Trip to Sukabumi",
    category: "Cinematic Video",
    format: "Cinematic travel video",
    cover: {
      src: "/assets/work/bugel-beach.jpg",
      w: 1280,
      h: 720,
      alt: "Matahari terbenam di Pantai Bugel, Sukabumi",
    },
    summary: "Cinematic video perjalanan ke Sukabumi — Bugel Beach, menangkap suasana senja di tepi laut.",
    facts: [
      { label: "Lokasi", value: "Bugel Beach, Sukabumi" },
      { label: "Format", value: "16:9 cinematic" },
    ],
    media: [
      {
        kind: "video",
        poster: { src: "/assets/work/bugel-beach.jpg", w: 1280, h: 720, alt: "Matahari terbenam di Pantai Bugel, Sukabumi" },
        caption: "Bugel Beach",
      },
    ],
  },
];

/* ───────────────────────── NAVIGASI & SECTION ───────────────────────── */

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Insight", href: "/#insight" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export const marquee = [
  "Video Editing",
  "Digital Design Graphics",
  "Cinematic Video",
  "Event Project",
  "Insight Content",
  "Creative Design",
];

export const sectionCopy = {
  about: { kicker: "WHO AM I ?", tag: "[SOCIAL MEDIA SPECIALIST — 2+ TAHUN DI DUNIA DIGITAL KREATIF]" },
  experience: { kicker: "JOB EXPERIENCE", tag: "[TEMPAT SAYA BERKARYA]" },
  work: { range: "2023 — 2025", kicker: "SELECTED WORK", tag: "[POSTER, REELS, EVENT & CINEMATIC]" },
  insight: { kicker: "INSIGHT CONTENT", tag: "[ANGKA ASLI DARI TIKTOK STUDIO]" },
  skills: { kicker: "SOFTWARE SKILLS", tag: "[ALAT TEMPUR SEHARI-HARI]" },
  brief: {
    title: "PUNYA PROYEK? KIRIM BRIEF SINGKAT.",
    body: "Isi nama, email, dan lokasimu — pesan langsung terkirim lewat WhatsApp.",
  },
  contact: { kicker: "GET STARTED TODAY", title: "LET'S TALK" },
};

export const site = {
  title: "Samsul Maarif — Social Media Specialist | ARSMTHHH",
  description:
    "Portofolio Samsul Maarif (ARSMTHHH): Social Media Specialist — video editing, desain grafis, cinematic video, dan event project.",
  timeZone: "Asia/Jakarta",
  locale: "id-ID",
};

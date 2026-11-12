/**
 * Membuat gambar kartu ID (depan, belakang) + tali untuk komponen Lanyard.
 * Digambar di <canvas> saat runtime supaya memakai font situs (next/font) yang sudah dimuat.
 * Semua teks diambil dari lib/content.ts.
 */
import { contact, profile } from "./content";

export type IdCardImages = { front: string; back: string; strap: string };

const C = {
  navy: "#1B365D",
  blue: "#005A9C",
  sky: "#60C1E5",
  ice: "#A0E0EF",
  white: "#FFFFFF",
};

// Muka kartu Lanyard: lebar 1024px, rasio kartu portrait 1.6 × 2.25
const W = 1024;
const H = Math.round((W * 2.25) / 1.6);

const fontVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/** Gambar "cover" dengan titik fokus (fx, fy dalam 0..1). */
const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  fx = 0.5,
  fy = 0.5,
) => {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = Math.min(Math.max(img.width * fx - sw / 2, 0), img.width - sw);
  const sy = Math.min(Math.max(img.height * fy - sh / 2, 0), img.height - sh);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
};

const spaced = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: "center" | "left" = "center") => {
  ctx.letterSpacing = `${spacing}px`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.letterSpacing = "0px";
};

function drawFront(display: string, mono: string, photo: HTMLImageElement) {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;

  // dasar putih + header navy
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);
  const head = ctx.createLinearGradient(0, 0, W, 360);
  head.addColorStop(0, C.navy);
  head.addColorStop(1, C.blue);
  ctx.fillStyle = head;
  ctx.fillRect(0, 0, W, 360);
  // aksen diagonal biru langit
  ctx.fillStyle = C.sky;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(W * 0.62, 360);
  ctx.lineTo(W, 150);
  ctx.lineTo(W, 360);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.textBaseline = "middle";
  ctx.fillStyle = C.ice;
  ctx.font = `600 30px ${mono}`;
  spaced(ctx, "MY PORTFOLIO", W / 2, 170, 10);
  ctx.fillStyle = C.white;
  ctx.font = `600 26px ${mono}`;
  spaced(ctx, `[ ${profile.label.toUpperCase()} ]`, W / 2, 222, 8);

  // foto
  const px = 222;
  const py = 290;
  const pw = W - px * 2;
  const ph = 600;
  ctx.save();
  ctx.shadowColor = "rgba(27,54,93,0.35)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = C.white;
  roundRect(ctx, px - 14, py - 14, pw + 28, ph + 28, 40);
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 28);
  ctx.clip();
  drawCover(ctx, photo, px, py, pw, ph, 0.5, 0.46);
  ctx.restore();

  // nama
  ctx.fillStyle = C.navy;
  ctx.textAlign = "center";
  ctx.font = `900 132px ${display}`;
  ctx.fillText(profile.firstName, W / 2, 1010);
  ctx.fillStyle = C.blue;
  ctx.fillText(profile.lastName, W / 2, 1128);

  ctx.fillStyle = C.navy;
  ctx.font = `600 32px ${mono}`;
  spaced(ctx, profile.role.toUpperCase(), W / 2, 1222, 4);

  // strip bawah + "barcode"
  ctx.fillStyle = C.blue;
  ctx.fillRect(0, H - 150, W, 150);
  ctx.fillStyle = C.white;
  ctx.font = `600 34px ${mono}`;
  spaced(ctx, `@${profile.handle.toUpperCase()}`, 96, H - 75, 3, "left");
  let x = W - 96 - 260;
  const bars = [6, 2, 4, 2, 8, 3, 2, 6, 2, 4, 3, 7, 2, 5, 2, 3, 6, 2, 4, 2, 8, 3];
  bars.forEach((b, i) => {
    ctx.fillStyle = i % 3 === 0 ? C.ice : C.white;
    ctx.fillRect(x, H - 112, b, 74);
    x += b + 5;
  });

  return cv.toDataURL("image/jpeg", 0.92);
}

function drawBack(display: string, mono: string, script: string) {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, C.navy);
  bg.addColorStop(1, C.blue);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // lingkaran glow
  const glow = ctx.createRadialGradient(W * 0.8, H * 0.85, 0, W * 0.8, H * 0.85, 520);
  glow.addColorStop(0, "rgba(96,193,229,0.55)");
  glow.addColorStop(1, "rgba(96,193,229,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = C.white;
  ctx.shadowColor = "rgba(160,224,239,0.9)";
  ctx.shadowBlur = 30;
  ctx.font = `400 210px ${script}`;
  ctx.fillText("Samsul", W / 2, 470);
  ctx.shadowBlur = 0;

  ctx.fillStyle = C.ice;
  ctx.font = `900 88px ${display}`;
  ctx.fillText("LET'S WORK", W / 2, 700);
  ctx.fillText("TOGETHER", W / 2, 790);

  ctx.fillStyle = C.white;
  ctx.font = `500 34px ${mono}`;
  const lines = [`WA  ${contact.whatsapp.display}`, `IG  ${contact.instagram.display}`, contact.email.display];
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 960 + i * 64));

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `600 24px ${mono}`;
  spaced(ctx, `${profile.handle.toUpperCase()} — ${profile.label.toUpperCase()}`, W / 2, H - 110, 6);

  return cv.toDataURL("image/jpeg", 0.92);
}

function drawStrap(mono: string) {
  const cv = document.createElement("canvas");
  cv.width = 1400;
  cv.height = 150;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = C.navy;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = C.sky;
  ctx.fillRect(0, 10, cv.width, 5);
  ctx.fillRect(0, cv.height - 15, cv.width, 5);
  ctx.fillStyle = C.white;
  ctx.textBaseline = "middle";
  ctx.font = `600 56px ${mono}`;
  spaced(ctx, `${profile.handle.toUpperCase()} ✦ ${profile.label.toUpperCase()} ✦`, 40, cv.height / 2 + 2, 6, "left");
  return cv.toDataURL("image/png");
}

export async function buildIdCardImages(): Promise<IdCardImages> {
  const display = fontVar("--font-ranga", "Arial Narrow, sans-serif");
  const mono = fontVar("--font-fustat", "sans-serif");
  const script = fontVar("--font-ranga", "sans-serif");

  await Promise.all([
    document.fonts.load(`700 100px ${display}`),
    document.fonts.load(`600 30px ${mono}`),
    document.fonts.load(`500 30px ${mono}`),
    document.fonts.load(`400 100px ${script}`),
  ]).catch(() => undefined);
  await document.fonts.ready;

  const photo = await loadImg(profile.photos.about.src);
  return {
    front: drawFront(display, mono, photo),
    back: drawBack(display, mono, script),
    strap: drawStrap(mono),
  };
}

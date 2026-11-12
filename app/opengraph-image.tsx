import { ImageResponse } from "next/og";
import { LOGO_ACCENTS, LOGO_CELLS } from "@/lib/logo";
import { profile } from "@/lib/content";

export const alt = `${profile.fullName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";


// awan piksel di tepi (sama gayanya dengan hero)
const CLOUDS: [number, number, number, number, string][] = [
  [0, 0, 6, 1, "#1C2246"], [0, 1, 3, 1, "#A9B8FF"], [1, 2, 2, 1, "#1C2246"], [9, 0, 4, 1, "#1C2246"], [10, 1, 2, 1, "#A9B8FF"],
  [31, 0, 9, 1, "#1C2246"], [34, 1, 6, 1, "#A9B8FF"], [37, 2, 3, 1, "#E4E8FF"], [38, 3, 2, 1, "#1C2246"], [25, 0, 3, 1, "#A9B8FF"],
  [0, 19, 5, 2, "#1C2246"], [0, 18, 2, 1, "#A9B8FF"], [3, 20, 4, 1, "#A9B8FF"], [12, 20, 3, 1, "#1C2246"],
  [33, 19, 7, 2, "#1C2246"], [36, 18, 4, 1, "#A9B8FF"], [35, 20, 3, 1, "#E4E8FF"], [24, 20, 4, 1, "#1C2246"],
];

/** Gambar preview saat link dibagikan (WhatsApp, Instagram, dll.). */
export default function OpengraphImage() {
  const cell = 30; // grid awan 40×21
  const lc = 30; // piksel logo
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0A0D1F", fontFamily: "sans-serif" }}>
        {CLOUDS.map(([x, y, w, h, c], i) => (
          <div key={i} style={{ position: "absolute", left: x * cell, top: y * cell, width: w * cell, height: h * cell, background: c }} />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 110px", width: "100%" }}>
          {/* logo */}
          <div style={{ display: "flex", position: "relative", width: 300, height: 300, borderRadius: 64, background: "#A9B8FF", flexShrink: 0 }}>
            {LOGO_CELLS.map(({ x, y }) => (
              <div key={`${x}-${y}`} style={{ position: "absolute", left: 45 + x * lc, top: 45 + y * lc, width: lc, height: lc, background: "#0A0D1F" }} />
            ))}
            {LOGO_ACCENTS.map(({ x, y }) => (
              <div key={`a${x}-${y}`} style={{ position: "absolute", left: 45 + x * lc, top: 45 + y * lc, width: lc, height: lc, background: "#0A0D1F", opacity: 0.55 }} />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, letterSpacing: 6, color: "#A9B8FF", fontWeight: 700 }}>{`[ ${profile.label.toUpperCase()} ]`}</div>
            <div style={{ fontSize: 92, fontWeight: 900, color: "#E4E8FF", lineHeight: 1, marginTop: 14 }}>{profile.firstName}</div>
            <div style={{ fontSize: 92, fontWeight: 900, color: "#A9B8FF", lineHeight: 1 }}>{profile.lastName}</div>
            <div style={{ fontSize: 32, color: "#E4E8FF", marginTop: 22 }}>{profile.role}</div>
            <div style={{ fontSize: 24, color: "#7B7F93", marginTop: 10 }}>{`@${profile.handle} · arsmthhh.vercel.app`}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

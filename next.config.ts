import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Ada package-lock.json lain di folder induk (C:\laragon\www) — kunci root ke proyek ini.
  outputFileTracingRoot: path.join(__dirname),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;

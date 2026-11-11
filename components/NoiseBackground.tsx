"use client";

import { useEffect, useRef } from "react";

/**
 * Latar shader noise untuk bagian setelah hero (fixed, di belakang konten).
 * Awan noise biru muda yang bergeser pelan + butiran (grain) halus seperti film.
 * WebGL murni (tanpa three.js), 30 fps, berhenti saat tab tersembunyi, statis bila reduced-motion.
 * Atur kekuatannya lewat konstanta di bawah.
 */

const STRENGTH = 0.55; // 0 = putih polos, 1 = awan biru penuh
const GRAIN = 0.06; // kekuatan butiran
const SPEED = 0.04; // kecepatan gerak awan
const FRAME_MS = 1000 / 30;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uStrength;
uniform float uGrain;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  // domain warp → awan yang mengalir lembut
  vec2 q = vec2(fbm(uv * 1.6 + vec2(0.0, t)), fbm(uv * 1.6 + vec2(5.2, -t * 0.8)));
  float n = fbm(uv * 1.4 + 1.8 * q + vec2(t * 0.6, 0.0));

  vec3 white = vec3(1.0);
  vec3 ice = vec3(0.627, 0.878, 0.937);  // #A0E0EF
  vec3 sky = vec3(0.376, 0.757, 0.898);  // #60C1E5
  vec3 col = mix(white, ice, smoothstep(0.35, 0.75, n) * uStrength);
  col = mix(col, sky, smoothstep(0.62, 0.95, n) * uStrength * 0.7);

  // butiran film (berubah tiap frame)
  float g = hash(gl_FragCoord.xy + fract(t * 37.0) * 311.0) - 0.5;
  col += g * uGrain;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function NoiseBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    gl.uniform1f(gl.getUniformLocation(prog, "uStrength"), STRENGTH);
    gl.uniform1f(gl.getUniformLocation(prog, "uGrain"), GRAIN);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const draw = (time: number) => {
      gl.uniform1f(uTime, (time / 1000) * SPEED);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    resize();
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(canvas);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}

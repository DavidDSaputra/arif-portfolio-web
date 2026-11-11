"use client";

import { Fragment, forwardRef, useImperativeHandle, useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";

/**
 * Teks dengan animasi muncul per kata (gaya andreas.vision):
 * kotak piksel di sisi kata → kata "meletup" bertahap → bergeser ke tempatnya.
 * Kata bergantian dari kiri/kanan. CSS-nya ada di globals.css (.pw-*).
 * `lines` = tiap string jadi satu baris. Animasi baru mulai saat teks masuk layar (data-on).
 */
const PixelHeadline = forwardRef<
  HTMLHeadingElement,
  {
    lines: string[];
    as?: "h1" | "p";
    className?: string;
    lineClassName?: string;
    delay?: number;
    stagger?: number;
  }
>(function PixelHeadline({ lines, as: Tag = "h1", className = "", lineClassName = "", delay = 250, stagger = 80 }, ref) {
  const local = useRef<HTMLHeadingElement>(null);
  useImperativeHandle(ref, () => local.current as HTMLHeadingElement);
  const inView = useInView(local, { once: true, margin: "0px 0px -8% 0px" });
  let index = 0;
  return (
    <Tag
      ref={local as never}
      data-on={inView ? "" : undefined}
      className={`pw ${className}`}
      style={{ "--pw-delay": `${delay}ms`, "--pw-stagger": `${stagger}ms` } as CSSProperties}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} aria-hidden className={`block ${lineClassName}`}>
            {words.map((word, wi) => {
              const i = index++;
              return (
                <Fragment key={wi}>
                  <span className="pw-word" data-side={i % 2 ? "right" : "left"} style={{ "--i": i } as CSSProperties}>
                    <span className="pw-mark" />
                    <span className="pw-text">{word}</span>
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
});

export default PixelHeadline;

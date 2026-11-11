import { Fragment, forwardRef, type CSSProperties } from "react";

/**
 * Judul dengan animasi muncul per kata (gaya andreas.vision):
 * kotak piksel di sisi kata → kata "meletup" bertahap → bergeser ke tempatnya.
 * Kata bergantian dari kiri/kanan. CSS-nya ada di globals.css (.pw-*).
 */
const PixelHeadline = forwardRef<
  HTMLHeadingElement,
  { text: string; className?: string; delay?: number; stagger?: number }
>(function PixelHeadline({ text, className = "", delay = 250, stagger = 80 }, ref) {
  const words = text.split(" ");
  return (
    <h1
      ref={ref}
      aria-label={text}
      className={className}
      style={{ "--pw-delay": `${delay}ms`, "--pw-stagger": `${stagger}ms` } as CSSProperties}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span aria-hidden className="pw-word" data-side={i % 2 ? "right" : "left"} style={{ "--i": i } as CSSProperties}>
            <span className="pw-mark" />
            <span className="pw-text">{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
});

export default PixelHeadline;

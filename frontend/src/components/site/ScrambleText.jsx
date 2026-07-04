// Decode/scramble text reveal. Characters cycle through glyphs then resolve
// left-to-right when the element scrolls into view. Reduced-motion shows the
// final text immediately. Renders as a heading-friendly inline element.
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$/<>*";

export default function ScrambleText({
  text,
  as: Tag = "span",
  className = "",
  style,
  speed = 34,        // ms per tick
  revealEvery = 2,   // ticks before locking each next char
  ...rest
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(text);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      let tick = 0;
      const id = setInterval(() => {
        const locked = Math.floor(tick / revealEvery);
        if (locked >= text.length) {
          setDisplay(text);
          clearInterval(id);
          return;
        }
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (i < locked || ch === " ") out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        tick++;
      }, speed);
      cleanup.current = () => clearInterval(id);
    };

    const cleanup = { current: null };
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup.current && cleanup.current();
    };
  }, [text, speed, revealEvery]);

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {display}
    </Tag>
  );
}

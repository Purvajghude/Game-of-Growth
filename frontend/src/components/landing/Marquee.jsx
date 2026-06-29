// Slower, calmer marquee — ink on paper, no neon star
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Marquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const words = [
    "Brand identity",
    "Editorial web",
    "Product design",
    "Motion & film",
    "AI operations",
    "Studio thinking",
  ];

  return (
    <section ref={ref} className="relative bg-[var(--paper)] py-28 overflow-hidden grain-soft">
      <div className="absolute inset-0 bg-grid-fine pointer-events-none" />
      <motion.div style={{ x }} className="relative">
        <div className="py-3 border-y border-[var(--line)]">
          <div className="marquee-track whitespace-nowrap font-display leading-none" style={{ fontSize: "clamp(56px,10vw,160px)", fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
            {[...words, ...words, ...words].map((w, i) => (
              <span key={i} className="inline-flex items-baseline gap-8 px-2 italic text-[var(--ink)]">
                {w}
                <span className="text-[var(--accent)] font-display not-italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0" }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

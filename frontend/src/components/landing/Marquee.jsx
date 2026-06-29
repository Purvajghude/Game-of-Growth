// Magical transition marquee between Hero (dark) and Brutalism (yellow)
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

export default function Marquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.6]);

  const words = [
    "BRANDS THAT MOVE",
    "WEBSITES THAT CONVERT",
    "CONTENT THAT SPREADS",
    "AI THAT AUTOMATES",
    "DESIGN THAT WINS",
  ];

  return (
    <section ref={ref} className="relative bg-[#0a0a0b] py-24 overflow-hidden">
      <motion.div style={{ opacity }} className="relative">
        <motion.div style={{ rotate }} className="py-4 border-y border-white/10 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent">
          <div className="marquee-track whitespace-nowrap font-display italic text-[12vw] md:text-[8vw] leading-none text-white/90">
            {[...words, ...words, ...words].map((w, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-4">
                {w}
                <Star className="w-12 h-12 md:w-16 md:h-16 text-[#ffb800] fill-[#ffb800]" strokeWidth={1} />
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

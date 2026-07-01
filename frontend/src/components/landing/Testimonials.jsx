// Editorial testimonials — single quote, large portrait, slow crossfade
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANDING } from "@/constants/testIds";

const QUOTES = [
  { name: "Mira Castell",  role: "Founder, Atlas Labs",       img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85", text: "They're not an agency. They're an operating partner. They rebuilt our brand, our site and our pipeline — and we 4xed in a year." },
  { name: "Jonas Reyes",   role: "CEO, Northwind Outdoor",    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=900&q=85", text: "I've worked with seven agencies. None come close. The team obsesses, ships, and the work just looks better than anything we'd done before." },
  { name: "Priya Sharma",  role: "CMO, Halcyon Capital",      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=85", text: "The strategy was sharp, the work was beautiful, and the systems they built are still running, still printing leads, a year later." },
  { name: "Devon Park",    role: "Founder, Maven Studio",     img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=85", text: "They turned a half-thought into a category. Everyone in our space is now copying our positioning, our visuals, even our newsletter." },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const active = QUOTES[idx];
  return (
    <section data-testid={LANDING.sectionTestimonials} className="relative bg-[var(--paper-2)] py-16 lg:py-40 grain-soft overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="eyebrow">09 — From operators we've built with</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(48px, 6.5vw, 110px)" }}>Words that <em>land.</em></h2>
          </div>
          <div className="flex gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                data-cursor="hover"
                className={`w-2 h-2 rounded-full transition ${i === idx ? "bg-[var(--ink)] w-8" : "bg-[var(--line-2)] hover:bg-[var(--muted)]"}`}
                style={{ transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}
              />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="md:col-span-5 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-[var(--line-2)]"
              >
                <img src={active.img} alt={active.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(20,19,15,0.7))" }} />
                <div className="absolute bottom-6 left-6 right-6 text-[var(--paper)]">
                  <p className="font-display italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1", fontSize: 32 }}>{active.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest opacity-80 mt-1">{active.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="md:col-span-7 lg:col-span-7">
            <span className="font-display text-[120px] leading-none text-[var(--ink)]/15 select-none" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>“</span>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.text}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="-mt-10 font-display"
                style={{ fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1.18, fontVariationSettings: "'opsz' 144, 'SOFT' 30", color: "var(--ink)" }}
              >
                {active.text}
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-10 flex gap-3">
              <button onClick={() => setIdx((p) => (p - 1 + QUOTES.length) % QUOTES.length)} className="btn btn-ghost" data-cursor="hover">← Previous</button>
              <button onClick={() => setIdx((p) => (p + 1) % QUOTES.length)} className="btn btn-primary" data-cursor="hover">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

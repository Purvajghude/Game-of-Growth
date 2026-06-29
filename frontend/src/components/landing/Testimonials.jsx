import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { Quote } from "lucide-react";

const QUOTES = [
  {
    name: "Mira Castell",
    role: "Founder, Atlas Labs",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    text: "They're not an agency. They're an operating partner. They rebuilt our brand, our site and our pipeline — and we 4xed in a year.",
  },
  {
    name: "Jonas Reyes",
    role: "CEO, Northwind Outdoor",
    img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
    text: "I've worked with seven agencies. None come close. The team obsesses, ships, and the work just looks better than anything we'd done before.",
  },
  {
    name: "Priya Sharma",
    role: "CMO, Halcyon Capital",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    text: "The strategy was sharp, the work was beautiful, and the systems they built are still running, still printing leads, a year later.",
  },
  {
    name: "Devon Park",
    role: "Founder, Maven Studio",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    text: "They turned a half-thought into a category. Everyone in our space is now copying our positioning, our visuals, even our newsletter.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const active = QUOTES[idx];

  return (
    <section data-testid={LANDING.sectionTestimonials} className="bg-[#0a0a0b] py-32 relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-[#ffb800]/5 blur-3xl pointer-events-none" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 relative">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="section-label">10 / Words from operators</p>
            <h2 className="headline-massive text-[12vw] md:text-[90px] lg:text-[110px] mt-3 text-white">
              People we've <em>built with.</em>
            </h2>
          </div>
          <div className="flex gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition ${i === idx ? "bg-[#ffb800] scale-125" : "bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
              >
                <img src={active.img} alt={active.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display italic text-3xl text-white">{active.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-white/60 mt-1">{active.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="lg:col-span-7">
            <Quote className="w-12 h-12 text-[#ffb800]" />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-6 font-display italic text-3xl md:text-5xl leading-[1.1] text-white"
              >
                “{active.text}”
              </motion.blockquote>
            </AnimatePresence>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIdx((p) => (p - 1 + QUOTES.length) % QUOTES.length)} className="px-5 py-3 rounded-full border border-white/15 text-white hover:bg-white/5 transition text-sm font-sans">← Prev</button>
              <button onClick={() => setIdx((p) => (p + 1) % QUOTES.length)} className="px-5 py-3 rounded-full bg-white text-black hover:bg-[#ffb800] transition text-sm font-sans">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Light-theme brutalism — ink on paper, single clay accent, restrained but bold
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { name: "Northwind", tag: "DTC · Apparel",  year: "'25", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=85&auto=format&fit=crop" },
  { name: "Ferrofluid", tag: "Industrial · Hardware", year: "'25", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=85&auto=format&fit=crop" },
  { name: "Halcyon", tag: "Capital · Finance", year: "'24", img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1400&q=85&auto=format&fit=crop" },
  { name: "Maven", tag: "Studio · Creative", year: "'24", img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1400&q=85&auto=format&fit=crop" },
];

export default function Brutalism() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="work"
      data-testid={LANDING.sectionBrutalism}
      ref={ref}
      className="relative bg-[var(--paper)] py-28 lg:py-40 grain-soft overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-8">
            <p className="eyebrow">01 — Brand identity</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 8vw, 140px)" }}>
              Marks with <em>conviction.</em>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="lede max-w-md">
              Logos, type systems, voice, motion. Built to be defended in a board room and recognised in a feed.
            </p>
          </div>
        </div>

        <motion.div style={{ y }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.name}
              href="#"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="hover"
              className="group block bg-white brut-line brut-shadow rounded-[2px] overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--paper-2)]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1400ms]" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--paper)] px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase">{p.year}</div>
              </div>
              <div className="flex items-end justify-between px-6 py-5 border-t border-[var(--ink)]">
                <div>
                  <p className="eyebrow text-[var(--muted)]">{p.tag}</p>
                  <p className="font-display text-3xl mt-1 text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{p.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center group-hover:rotate-45 transition-transform duration-[700ms]" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

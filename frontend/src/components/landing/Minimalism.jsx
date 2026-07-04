// Apple-minimal product showcase — white, generous, type as hero, slow reveals
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";

const PRODUCTS = [
  { name: "Pulse",  sub: "Habit tracking, reimagined.", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1400&q=88&auto=format&fit=crop" },
  { name: "Ledger", sub: "A calmer way to manage money.", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1400&q=88&auto=format&fit=crop" },
  { name: "Tide",   sub: "Focus you can feel.", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1400&q=88&auto=format&fit=crop" },
];

function Item({ p, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className={`grid md:grid-cols-2 lg:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2 lg:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.div style={{ y: yImg }} className="relative aspect-[4/5] max-w-[460px] mx-auto w-full overflow-hidden rounded-[28px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] border border-[var(--line)]">
        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
      </motion.div>
      <div>
        <p className="eyebrow">Case study · 0{i + 1}</p>
        <h3 className="headline mt-3" style={{ fontSize: "clamp(48px, 6vw, 96px)" }}>{p.name}</h3>
        <p className="lede mt-3 max-w-md" style={{ fontSize: 22 }}>{p.sub}</p>
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
          {[["98","Score"],["4.9","Rating"],["120k","Users"]].map(([v,l]) => (
            <div key={l}>
              <p className="font-display text-3xl text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{v}</p>
              <p className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase mt-1">{l}</p>
            </div>
          ))}
        </div>
        <Link to="/contact" className="cursor-target mt-8 inline-flex items-center gap-2 text-[var(--ink)] border-b border-[var(--line-2)] pb-1 font-sans hover:border-[var(--ink)] transition" data-cursor="hover">Read the case study →</Link>
      </div>
    </motion.div>
  );
}

export default function Minimalism() {
  return (
    <section data-testid={LANDING.sectionMinimal} className="relative bg-white py-32 lg:py-44 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <p className="eyebrow">03 — Product design</p>
          <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 8vw, 140px)" }}>
            Beautifully <em>obvious.</em>
          </h2>
          <p className="lede mt-6 max-w-xl mx-auto">
            Mobile apps and digital products designed with restraint, intention, and an obsession for the small details.
          </p>
        </div>
        <div className="space-y-32 lg:space-y-44">
          {PRODUCTS.map((p, i) => <Item key={p.name} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

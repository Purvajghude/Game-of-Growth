// Light storefront — ivory tiles, ink accents, no gradient soup
import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight, Image, Film, Layers, BookOpen, Sparkles, FileCode } from "lucide-react";

const PRODUCTS = [
  { name: "Cinematic LUT Pack — vol 03", price: "$49",  tag: "LUTs · 24 looks",            icon: Film },
  { name: "Motion Pack — Liquid",        price: "$79",  tag: "After Effects · 36 assets", icon: Layers },
  { name: "Figma UI Kit — Linear",       price: "$129", tag: "Components · 240",          icon: FileCode },
  { name: "Design Asset Bundle",         price: "$59",  tag: "Textures · Frames · Grain", icon: Image },
  { name: "The Brand Operator",          price: "$29",  tag: "Book · 288 pages · PDF",    icon: BookOpen },
  { name: "AI Prompt Pack — Marketing",  price: "$39",  tag: "420 prompts",               icon: Sparkles },
];

export default function Storefront() {
  return (
    <section id="store" data-testid={LANDING.sectionStore} className="relative bg-[var(--paper)] py-28 lg:py-40 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="eyebrow">10 — Digital products</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 7.5vw, 130px)" }}>The <em>Store.</em></h2>
          </div>
          <p className="lede max-w-md">Tools we use ourselves. Crafted, polished, and shipped. Storefront launching Q2 2025.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="hover"
              className="group relative rounded-[18px] overflow-hidden border border-[var(--line-2)] bg-white hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)] transition-shadow duration-[800ms]"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              <div className="aspect-[5/4] relative overflow-hidden bg-[var(--paper-2)] border-b border-[var(--line)]">
                <div className="absolute inset-0 bg-grid-fine pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p.icon className="w-16 h-16 text-[var(--ink)]" strokeWidth={1.1} />
                </div>
                <div className="absolute top-4 left-4 font-mono text-[10px] text-[var(--ink-2)] bg-[var(--paper)] border border-[var(--line)] px-2 py-0.5 rounded">{p.tag}</div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[var(--ink)] text-[15.5px]">{p.name}</p>
                  <p className="font-mono text-[10.5px] text-[var(--muted)] uppercase tracking-widest mt-1">Coming soon</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{p.price}</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--ink)] group-hover:rotate-45 transition" style={{ transitionDuration: "700ms", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

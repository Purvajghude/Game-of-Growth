import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight } from "lucide-react";

const CASES = [
  {
    client: "Northwind Outdoor",
    industry: "DTC · Apparel",
    headline: "From boutique to category leader in 11 months.",
    before: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    metrics: [
      { v: "4.7x", l: "Revenue" },
      { v: "+412%", l: "Organic traffic" },
      { v: "3.1%", l: "Avg conv. rate" },
      { v: "22", l: "Press features" },
    ],
    tags: ["Brand", "Web", "Photo", "Paid"],
    accent: "#ff6a00",
  },
  {
    client: "Atlas Labs",
    industry: "SaaS · AI Platform",
    headline: "Re-positioned a confused tool into a $20M ARR product.",
    before: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    after: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    metrics: [
      { v: "$20M", l: "ARR run-rate" },
      { v: "3.4x", l: "Trial → paid" },
      { v: "→72%", l: "CAC payback" },
      { v: "9.1", l: "NPS" },
    ],
    tags: ["Strategy", "Brand", "Web", "PLG"],
    accent: "#7c3aed",
  },
];

export default function CaseStudies() {
  return (
    <section data-testid={LANDING.sectionCase} className="bg-[#0a0a0b] py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="section-label">09 / Selected Case Studies</p>
            <h2 className="headline-massive text-[12vw] md:text-[100px] lg:text-[120px] mt-3 text-white">
              Real <em>outcomes.</em>
            </h2>
          </div>
          <p className="max-w-md text-white/60">Some recent partner engagements — the work, the numbers, the receipts.</p>
        </div>

        <div className="space-y-32">
          {CASES.map((c, idx) => (
            <motion.article
              key={c.client}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-5">
                <div className="sticky top-32">
                  <p className="font-mono text-[11px] tracking-widest uppercase text-white/40">{c.industry}</p>
                  <h3 className="font-display italic text-5xl md:text-6xl text-white leading-[1] mt-3">{c.client}</h3>
                  <p className="mt-6 text-2xl md:text-3xl font-sans text-white/85 leading-snug">{c.headline}</p>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {c.metrics.map((m) => (
                      <div key={m.l} className="border-l border-white/10 pl-4">
                        <p className="font-display text-4xl text-white" style={{ color: c.accent }}>{m.v}</p>
                        <p className="font-mono text-[11px] text-white/50 tracking-widest uppercase mt-1">{m.l}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {c.tags.map((t) => <span key={t} className="px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono uppercase text-white/70">{t}</span>)}
                  </div>

                  <a href="#" className="mt-8 inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 font-sans">Read the full story <ArrowUpRight className="w-4 h-4" /></a>
                </div>
              </div>
              <div className="lg:col-span-7 grid grid-rows-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl group">
                  <img src={c.before} alt="before" className="w-full h-full object-cover grayscale" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-black/70 text-white/80 px-2 py-1 rounded">BEFORE</span>
                </div>
                <div className="relative overflow-hidden rounded-2xl group">
                  <img src={c.after} alt="after" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase text-black px-2 py-1 rounded" style={{ background: c.accent }}>AFTER</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Light immersive case studies — sticky meta + before/after with parallax
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight } from "lucide-react";

const CASES = [
  {
    client: "Northwind Outdoor",
    industry: "DTC · Apparel",
    headline: "From boutique to category leader in eleven months.",
    before: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=88",
    after:  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=88",
    metrics: [["4.7x","Revenue"],["+412%","Organic traffic"],["3.1%","Avg conv. rate"],["22","Press features"]],
    tags: ["Brand","Web","Photo","Paid"],
  },
  {
    client: "Atlas Labs",
    industry: "SaaS · AI Platform",
    headline: "Re-positioned a confused tool into a $20M ARR product.",
    before: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=88",
    after:  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=88",
    metrics: [["$20M","ARR run-rate"],["3.4x","Trial → paid"],["→72%","CAC payback"],["9.1","NPS"]],
    tags: ["Strategy","Brand","Web","PLG"],
  },
];

function Case({ c }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      className="grid md:grid-cols-12 lg:grid-cols-12 gap-10 lg:gap-14"
    >
      <div className="md:col-span-5 lg:col-span-5">
        <div className="sticky top-32">
          <p className="font-mono text-[10.5px] tracking-widest uppercase text-[var(--muted)]">{c.industry}</p>
          <h3 className="headline mt-3" style={{ fontSize: "clamp(44px, 5vw, 84px)" }}>{c.client}</h3>
          <p className="mt-6 lede max-w-md" style={{ fontSize: 22 }}>{c.headline}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {c.metrics.map(([v, l]) => (
              <div key={l} className="border-l border-[var(--line-2)] pl-4">
                <p className="font-display text-4xl text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{v}</p>
                <p className="font-mono text-[10.5px] text-[var(--muted)] tracking-widest uppercase mt-1">{l}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {c.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full border border-[var(--line-2)] text-[10.5px] font-mono uppercase text-[var(--ink-2)]">{t}</span>)}
          </div>
          <a href="#" className="mt-8 inline-flex items-center gap-2 text-[var(--ink)] border-b border-[var(--line-2)] hover:border-[var(--ink)] pb-1 font-sans transition" data-cursor="hover">Read the full story <ArrowUpRight className="w-4 h-4" /></a>
        </div>
      </div>
      <motion.div style={{ y }} className="md:col-span-7 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-[18px] border border-[var(--line-2)] aspect-[4/3] md:aspect-[4/5]">
          <img src={c.before} alt="before" className="w-full h-full object-cover grayscale" />
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-[var(--paper)] text-[var(--ink)] px-2 py-1 rounded border border-[var(--line)]">Before</span>
        </div>
        <div className="relative overflow-hidden rounded-[18px] border border-[var(--line-2)] group aspect-[4/3] md:aspect-[4/5]">
          <img src={c.after} alt="after" className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.04]" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-[var(--ink)] text-[var(--paper)] px-2 py-1 rounded">After</span>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function CaseStudies() {
  return (
    <section data-testid={LANDING.sectionCase} className="relative bg-[var(--paper)] py-16 lg:py-40 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-20">
          <div>
            <p className="eyebrow">08 — Selected case studies</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 7.5vw, 130px)" }}>Real <em>outcomes.</em></h2>
          </div>
          <p className="lede max-w-md">Some recent partner engagements — the work, the numbers, the receipts.</p>
        </div>
        <div className="space-y-28 lg:space-y-40">
          {CASES.map((c) => <Case key={c.client} c={c} />)}
        </div>
      </div>
    </section>
  );
}

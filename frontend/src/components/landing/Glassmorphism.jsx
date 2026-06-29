// Light warm "glass" — frosted ivory cards over a soft layered background, no neon
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";
import { Globe, ArrowUpRight } from "lucide-react";

const SITES = [
  { name: "Halcyon Capital", type: "Venture studio", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&q=85&auto=format&fit=crop", metric: "+289% MQLs" },
  { name: "Maven Studio",     type: "Creative agency", img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1400&q=85&auto=format&fit=crop", metric: "3.1s LCP" },
  { name: "Atlas Labs",       type: "SaaS platform", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=85&auto=format&fit=crop", metric: "4.7x conversion" },
];

export default function Glassmorphism() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yB = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yC = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section
      data-testid={LANDING.sectionGlass}
      ref={ref}
      className="relative bg-[var(--paper-2)] py-28 lg:py-40 grain-soft overflow-hidden"
    >
      {/* Subtle photographic backdrop */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <img src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=2400&q=80&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-grid-fine pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">02 — Editorial web</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 8vw, 140px)" }}>
              Sites that feel like <em>publications.</em>
            </h2>
          </div>
          <p className="lede lg:col-span-4 max-w-md">Marketing sites, SaaS landings and product surfaces — engineered for performance, designed to be remembered.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {SITES.map((s, i) => {
            const y = i === 0 ? yA : i === 1 ? yB : yC;
            return (
              <motion.div
                key={s.name}
                style={{ y }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-warm p-2.5 group"
                data-cursor="hover"
              >
                <div className="relative rounded-[14px] overflow-hidden aspect-[4/3] bg-[var(--paper)]">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.04]" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest opacity-85">{s.type}</p>
                      <p className="font-display text-lg mt-0.5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{s.name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[var(--ink-2)]">{s.metric}</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--ink-2)] group-hover:rotate-45 transition" style={{ transitionDuration: "700ms", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

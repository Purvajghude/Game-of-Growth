// Home "what we do" — an editorial index of services. Big interactive rows
// that shift and accent on hover, matching the site's numbered-list voice.
// Links through to Work; the deeper case studies live there.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LANDING } from "@/constants/testIds";

const SERVICES = [
  { n: "01", title: "Brand identity", desc: "Logos, type systems, voice and motion built to be recognised in a feed.", to: "/work" },
  { n: "02", title: "Social media", desc: "Strategy, content and community management that keeps you loud every week.", to: "/work" },
  { n: "03", title: "Content & film", desc: "On-location shoots, product demos, reels and brand films.", to: "/work" },
  { n: "04", title: "Editorial websites", desc: "Marketing sites and product surfaces engineered to convert.", to: "/work" },
  { n: "05", title: "Custom software", desc: "CRM, billing and inventory tools shaped around how you actually run.", to: "/contact" },
  { n: "06", title: "Apps", desc: "iOS and Android products taken from idea to the store.", to: "/contact" },
];

export default function Services() {
  return (
    <section id="services" data-testid={LANDING.sectionServices} className="relative bg-[var(--paper)] py-20 lg:py-32 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12 lg:mb-16">
          <div>
            <p className="eyebrow">What we make</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(44px, 6.5vw, 110px)" }}>
              One studio, <em>end to end.</em>
            </h2>
          </div>
          <p className="lede max-w-sm">
            Six disciplines under one roof, so an idea never gets lost between the people who make it.
          </p>
        </div>

        <div className="border-t border-[var(--line)]">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={s.to}
                className="cursor-target group flex items-center gap-6 py-6 lg:py-8 border-b border-[var(--line)] transition-colors"
                data-cursor="hover"
              >
                <span className="font-mono text-[11px] text-[var(--muted)] w-8 shrink-0">{s.n}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h3
                      className="font-display text-[var(--ink)] transition-transform duration-500 group-hover:translate-x-2"
                      style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30", fontSize: "clamp(28px, 4vw, 56px)", lineHeight: 1, transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                    >
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[15px] text-[var(--muted)] max-w-xl">{s.desc}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-[var(--muted)] shrink-0 transition-all duration-500 group-hover:text-[var(--ink)] group-hover:-translate-y-1 group-hover:translate-x-1" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

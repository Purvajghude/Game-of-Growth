// Luxury — stays dark with restrained matte gold, no glow effects
import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";

export default function Luxury() {
  return (
    <section
      data-testid={LANDING.sectionLuxury}
      className="relative py-32 lg:py-44 overflow-hidden grain-dark"
      style={{ background: "var(--night)", color: "var(--night-ink)" }}
    >
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="h-px w-24 mx-auto" style={{ background: "var(--gold)" }} />
          <p className="eyebrow mt-6" style={{ color: "var(--gold)", letterSpacing: "0.4em" }}>06 — The Premium Floor</p>
          <h2 className="headline mt-6" style={{ fontSize: "clamp(56px, 8vw, 140px)", color: "var(--night-ink)" }}>
            <span style={{ color: "var(--gold)" }}>For brands</span>
            <br/>that demand <em>restraint.</em>
          </h2>
          <p className="lede mt-6 max-w-xl mx-auto italic" style={{ color: "#bcb6aa", fontFamily: "var(--font-display)", fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1", fontSize: 21 }}>
            A small number of partner engagements every year. Bespoke, end-to-end, uncompromising.
          </p>
          <div className="h-px w-24 mx-auto mt-8" style={{ background: "var(--gold)" }} />
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-10">
          {[
            { name: "Aurum Watches", tag: "Heritage Re-launch", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=92" },
            { name: "Maison Vela",   tag: "Fragrance House",    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&q=92" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="hover"
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0" style={{ transition: "filter 1.6s cubic-bezier(0.16,1,0.3,1)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7))" }} />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{c.tag}</p>
                  <p className="font-display italic mt-3" style={{ color: "var(--night-ink)", fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1", fontSize: "clamp(36px, 4vw, 56px)" }}>{c.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center">
          <a href="#contact" className="inline-flex items-center gap-3 border px-9 py-4 font-display italic text-lg transition" style={{ borderColor: "var(--gold)", color: "var(--gold)", fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }} data-cursor="hover" onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--night)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--gold)"; }}>
            Inquire about a partner engagement →
          </a>
          <p className="mt-5 font-mono text-[10px] tracking-[0.3em]" style={{ color: "#8b8678" }}>LIMITED — 4 SEATS REMAINING IN 2025</p>
        </div>
      </div>
    </section>
  );
}

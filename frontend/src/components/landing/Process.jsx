import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { Search, Target, Brush, Camera, TrendingUp, Rocket } from "lucide-react";

const STEPS = [
  { n: "01", t: "Discovery", d: "We map your goals, audience, brand, and constraints. Two intensive workshops and a strategy brief that aligns everyone.", icon: Search, dur: "Week 1" },
  { n: "02", t: "Strategy", d: "Positioning, message architecture, channel plan, KPIs. We don't design anything until the strategy clears the bar.", icon: Target, dur: "Week 2" },
  { n: "03", t: "Design", d: "Identity, web, content systems and motion principles. We design in flow, with you. No black-box reveals.", icon: Brush, dur: "Week 3–5" },
  { n: "04", t: "Production", d: "Video, photo, dev, and asset libraries. We package everything for shipping at speed for the next 12 months.", icon: Camera, dur: "Week 5–7" },
  { n: "05", t: "Growth", d: "Cold + warm engines. Automations. Funnels. Reporting. We make the system run.", icon: TrendingUp, dur: "Week 7–10" },
  { n: "06", t: "Launch", d: "A flawless launch with motion, paid, organic and PR working in concert. Then we tune what's working.", icon: Rocket, dur: "Week 10+" },
];

export default function Process() {
  return (
    <section id="process" data-testid={LANDING.sectionProcess} className="bg-[#0a0a0b] py-32 relative">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="section-label">08 / The Process</p>
          <h2 className="headline-massive text-[12vw] md:text-[90px] lg:text-[110px] mt-3 text-white">
            How we <em>actually</em> ship.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px proc-rail hidden md:block" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative grid md:grid-cols-2 gap-6 md:gap-16 py-10 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}
            >
              <div className={`relative ${i % 2 === 0 ? "md:text-right" : ""}`}>
                <div className={`absolute top-3 ${i % 2 === 0 ? "md:-right-[57px] md:left-auto -left-3" : "-left-3 md:-left-[57px]"} w-6 h-6 rounded-full bg-[#ffb800] border-4 border-[#0a0a0b] hidden md:block`} />
                <p className="font-mono text-[11px] tracking-widest text-white/40">{s.dur}</p>
                <h3 className="font-display italic text-5xl md:text-6xl text-white mt-2">{s.t}</h3>
              </div>
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0">
                    <s.icon className="w-5 h-5 text-[#ffb800]" />
                  </div>
                  <div>
                    <p className="font-sans text-2xl font-light text-white"><span className="font-mono text-sm text-white/40 mr-3">{s.n}</span>{s.t}</p>
                    <p className="mt-3 text-white/60 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

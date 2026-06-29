// Light Apple-style process timeline
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";
import { Search, Target, Brush, Camera, TrendingUp, Rocket } from "lucide-react";

const STEPS = [
  { n: "01", t: "Discovery", d: "We map your goals, audience, brand, and constraints. Two intensive workshops and a strategy brief that aligns everyone.", icon: Search, dur: "Week 1" },
  { n: "02", t: "Strategy",  d: "Positioning, message architecture, channel plan, KPIs. We don't design anything until the strategy clears the bar.", icon: Target, dur: "Week 2" },
  { n: "03", t: "Design",    d: "Identity, web, content systems and motion principles. We design in flow, with you. No black-box reveals.", icon: Brush, dur: "Week 3–5" },
  { n: "04", t: "Production",d: "Video, photo, dev, and asset libraries. We package everything for shipping at speed for the next 12 months.", icon: Camera, dur: "Week 5–7" },
  { n: "05", t: "Growth",    d: "Cold + warm engines. Automations. Funnels. Reporting. We make the system run.", icon: TrendingUp, dur: "Week 7–10" },
  { n: "06", t: "Launch",    d: "A flawless launch with motion, paid, organic and PR working in concert. Then we tune what's working.", icon: Rocket, dur: "Week 10+" },
];

function Step({ s, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`relative grid md:grid-cols-12 gap-6 md:gap-12 py-10`}
    >
      <div className="md:col-span-4 md:text-right md:pr-8 md:border-r border-[var(--line)]">
        <p className="font-mono text-[10.5px] tracking-widest text-[var(--muted)] uppercase">{s.dur}</p>
        <h3 className="headline mt-2" style={{ fontSize: "clamp(40px, 5vw, 84px)" }}>{s.t}</h3>
      </div>
      <div className="md:col-span-7 md:pl-2">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl border border-[var(--line-2)] bg-white flex items-center justify-center shrink-0">
            <s.icon className="w-5 h-5 text-[var(--ink)]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-sans text-xl text-[var(--ink)]">
              <span className="font-mono text-xs text-[var(--muted)] mr-3">{s.n}</span>{s.t}
            </p>
            <p className="mt-3 text-[var(--ink-2)] leading-relaxed max-w-xl">{s.d}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Process() {
  return (
    <section id="process" data-testid={LANDING.sectionProcess} className="relative bg-[var(--paper)] py-28 lg:py-40 grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="eyebrow">07 — The process</p>
          <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 7.5vw, 130px)" }}>
            How we <em>actually</em> ship.
          </h2>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {STEPS.map((s, i) => <Step key={s.n} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

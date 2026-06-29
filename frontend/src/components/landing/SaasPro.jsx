// Pro SaaS — light version, Linear-light style, charcoal accents, NO neon
import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { Activity, Bot, Workflow, Database, Zap, Mail, ChevronRight } from "lucide-react";

export default function SaasPro() {
  return (
    <section
      id="services"
      data-testid={LANDING.sectionSaas}
      className="relative bg-[var(--paper)] py-28 lg:py-40 grain-soft overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="eyebrow">05 — AI & operations</p>
          <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 7.5vw, 130px)" }}>
            Operating systems for <em>modern teams.</em>
          </h2>
          <p className="lede mt-6 max-w-2xl">
            We design and deploy AI workflows, content pipelines and revenue systems that quietly do the work in the background — so you can focus on what only you can do.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-px bg-[var(--line)] rounded-[18px] overflow-hidden">
          {[
            { icon: Bot,       t: "AI Content Engine",       d: "Brand-trained writers that ship 30+ pieces a week, on-voice and on-time." },
            { icon: Workflow,  t: "Lead-to-Cash Workflow",   d: "Capture, qualify, schedule, propose, close — automated end-to-end." },
            { icon: Database,  t: "Operations Hub",          d: "A single source of truth: CRM, projects, documents, dashboards." },
            { icon: Mail,      t: "Outbound Systems",        d: "Deliverability-first cold outbound + nurture sequences that book calls." },
            { icon: Zap,       t: "Internal Tools",          d: "Custom tools for your team. Build once. Save hundreds of hours." },
            { icon: Activity,  t: "Analytics Stack",         d: "Pipelines, dashboards and weekly reviews — so you know what's working." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--paper)] p-7 group hover:bg-white transition-colors duration-700"
            >
              <div className="w-10 h-10 rounded-lg border border-[var(--line-2)] flex items-center justify-center mb-5">
                <f.icon className="w-4 h-4 text-[var(--ink)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-medium text-[20px] text-[var(--ink)] tracking-tight">{f.t}</h3>
              <p className="mt-2 text-[var(--muted)] leading-relaxed text-[15px]">{f.d}</p>
              <div className="mt-5 flex items-center text-[var(--muted)] group-hover:text-[var(--ink)] transition text-sm gap-1 font-mono">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* dashboard mock preview — light Notion-like */}
        <div className="mt-20 rounded-[18px] overflow-hidden border border-[var(--line-2)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_80px_-30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] bg-[var(--paper-2)]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-2)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-2)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-2)]" />
            </div>
            <span className="font-mono text-[11px] text-[var(--muted)]">growth-os.app/dashboard</span>
            <span className="font-mono text-[11px] text-[var(--muted)]">v 1.4.2</span>
          </div>
          <div className="grid grid-cols-12 gap-3 p-4">
            <div className="col-span-3 border border-[var(--line)] rounded-xl p-4">
              <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest">PIPELINE</p>
              <p className="font-display text-3xl mt-2" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>$284k</p>
              <p className="text-[var(--muted)] text-xs mt-1">+18% MoM</p>
            </div>
            <div className="col-span-3 border border-[var(--line)] rounded-xl p-4">
              <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest">LEADS</p>
              <p className="font-display text-3xl mt-2" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>142</p>
              <p className="text-[var(--muted)] text-xs mt-1">+9 this week</p>
            </div>
            <div className="col-span-6 border border-[var(--line)] rounded-xl p-4">
              <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest mb-3">ACTIVE AUTOMATIONS</p>
              <div className="space-y-2">
                {["Lead capture → Notion → Slack","Proposal generator (AI)","Newsletter pipeline"].map((x) => (
                  <div key={x} className="flex items-center justify-between text-sm text-[var(--ink-2)]">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />{x}</span>
                    <span className="font-mono text-[10px] text-[var(--muted)]">running</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

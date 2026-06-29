import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { Activity, Bot, Workflow, Database, Zap, Mail, ArrowUpRight, ChevronRight } from "lucide-react";

export default function SaasPro() {
  return (
    <section
      id="services"
      data-testid={LANDING.sectionSaas}
      className="saas-bg py-32 relative overflow-hidden"
    >
      {/* subtle radial */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="section-label text-white/50">06 / AI + Automation</p>
          <h2 className="font-sans font-medium text-5xl md:text-6xl lg:text-7xl tracking-tight mt-3 leading-[1.05]">
            Operating systems for <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">modern teams.</span>
          </h2>
          <p className="mt-6 text-white/60 text-lg max-w-2xl">
            We design and deploy AI workflows, content pipelines and revenue systems
            that quietly do the work in the background — so you can focus on what only you can do.
          </p>
        </div>

        {/* feature grid */}
        <div className="mt-16 grid lg:grid-cols-3 gap-4">
          {[
            { icon: Bot, t: "AI Content Engine", d: "Brand-trained writers that ship 30+ pieces a week, on-voice and on-time." },
            { icon: Workflow, t: "Lead-to-Cash Workflow", d: "Capture, qualify, schedule, propose, close — automated end-to-end." },
            { icon: Database, t: "Operations Hub", d: "A single source of truth: CRM, projects, documents, dashboards." },
            { icon: Mail, t: "Outbound Systems", d: "Deliverability-first cold outbound + nurture sequences that actually book calls." },
            { icon: Zap, t: "Internal Tools", d: "Custom tools for your team. Build once. Save hundreds of hours." },
            { icon: Activity, t: "Analytics Stack", d: "Pipelines, dashboards and weekly reviews — so you actually know what's working." },
          ].map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="saas-card p-6 hover:border-white/20 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-cyan-300" />
              </div>
              <h3 className="font-sans font-medium text-xl text-white">{f.t}</h3>
              <p className="mt-2 text-white/60 leading-relaxed text-[15px]">{f.d}</p>
              <div className="mt-4 flex items-center text-white/40 group-hover:text-white transition text-sm gap-1 font-mono">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* dashboard mock preview */}
        <div className="mt-20 saas-card p-2 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[11px] text-white/40">growth-os.app/dashboard</span>
            <span className="font-mono text-[11px] text-white/40">v 1.4.2</span>
          </div>
          <div className="grid grid-cols-12 gap-3 p-3">
            <div className="col-span-3 saas-card p-4">
              <p className="font-mono text-[10px] text-white/40 tracking-widest">PIPELINE</p>
              <p className="text-3xl mt-2 font-medium">$284k</p>
              <p className="text-emerald-400 text-xs mt-1">+18% MoM</p>
            </div>
            <div className="col-span-3 saas-card p-4">
              <p className="font-mono text-[10px] text-white/40 tracking-widest">LEADS</p>
              <p className="text-3xl mt-2 font-medium">142</p>
              <p className="text-emerald-400 text-xs mt-1">+9 this week</p>
            </div>
            <div className="col-span-6 saas-card p-4">
              <p className="font-mono text-[10px] text-white/40 tracking-widest mb-3">ACTIVE AUTOMATIONS</p>
              <div className="space-y-2">
                {["Lead capture → Notion → Slack","Proposal generator (AI)","Newsletter pipeline"].map((x) => (
                  <div key={x} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{x}</span>
                    <span className="font-mono text-[10px] text-white/40">running</span>
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

import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight, Image, Film, Layers, BookOpen, Sparkles, FileCode } from "lucide-react";

const PRODUCTS = [
  { name: "Cinematic LUT Pack — vol 03", price: "$49", tag: "LUTs · 24 looks", icon: Film, color: "from-orange-400 to-rose-500" },
  { name: "Motion Pack — Liquid", price: "$79", tag: "After Effects · 36 assets", icon: Layers, color: "from-cyan-400 to-blue-500" },
  { name: "Figma UI Kit — Linear", price: "$129", tag: "Components · 240", icon: FileCode, color: "from-violet-400 to-fuchsia-500" },
  { name: "Design Asset Bundle", price: "$59", tag: "Textures · Frames · Grain", icon: Image, color: "from-emerald-400 to-teal-500" },
  { name: "The Brand Operator (book)", price: "$29", tag: "288 pages · PDF", icon: BookOpen, color: "from-amber-400 to-orange-500" },
  { name: "AI Prompt Pack — Marketing", price: "$39", tag: "420 prompts", icon: Sparkles, color: "from-yellow-400 to-amber-500" },
];

export default function Storefront() {
  return (
    <section id="store" data-testid={LANDING.sectionStore} className="bg-[#0a0a0b] py-32 relative">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="section-label">11 / Digital Products</p>
            <h2 className="headline-massive text-[12vw] md:text-[100px] lg:text-[120px] mt-3 text-white">
              The <em>Store.</em>
            </h2>
          </div>
          <p className="max-w-md text-white/60">Tools we use ourselves. Crafted, polished, and shipped. (Storefront launching Q2 2025.)</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              data-cursor="hover"
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/30 transition"
            >
              <div className={`aspect-[5/4] relative overflow-hidden bg-gradient-to-br ${p.color}`}>
                <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ background: "radial-gradient(circle at 20% 20%, white, transparent 60%)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p.icon className="w-20 h-20 text-white/90" strokeWidth={1.2} />
                </div>
                <div className="absolute top-4 left-4 font-mono text-[10px] text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded">{p.tag}</div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-sans text-white text-base">{p.name}</p>
                  <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest mt-1">Coming soon</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-white">{p.price}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:rotate-45 transition" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

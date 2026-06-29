import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight, Globe } from "lucide-react";

const SITES = [
  {
    name: "Halcyon Capital",
    type: "Venture Studio",
    img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop",
    metric: "+289% MQLs",
  },
  {
    name: "Maven Studio",
    type: "Creative Agency",
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80&auto=format&fit=crop",
    metric: "3.1s LCP",
  },
  {
    name: "Atlas Labs",
    type: "SaaS Platform",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
    metric: "4.7x conv.",
  },
];

export default function Glassmorphism() {
  return (
    <section
      data-testid={LANDING.sectionGlass}
      className="relative glass-bg py-32 overflow-hidden"
    >
      {/* floating spheres */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="text-center mb-20">
          <p className="section-label text-white/60">03 / Web Design</p>
          <h2 className="headline-massive text-white text-[12vw] md:text-[100px] lg:text-[120px] mt-3">
            Websites that <br/>feel like <em className="text-white/80">future.</em>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-white/70 text-lg">
            Marketing sites, SaaS landings, conversion machines — engineered with
            performance and built to convert.
          </p>
        </div>

        {/* floating cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SITES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card p-3 group relative"
              data-cursor="hover"
              style={{ transform: i === 1 ? "translateY(-30px)" : "" }}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-white/5">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-white/70">{s.type}</p>
                    <p className="font-sans font-medium text-white text-lg">{s.name}</p>
                  </div>
                  <div className="glass-card !p-2 !rounded-full">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 flex items-center justify-between">
                <span className="font-mono text-[12px] text-[#a78bfa]">{s.metric}</span>
                <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:rotate-45 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

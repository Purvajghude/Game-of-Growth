import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { name: "NORTHWIND", tag: "Brand Identity", color: "#ff3b30", year: "'25" },
  { name: "FERROFLUID", tag: "Visual System", color: "#0a0a0b", year: "'25" },
  { name: "NEONCHAIN", tag: "Logo + Web3 Brand", color: "#7c3aed", year: "'24" },
  { name: "HALCYON", tag: "Naming + Identity", color: "#0066ff", year: "'24" },
];

export default function Brutalism() {
  return (
    <section
      id="work"
      data-testid={LANDING.sectionBrutalism}
      className="relative brut-bg py-32 overflow-hidden"
    >
      {/* big stickers/marks */}
      <div className="absolute top-12 right-12 brut-sticker hidden md:flex" style={{ transform: "rotate(8deg)" }}>BRANDING 01</div>
      <div className="absolute bottom-16 left-12 brut-sticker hidden md:flex" style={{ transform: "rotate(-12deg)", background: "#ff3b30", color: "#fff", borderColor: "#0a0a0b" }}>NEW WORK</div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* heading */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <p className="section-label text-black/70">02 / Branding</p>
            <h2 className="font-sans font-black text-[12vw] md:text-[120px] lg:text-[160px] leading-[0.85] tracking-tighter mt-2">
              BRANDS<br/>THAT BITE.
            </h2>
          </div>
          <p className="max-w-md font-sans text-black text-lg leading-snug">
            We build brand worlds with edge — logos, type systems, voice, motion. No
            mood-board mush. Just bold marks that people remember.
          </p>
        </div>

        {/* project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.name}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group brut-border brut-shadow bg-white relative block"
              data-cursor="hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden" style={{ background: p.color }}>
                {/* abstract brand mark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-display italic text-white text-[18vw] md:text-[12vw] leading-none mix-blend-difference"
                    style={{ color: "#fff" }}
                  >
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute top-4 left-4 brut-sticker" style={{ position: "absolute", background: "#ffd400", color: "#0a0a0b", borderColor: "#0a0a0b" }}>{p.year}</div>
              </div>
              <div className="flex items-center justify-between p-5 border-t-[3px] border-black">
                <div>
                  <p className="font-mono text-[11px] tracking-widest text-black/60 uppercase">{p.tag}</p>
                  <p className="font-sans font-black text-2xl mt-0.5 text-black">{p.name}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-black text-yellow-400 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* huge button */}
        <div className="mt-16 flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-3 bg-black text-yellow-400 px-10 py-6 brut-shadow font-sans font-black text-xl uppercase tracking-tight">
            Start a Brand Project <ArrowUpRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}

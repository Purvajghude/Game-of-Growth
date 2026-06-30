// Editorial maximalism — stays dark for contrast, but uses ink + warm gold tones (NO cyan/violet)
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LANDING } from "@/constants/testIds";
import { Play } from "lucide-react";

const POSTERS = [
  { tag: "Direction", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=88", rot: -3 },
  { tag: "Photography", img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&q=88", rot: 4 },
  { tag: "Motion", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=88", rot: -2 },
];

export default function Maximalism() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y3 = useTransform(scrollYProgress, [0, 1], [120, -120]);

  return (
    <section
      data-testid={LANDING.sectionMaxi}
      ref={ref}
      className="relative py-16 lg:py-40 overflow-hidden grain-dark"
      style={{ background: "var(--night)", color: "var(--night-ink)" }}
    >
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-20 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow" style={{ color: "#a8a298" }}>04 — Social, content, film</p>
            <h2 className="headline mt-4" style={{ fontSize: "clamp(56px, 8.5vw, 150px)", color: "var(--night-ink)" }}>
              The work that gets <em>screenshot.</em>
            </h2>
          </div>
          <p className="lede lg:col-span-4 max-w-md" style={{ color: "#bcb6aa" }}>
            Reels, short films, photo direction, editorial moments — the kind of content people send to friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {POSTERS.map((p, i) => {
            const y = i === 0 ? y1 : i === 1 ? y2 : y3;
            return (
              <motion.div
                key={p.tag}
                style={{ y }}
                initial={{ opacity: 0, y: 60, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: p.rot }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.3, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="hover"
                className="relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden border-[6px] border-[#ece8de]">
                  <img src={p.img} alt={p.tag} className="w-full h-full object-cover grayscale-[20%]" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(12,11,9,0.5))" }} />
                  <span className="absolute top-4 left-4 font-display text-3xl" style={{ color: "var(--night-ink)", fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{p.tag}</span>
                  <span className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#ece8de] text-[var(--night)] flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current" />
                  </span>
                </div>
                <p className="mt-3 font-mono text-[10px] tracking-widest uppercase" style={{ color: "#a8a298" }}>Editorial · 0{i + 1}</p>
              </motion.div>
            );
          })}
        </div>

        {/* metric strip */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-[#2a2823]">
          {[
            { v: "11.2M", l: "Views generated" },
            { v: "+278%", l: "Avg follower growth" },
            { v: "640",   l: "Pieces shipped /yr" },
            { v: "42",    l: "Brands scaled" },
          ].map((s, i) => (
            <div key={s.l} className={`py-10 ${i !== 0 ? "md:border-l border-[#2a2823]" : ""} px-6`}>
              <p className="font-display text-5xl" style={{ color: "var(--night-ink)", fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{s.v}</p>
              <p className="font-mono text-[10px] tracking-widest mt-2 uppercase" style={{ color: "#a8a298" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

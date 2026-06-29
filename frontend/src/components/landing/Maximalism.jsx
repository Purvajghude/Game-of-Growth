import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { Play, Camera, Film, Sparkles } from "lucide-react";

const POSTERS = [
  { tag: "REELS", img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80", rot: -4, color: "#ff2d55" },
  { tag: "PHOTO", img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=900&q=80", rot: 5, color: "#00ffd5" },
  { tag: "VIDEO", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&q=80", rot: -2, color: "#ffea00" },
];

export default function Maximalism() {
  return (
    <section
      data-testid={LANDING.sectionMaxi}
      className="relative maxi-bg py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <p className="section-label text-white/70">05 / Social + Content + Video</p>
            <h2 className="font-bricolage font-black text-[14vw] md:text-[120px] lg:text-[160px] leading-[0.85] tracking-tighter mt-3">
              <span className="block">LOUD.</span>
              <span className="block italic font-display">visceral.</span>
              <span className="block text-[#ffea00]">UNFORGETTABLE.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-32">
            <p className="text-xl md:text-2xl text-white/90 font-bricolage leading-snug">
              We make scroll-stopping content. Reels, short films, photo direction,
              meme-y editorial work. Stuff your audience screenshots and sends.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap font-mono text-[11px] tracking-widest uppercase">
              {["Direction","Production","Edit","Sound","Color","Captions"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-white text-black">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {POSTERS.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: p.rot }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className="relative"
              data-cursor="hover"
            >
              <div className="relative aspect-[3/4] overflow-hidden" style={{ background: p.color, border: "4px solid #fff" }}>
                <img src={p.img} alt={p.tag} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${p.color}80)` }} />
                <span className="absolute top-4 left-4 font-bricolage font-black text-5xl text-white drop-shadow-lg">{p.tag}</span>
                <span className="absolute bottom-4 right-4 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center">
                  <Play className="w-6 h-6 fill-black" />
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-widest text-white/80">EDITORIAL · 0{i + 1}</p>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* metric strip */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "11.2M", l: "Views generated" },
            { v: "+278%", l: "Avg follower growth" },
            { v: "640", l: "Pieces shipped /yr" },
            { v: "42", l: "Brands scaled" },
          ].map((s) => (
            <div key={s.l} className="bg-white text-black p-6 rounded-2xl">
              <p className="font-bricolage font-black text-5xl">{s.v}</p>
              <p className="font-mono text-[11px] tracking-widest mt-2 uppercase text-black/60">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";

export default function Luxury() {
  return (
    <section data-testid={LANDING.sectionLuxury} className="lux-bg py-32 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="lux-line my-6" />
          <p className="section-label lux-gold tracking-[0.4em]">07 — The Premium Floor</p>
          <h2 className="font-display italic text-[12vw] md:text-[100px] lg:text-[130px] leading-[0.95] mt-6">
            <span className="lux-gold">For brands</span>
            <br/>that demand <em className="text-white">restraint.</em>
          </h2>
          <p className="mt-6 text-[#c9c0a3] text-lg font-display italic max-w-xl mx-auto">
            A small number of partner engagements every year. Bespoke, end-to-end,
            uncompromising. From identity to motion to the smallest microinteraction.
          </p>
          <div className="lux-line my-6" />
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          {[
            { name: "Aurum Watches", tag: "Heritage Re-launch", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=85" },
            { name: "Maison Vela", tag: "Fragrance House", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&q=85" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, delay: i * 0.15 }}
              data-cursor="hover"
              className="group relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-mono text-[11px] tracking-[0.3em] lux-gold uppercase">{c.tag}</p>
                  <p className="font-display italic text-5xl text-[#f1ead4] mt-2">{c.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center">
          <a href="#contact" className="inline-flex items-center gap-3 border border-[#d4a648] lux-gold px-8 py-4 rounded-none font-display italic text-lg hover:bg-[#d4a648] hover:text-black transition">
            Inquire about a partner engagement →
          </a>
          <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-[#9c916e]">LIMITED — 4 SEATS REMAINING IN 2025</p>
        </div>
      </div>
    </section>
  );
}

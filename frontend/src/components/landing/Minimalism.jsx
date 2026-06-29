import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";

const PRODUCTS = [
  {
    name: "Pulse",
    sub: "Habit tracking, reimagined.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80&auto=format&fit=crop",
  },
  {
    name: "Ledger",
    sub: "A calmer way to manage money.",
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80&auto=format&fit=crop",
  },
  {
    name: "Tide",
    sub: "Focus you can feel.",
    img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=900&q=80&auto=format&fit=crop",
  },
];

export default function Minimalism() {
  return (
    <section data-testid={LANDING.sectionMinimal} className="apple-bg py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="text-center mb-24">
          <p className="section-label text-black/50">04 / Product Design</p>
          <h2 className="font-display text-[12vw] md:text-[110px] lg:text-[140px] leading-[0.95] tracking-tight mt-3 text-[#1d1d1f]">
            Beautifully <em>obvious.</em>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-black/60 text-lg font-sans">
            Mobile apps and digital products designed with restraint, intention,
            and an obsession for the small details.
          </p>
        </div>

        <div className="space-y-32">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="apple-card overflow-hidden aspect-[4/5]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="section-label text-black/50 mb-2">CASE STUDY · 0{i + 1}</p>
                <h3 className="font-display text-6xl md:text-8xl text-[#1d1d1f] leading-[1]">{p.name}</h3>
                <p className="mt-4 text-xl md:text-2xl text-black/60 font-sans">{p.sub}</p>
                <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <p className="text-3xl font-display text-[#1d1d1f]">98</p>
                    <p className="font-mono text-[11px] tracking-wider text-black/40 uppercase">Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-display text-[#1d1d1f]">4.9</p>
                    <p className="font-mono text-[11px] tracking-wider text-black/40 uppercase">Rating</p>
                  </div>
                  <div>
                    <p className="text-3xl font-display text-[#1d1d1f]">120k</p>
                    <p className="font-mono text-[11px] tracking-wider text-black/40 uppercase">Users</p>
                  </div>
                </div>
                <a href="#contact" className="mt-8 inline-flex items-center gap-2 text-[#1d1d1f] underline underline-offset-4 font-sans">Read the case study →</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

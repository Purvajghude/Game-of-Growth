import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";
import { LANDING } from "@/constants/testIds";

export default function Hero() {
  const orb1 = useRef(null);
  const orb2 = useRef(null);
  const orb3 = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      if (orb1.current) orb1.current.style.transform = `translate3d(${dx * 40}px, ${dy * 40}px, 0)`;
      if (orb2.current) orb2.current.style.transform = `translate3d(${dx * -60}px, ${dy * -60}px, 0)`;
      if (orb3.current) orb3.current.style.transform = `translate3d(${dx * 30}px, ${dy * -20}px, 0)`;
      if (layerRef.current) layerRef.current.style.transform = `translate3d(${dx * -10}px, ${dy * -10}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section data-testid={LANDING.hero} className="relative min-h-[100vh] w-full overflow-hidden bg-[#0a0a0b]">
      {/* gradient orbs */}
      <div ref={orb1} className="hero-orb" style={{ width: 520, height: 520, left: "-10%", top: "15%", background: "radial-gradient(circle, #ffb800 0%, transparent 70%)" }} />
      <div ref={orb2} className="hero-orb" style={{ width: 620, height: 620, right: "-15%", top: "5%", background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
      <div ref={orb3} className="hero-orb" style={{ width: 480, height: 480, left: "30%", bottom: "-20%", background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />

      {/* grid overlay */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* noise + vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.45) 100%)" }} />

      {/* floating glass labels */}
      <div ref={layerRef} className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[6%] top-[28%] hidden lg:block"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-3 float">
            <p className="font-mono text-[10px] text-white/50 tracking-widest">CASE — 01</p>
            <p className="font-sans text-sm text-white mt-1">+412% organic traffic</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-[8%] top-[22%] hidden lg:block"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-3 float" style={{ animationDelay: '1.2s' }}>
            <p className="font-mono text-[10px] text-white/50 tracking-widest">SOCIAL — 03</p>
            <p className="font-sans text-sm text-white mt-1">11.2M views generated</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="absolute right-[14%] bottom-[18%] hidden lg:block"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-3 float" style={{ animationDelay: '0.5s' }}>
            <p className="font-mono text-[10px] text-white/50 tracking-widest">AI WORKFLOW</p>
            <p className="font-sans text-sm text-white mt-1">38h saved / week</p>
          </div>
        </motion.div>
      </div>

      {/* center content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10 pt-40 lg:pt-44 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center gap-2 mb-8 justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono tracking-widest text-white/70">
            <Sparkles className="w-3 h-3 text-[#ffb800]" />
            DESIGN · BRAND · AI AUTOMATION
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="headline-massive text-center text-[14vw] sm:text-[12vw] md:text-[140px] lg:text-[180px] glow-text"
        >
          <span className="block font-sans not-italic font-semibold tracking-tight text-white text-[10vw] sm:text-[7vw] md:text-[64px] lg:text-[72px] mb-2">
            Game of
          </span>
          <span className="text-white">Growth.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-10 text-center max-w-2xl mx-auto text-white/60 text-base md:text-lg font-sans leading-relaxed"
        >
          We design brands, websites & AI systems that move the needle.
          Cinematic creative × sharp strategy × automation that works while you sleep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mt-12 flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="#contact"
            data-testid={LANDING.heroPrimaryCta}
            className="btn-pill btn-pill-primary"
          >
            Let's Build Your Growth Machine
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="#work"
            data-testid={LANDING.heroSecondaryCta}
            className="btn-pill btn-pill-ghost"
          >
            View Portfolio
          </a>
        </motion.div>

        {/* logos strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/40">TRUSTED BY OPERATORS, FOUNDERS & TEAMS</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white/40">
            {["NORTHWIND","ATLAS·Labs","Halcyon","FERROFLUID","Maven·Studio","NEONCHAIN"].map((n) => (
              <span key={n} className="font-display italic text-xl">{n}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 text-white/40" />
      </motion.div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { LANDING } from "@/constants/testIds";
import { Canvas } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GridGrain from "./GridGrain";

gsap.registerPlugin(ScrollTrigger);

const WebGLBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* We won't set a background color here to let the underlying var(--paper) show through */}
        <ambientLight intensity={0.5} />
        {/* Starfield with var(--ink) colored stars or subtle colors to match light/dark mode */}
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1.5} color="#888" />
        <Sparkles count={150} scale={12} size={1.5} speed={0.4} opacity={0.3} color="#555" />
      </Canvas>
    </div>
  );
};

export default function Hero() {
  const titleRef = useRef(null);
  const wrapRef = useRef(null);
  const photoRef = useRef(null);
  const photoWrap = useRef(null);

  // 3D parallax tilt on title + photo based on mouse position
  useEffect(() => {
    let rx = 0, ry = 0; let tx = 0, ty = 0; let raf;
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tx = (e.clientX - cx) / cx;  // -1..1
      ty = (e.clientY - cy) / cy;
    };
    const loop = () => {
      rx += (tx - rx) * 0.07;
      ry += (ty - ry) * 0.07;
      if (titleRef.current) {
        titleRef.current.style.transform = `perspective(1800px) rotateY(${rx * 3.2}deg) rotateX(${-ry * 2.4}deg) translateZ(0)`;
      }
      if (photoRef.current) {
        photoRef.current.style.transform = `perspective(1600px) rotateY(${-rx * 2}deg) rotateX(${ry * 1.5}deg) translate3d(${rx * -8}px, ${ry * -8}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-content-wrapper", {
        y: 100,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  // Scroll-linked parallax for layers
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yLabels = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={wrapRef}
      data-testid={LANDING.hero}
      className="relative w-full overflow-hidden bg-[var(--paper)] grain"
    >
      <WebGLBackground />
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      {/* subtle vignette */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ background: "radial-gradient(120% 80% at 50% 35%, transparent 50%, rgba(20,19,15,0.10) 100%)" }} />

      {/* First fold: Viewport-sized content wrapper */}
      <div className="hero-content-wrapper relative min-h-[100dvh] md:min-h-[100vh] flex flex-col justify-between z-10 pt-20 lg:pt-24 pb-8">
        {/* Top eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="relative"
        >
          <div className="mx-auto max-w-[1380px] px-6 lg:px-10 flex items-center justify-between">
            <span className="eyebrow">A design-first studio — est. 2021</span>
            <span className="eyebrow hidden md:inline">Lisbon · New York · Remote</span>
          </div>
        </motion.div>

        {/* Main grid */}
        <motion.div
          style={{ y: yMain }}
          className="relative mx-auto w-full max-w-[1380px] px-6 lg:px-10 my-auto pt-8 pb-12"
        >
          <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-10 items-end">
            {/* Headline */}
            <div className="md:col-span-8 lg:col-span-8">
              <motion.h1
                ref={titleRef}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
                className="headline"
                style={{ fontSize: "clamp(44px, 6.5vw, 110px)", willChange: "transform", transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)" }}
              >
                The <em>art</em> of
                <br/>
                building <em>brands</em>
                <br/>
                that <em>compound.</em>
              </motion.h1>
            </div>

            {/* Right column — small descriptor + meta */}
            <motion.div
              style={{ y: yLabels }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
              className="md:col-span-4 lg:col-span-4 md:pl-6 md:pb-6 lg:pl-6 lg:pb-6"
            >
              <p className="lede max-w-sm">
                We design brands, websites and operating systems for founders who refuse to look like everyone else.
              </p>
              <div className="mt-8 flex items-center gap-3 flex-wrap">
                <Link to="/contact" data-testid={LANDING.heroPrimaryCta} className="cursor-target btn btn-primary" data-cursor="hover">
                  Start a project <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link to="/work" data-testid={LANDING.heroSecondaryCta} className="cursor-target btn btn-ghost" data-cursor="hover">
                  See the work
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="flex flex-col items-center gap-2 cursor-target mt-auto"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--muted)]">SCROLL</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="w-3.5 h-3.5 text-[var(--muted)]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Second fold: photo + meta */}
      <div className="relative z-10 mx-auto max-w-[1380px] px-6 lg:px-10 pb-24 lg:pb-32 mt-12 md:mt-20">
        <div className="grid md:grid-cols-12 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            style={{ y: yPhoto }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
            className="md:col-span-7 lg:col-span-7"
          >
            <div ref={photoWrap} className="perspective-2000 cursor-target">
              <div
                 ref={photoRef}
                className="relative aspect-[4/3] rounded-[18px] overflow-hidden border border-[var(--line-2)] bg-[var(--paper-2)]"
                style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)", willChange: "transform" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=88&auto=format&fit=crop"
                  alt="Studio interior"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(20,19,15,0.45) 100%)" }} />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[var(--paper)]">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-80">Selected work 2025</p>
                    <p className="font-display text-2xl mt-1" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>Northwind · Brand & Web</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            className="md:col-span-5 lg:col-span-5 space-y-8"
          >
            <div>
              <p className="eyebrow">— What we make</p>
              <ul className="mt-3 space-y-1.5 font-sans text-[var(--ink)] text-[20px] leading-snug">
                <li className="flex items-baseline gap-3 cursor-target w-max"><span className="font-mono text-xs text-[var(--muted)]">01</span> Brand identity systems</li>
                <li className="flex items-baseline gap-3 cursor-target w-max"><span className="font-mono text-xs text-[var(--muted)]">02</span> Editorial websites</li>
                <li className="flex items-baseline gap-3 cursor-target w-max"><span className="font-mono text-xs text-[var(--muted)]">03</span> Mobile & product design</li>
                <li className="flex items-baseline gap-3 cursor-target w-max"><span className="font-mono text-xs text-[var(--muted)]">04</span> Motion & content</li>
                <li className="flex items-baseline gap-3 cursor-target w-max"><span className="font-mono text-xs text-[var(--muted)]">05</span> Internal operating systems</li>
              </ul>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] pt-5">
              <div>
                <p className="eyebrow">Selected clients</p>
                <p className="font-display text-xl mt-1" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>Northwind · Atlas · Halcyon · Maven</p>
              </div>
              <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest">+42 more</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

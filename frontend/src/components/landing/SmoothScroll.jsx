// Awwwards-style scroll feel: Lenis inertia scrolling wired into GSAP's
// ticker, anchor links routed through it, plus a thin ink progress line
// under the nav. Touch devices and reduced-motion users keep native scroll.
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsapSetup";

export default function SmoothScroll() {
  const bar = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // progress line (cheap, works with or without lenis)
    let progressTween;
    if (!reduce && bar.current) {
      progressTween = gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: () => document.documentElement.scrollHeight - window.innerHeight,
            scrub: 0.4,
          },
        }
      );
    }

    if (reduce) return () => { progressTween?.scrollTrigger?.kill(); progressTween?.kill(); };

    const lenis = new Lenis({
      duration: 1.1,
      wheelMultiplier: 1.15, // cover ground a touch faster; the page is long
      smoothWheel: true,
    });
    window.__lenis = lenis; // shared with ScrollToTop for route changes
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // route in-page anchors through lenis so they glide instead of jumping
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return; // bare "#" placeholders: ignore
      let target;
      try {
        target = document.querySelector(hash);
      } catch {
        return; // invalid selector, let the browser handle it
      }
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
      progressTween?.scrollTrigger?.kill();
      progressTween?.kill();
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
      style={{ background: "var(--ink)", transformOrigin: "left center", transform: "scaleX(0)" }}
    />
  );
}

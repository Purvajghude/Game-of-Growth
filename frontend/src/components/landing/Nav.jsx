import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LANDING } from "@/constants/testIds";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      data-testid={LANDING.nav}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-3" : "py-5"}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="mx-auto max-w-[1380px] px-6 lg:px-10">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-700 ${
            scrolled
              ? "glass-warm shadow-[0_2px_24px_-12px_rgba(0,0,0,0.18)]"
              : "bg-transparent"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        >
          <Link to="/" data-testid={LANDING.navLogo} className="flex items-center gap-2.5" data-cursor="hover">
            <div className="w-6 h-6 rounded-full bg-[var(--ink)] flex items-center justify-center">
              <span className="font-display italic text-[var(--paper)] text-[12px] leading-none mt-[1px]">g</span>
            </div>
            <span className="font-sans font-medium tracking-tight text-[14.5px] text-[var(--ink)]">Game of Growth</span>
            <span className="hidden md:inline-block ml-1 font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase">Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-sans text-[var(--ink-2)]">
            <a href="#work" className="hover:text-[var(--ink)] transition">Work</a>
            <a href="#services" className="hover:text-[var(--ink)] transition">Services</a>
            <a href="#process" className="hover:text-[var(--ink)] transition">Process</a>
            <a href="#store" className="hover:text-[var(--ink)] transition">Store</a>
            <a href="#contact" className="hover:text-[var(--ink)] transition">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              data-testid={LANDING.navDashboard}
              className="hidden sm:inline-flex items-center gap-1.5 text-[11.5px] font-mono text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line-2)] rounded-full px-3 py-1.5 transition"
              data-cursor="hover"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />
              Dashboard
            </Link>
            <a
              href="#contact"
              data-testid={LANDING.navBookCall}
              className="inline-flex items-center gap-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-full px-4 py-2 text-[13px] font-medium hover:bg-[var(--ink-2)] transition"
              data-cursor="hover"
            >
              Book a call <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

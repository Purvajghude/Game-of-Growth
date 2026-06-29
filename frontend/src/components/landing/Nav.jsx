import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LANDING } from "@/constants/testIds";
import { motion, AnimatePresence } from "framer-motion";
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
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            scrolled
              ? "bg-black/60 backdrop-blur-xl border border-white/10"
              : "bg-transparent"
          }`}
        >
          <Link to="/" data-testid={LANDING.navLogo} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffb800] to-[#ff5e00] flex items-center justify-center">
              <span className="font-display italic text-black text-sm leading-none mt-0.5">g</span>
            </div>
            <span className="font-sans font-medium tracking-tight text-[15px]">Game of Growth</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-sans text-white/70">
            <a href="#work" className="hover:text-white transition">Work</a>
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#process" className="hover:text-white transition">Process</a>
            <a href="#store" className="hover:text-white transition">Store</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              data-testid={LANDING.navDashboard}
              className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-mono text-white/60 hover:text-white border border-white/10 rounded-full px-3 py-1.5 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Dashboard
            </Link>
            <a
              href="#contact"
              data-testid={LANDING.navBookCall}
              className="inline-flex items-center gap-1.5 bg-white text-black rounded-full px-4 py-2 text-[13px] font-medium hover:bg-[#ffb800] transition"
            >
              Book a call <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

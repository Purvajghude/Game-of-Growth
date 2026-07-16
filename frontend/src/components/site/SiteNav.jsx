import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LANDING } from "@/constants/testIds";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const LINKS = [
  { to: "/work", label: "Work" },
  { to: "/studio", label: "Studio" },
  { to: "/store", label: "Store" },
  { to: "/audit", label: "Free audit" },
  { to: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
            scrolled || open
              ? "glass-warm shadow-[0_2px_24px_-12px_rgba(0,0,0,0.18)]"
              : "bg-transparent"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        >
          <Link to="/" data-testid={LANDING.navLogo} className="cursor-target flex items-center gap-2.5" data-cursor="hover">
            <div className="w-6 h-6 rounded-full bg-[var(--ink)] flex items-center justify-center">
              <span className="font-display italic text-[var(--paper)] text-[12px] leading-none mt-[1px]">g</span>
            </div>
            <span className="font-sans font-medium tracking-tight text-[14.5px] text-[var(--ink)]">Game of Growth</span>
            <span className="hidden md:inline-block ml-1 font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase">Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-sans text-[var(--ink-2)]">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `cursor-target transition relative ${isActive ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}`
                }
                data-cursor="hover"
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-px bg-[var(--ink)]"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              data-testid={LANDING.navDashboard}
              className="cursor-target hidden sm:inline-flex items-center gap-1.5 text-[11.5px] font-mono text-[var(--muted)] hover:text-[var(--ink)] border border-[var(--line-2)] rounded-full px-3 py-1.5 transition"
              data-cursor="hover"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />
              Dashboard
            </Link>
            <Link
              to="/contact"
              data-testid={LANDING.navBookCall}
              className="cursor-target hidden md:inline-flex items-center gap-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-full px-4 py-2 text-[13px] font-medium hover:bg-[var(--ink-2)] transition"
              data-cursor="hover"
            >
              Book a call <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--ink)]"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden mt-2 glass-warm rounded-3xl p-4"
            >
              <div className="flex flex-col">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="py-3 px-2 text-[var(--ink)] font-sans text-lg border-b border-[var(--line)] last:border-0"
                  >
                    {l.label}
                  </NavLink>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 bg-[var(--ink)] text-[var(--paper)] rounded-full px-4 py-3 text-[14px] font-medium"
                >
                  Book a call <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 text-[12px] font-mono text-[var(--muted)] py-2"
                >
                  Founder Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

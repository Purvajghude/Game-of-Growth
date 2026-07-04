import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import Services from "@/components/landing/Services";
import Process from "@/components/landing/Process";

// The hook. Still one scrollable page, but leaner: pitch, services, process,
// and a push toward the deeper pages. Team, work and store now live elsewhere.
export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <Process />

      {/* Closing CTA band → routes to the contact page */}
      <section className="relative bg-[var(--ink)] text-[var(--paper)] py-24 lg:py-36 grain-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" />
        <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="headline mx-auto"
            style={{ fontSize: "clamp(44px, 7vw, 120px)", color: "var(--paper)" }}
          >
            Let's build something <em>worth copying.</em>
          </motion.h2>
          <p className="mt-6 text-[var(--paper)]/70 text-lg max-w-xl mx-auto">
            Tell us where you want to grow. We'll bring the plan, the camera and the code.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link to="/contact" className="cursor-target btn btn-on-dark-primary" data-cursor="hover">
              Start a project <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link to="/work" className="cursor-target btn btn-on-dark-ghost" data-cursor="hover">
              See the work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

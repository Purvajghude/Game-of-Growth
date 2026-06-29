import { useState } from "react";
import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import { ArrowUpRight, Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function FinalCta() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill name, email and message");
      return;
    }
    setLoading(true);
    try {
      await api.createContact(form);
      setDone(true);
      toast.success("Message received — we'll be in touch within 24h.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid={LANDING.finalCta} className="relative bg-[#0a0a0b] py-32 overflow-hidden">
      {/* big animated gradient */}
      <motion.div
        className="absolute inset-0 opacity-40 pointer-events-none"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          background: "radial-gradient(circle at 20% 20%, #ffb800 0%, transparent 40%), radial-gradient(circle at 80% 60%, #7c3aed 0%, transparent 40%), radial-gradient(circle at 50% 100%, #06b6d4 0%, transparent 50%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="headline-massive text-white text-center text-[14vw] md:text-[12vw] leading-[0.92]"
        >
          Ready to build<br/>something <em>extraordinary?</em>
        </motion.h2>

        <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
          <a href="#contact-form" data-testid={LANDING.finalCtaPrimary} className="btn-pill btn-pill-primary">
            Book a Strategy Call <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="#work" data-testid={LANDING.finalCtaSecondary} className="btn-pill btn-pill-ghost">
            Explore Our Work
          </a>
        </div>

        {/* contact form */}
        <div id="contact-form" className="mt-24 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="section-label">Let's talk</p>
            <h3 className="font-display italic text-5xl md:text-6xl text-white mt-3">Tell us about your <em>ambition.</em></h3>
            <p className="mt-6 text-white/60 max-w-md">Fill the form and we'll respond within 24 hours with next steps or a quick scope call.</p>
            <div className="mt-10 space-y-4 text-white/70 font-sans">
              <p>→ hello@gameofgrowth.studio</p>
              <p>→ Lisbon · New York · Remote-first</p>
              <p className="font-mono text-[11px] text-white/40 tracking-widest mt-6">CURRENTLY ACCEPTING 4 PROJECTS FOR Q2 2025</p>
            </div>
          </div>
          <form data-testid={LANDING.contactForm} onSubmit={submit} className="grid gap-4 bg-white/[0.03] border border-white/10 backdrop-blur rounded-3xl p-6 md:p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <input data-testid={LANDING.contactName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffb800]" />
              <input data-testid={LANDING.contactEmail} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffb800]" />
            </div>
            <input data-testid={LANDING.contactCompany} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffb800]" />
            <textarea data-testid={LANDING.contactMessage} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="What are you trying to build?" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffb800] resize-none" />
            <button data-testid={LANDING.contactSubmit} type="submit" disabled={loading || done} className="btn-pill btn-pill-primary justify-center disabled:opacity-70">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : done ? <><Check className="w-4 h-4" /> Sent</> : <>Send message <ArrowUpRight className="w-4 h-4" /></>}
            </button>
            <p className="font-mono text-[10px] text-white/40 tracking-widest">YOUR INFO STAYS WITH US — NO LIST, NO SPAM</p>
          </form>
        </div>
      </div>
    </section>
  );
}

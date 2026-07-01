// Final CTA + contact form — light editorial, single quiet motion layer
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
    if (!form.name || !form.email || !form.message) { toast.error("Please fill name, email and message"); return; }
    setLoading(true);
    try {
      await api.createContact(form);
      setDone(true); toast.success("Message received — we'll be in touch within 24h.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch (err) { console.error(err); toast.error("Something went wrong. Try again?"); }
    finally { setLoading(false); }
  };

  return (
    <section id="contact" data-testid={LANDING.finalCta} className="relative bg-[var(--paper)] py-28 lg:py-44 overflow-hidden grain-soft">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      {/* very subtle, slow ambient layer */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(60% 50% at 50% 20%, rgba(20,19,15,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1380px] px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="headline text-center"
          style={{ fontSize: "clamp(64px, 11vw, 200px)" }}
        >
          Ready to build<br/>something <em>extraordinary?</em>
        </motion.h2>

        <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
          <a href="#contact-form" data-testid={LANDING.finalCtaPrimary} className="btn btn-primary" data-cursor="hover">
            Book a strategy call <ArrowUpRight className="w-4 h-4" />
          </a>
          <a href="#work" data-testid={LANDING.finalCtaSecondary} className="btn btn-ghost" data-cursor="hover">
            Explore our work
          </a>
        </div>

        <div id="contact-form" className="mt-24 grid md:grid-cols-2 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow">Let's talk</p>
            <h3 className="headline mt-3" style={{ fontSize: "clamp(40px, 5vw, 80px)" }}>Tell us about your <em>ambition.</em></h3>
            <p className="lede mt-6 max-w-md">Fill the form and we'll respond within 24 hours with next steps or a quick scope call.</p>
            <div className="mt-10 space-y-3 text-[var(--ink-2)] font-sans">
              <p className="text-[15px]">→ hello@gameofgrowth.studio</p>
              <p className="text-[15px]">→ Lisbon · New York · Remote-first</p>
              <p className="font-mono text-[10.5px] text-[var(--muted)] tracking-widest mt-8 uppercase">Currently accepting 4 projects for Q2 2025</p>
            </div>
          </div>
          <form data-testid={LANDING.contactForm} onSubmit={submit} className="grid gap-4 bg-white border border-[var(--line-2)] rounded-[18px] p-7 md:p-9">
            <div className="grid sm:grid-cols-2 gap-4">
              <input data-testid={LANDING.contactName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="bg-[var(--paper)] border border-[var(--line-2)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition" />
              <input data-testid={LANDING.contactEmail} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-[var(--paper)] border border-[var(--line-2)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition" />
            </div>
            <input data-testid={LANDING.contactCompany} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="bg-[var(--paper)] border border-[var(--line-2)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] transition" />
            <textarea data-testid={LANDING.contactMessage} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="What are you trying to build?" className="bg-[var(--paper)] border border-[var(--line-2)] rounded-xl px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--ink)] resize-none transition" />
            <button data-testid={LANDING.contactSubmit} type="submit" disabled={loading || done} className="btn btn-primary justify-center disabled:opacity-70" data-cursor="hover">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : done ? <><Check className="w-4 h-4" /> Sent</> : <>Send message <ArrowUpRight className="w-4 h-4" /></>}
            </button>
            <p className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase">Your info stays with us — no list, no spam</p>
          </form>
        </div>
      </div>
    </section>
  );
}

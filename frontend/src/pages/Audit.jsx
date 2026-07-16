import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Loader2, ArrowUpRight, Check, Globe, Instagram, Lock } from "lucide-react";

const DIMS = ["branding", "modernity", "ux", "copywriting", "trust", "seo", "conversion", "premium"];

// Public lead magnet: a visitor audits their OWN brand, sees a real score,
// then unlocks the full report + free mockups by leaving an email — which
// lands them in the CRM + AI Auditor as a warm inbound lead.
export default function Audit() {
  const [site, setSite] = useState({ website: "", instagram: "" });
  const [phase, setPhase] = useState("input"); // input | running | result | claimed
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [lead, setLead] = useState({ name: "", email: "", company: "", goal: "" });
  const [claiming, setClaiming] = useState(false);

  const run = async (e) => {
    e.preventDefault();
    if (!site.website.trim()) { setError("Enter your website to audit it."); return; }
    setError(""); setPhase("running");
    try {
      const r = await api.instantAudit(site);
      if (!r.reachable) {
        setError(r.notes || "We couldn't reach that site. Check the URL and try again.");
        setPhase("input");
        return;
      }
      setResult(r);
      setPhase("result");
    } catch {
      setError("Something went wrong running the audit. Try again in a moment.");
      setPhase("input");
    }
  };

  const claim = async (e) => {
    e.preventDefault();
    if (!lead.email.trim() || !lead.name.trim()) return;
    setClaiming(true);
    try {
      await api.claimAudit({ ...lead, website: site.website, instagram: result?.instagram || site.instagram });
      setPhase("claimed");
    } catch {
      setError("Could not send your report request. Try again.");
    } finally {
      setClaiming(false);
    }
  };

  const score = result?.website_score ?? 0;
  const scoreColor = score >= 70 ? "#3f6b3f" : score >= 45 ? "#b3552e" : "#a03d2a";

  return (
    <section className="relative min-h-[100dvh] bg-[var(--paper)] grain-soft overflow-hidden pt-32 lg:pt-40 pb-24">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <p className="eyebrow">Free · 30 seconds · no signup to see your score</p>
        <h1 className="headline mt-4" style={{ fontSize: "clamp(44px, 8vw, 120px)" }}>
          How good is your brand, <em>really?</em>
        </h1>
        <p className="lede mt-6 max-w-2xl">
          Drop your website in. We'll run the same audit our studio runs on every prospect and show
          you a live score across eight dimensions. No fluff.
        </p>

        {/* input */}
        {(phase === "input" || phase === "running") && (
          <form onSubmit={run} className="mt-10 max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white border border-[var(--line-2)] rounded-xl px-4 py-3.5">
                <Globe className="w-4 h-4 text-[var(--muted)] shrink-0" />
                <input
                  className="bg-transparent outline-none text-[15px] text-[var(--ink)] placeholder:text-[var(--muted)] w-full"
                  placeholder="yourbrand.com"
                  value={site.website}
                  onChange={(e) => setSite({ ...site, website: e.target.value })}
                  autoFocus
                />
              </div>
              <button type="submit" disabled={phase === "running"} className="btn btn-primary justify-center disabled:opacity-60">
                {phase === "running" ? <><Loader2 className="w-4 h-4 animate-spin" /> Auditing your site…</> : <>Run free audit <ArrowUpRight className="w-4 h-4" /></>}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 bg-white border border-[var(--line)] rounded-xl px-4 py-3 max-w-md">
              <Instagram className="w-4 h-4 text-[var(--muted)] shrink-0" />
              <input
                className="bg-transparent outline-none text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] w-full"
                placeholder="Instagram handle (optional)"
                value={site.instagram}
                onChange={(e) => setSite({ ...site, instagram: e.target.value })}
              />
            </div>
            {error && <p className="mt-3 text-[14px] text-[#a03d2a]">{error}</p>}
          </form>
        )}

        {/* result */}
        <AnimatePresence>
          {(phase === "result" || phase === "claimed") && result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 grid lg:grid-cols-2 gap-10 items-start"
            >
              {/* score + dimensions */}
              <div>
                <div className="flex items-end gap-4">
                  <motion.p
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="font-display leading-none"
                    style={{ fontSize: "clamp(80px, 16vw, 180px)", color: scoreColor, fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
                  >
                    {score}
                  </motion.p>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)] mb-6">/ 100<br />website score</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                  {DIMS.map((d, i) => {
                    const v = result.website_scores?.[d] ?? 0;
                    return (
                      <motion.div
                        key={d}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                      >
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="capitalize text-[var(--ink-2)]">{d}</span>
                          <span className="font-mono text-[var(--muted)]">{v}/10</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--paper-3)] mt-1 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${v * 10}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ background: "var(--ink)" }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {result.notes && <p className="mt-6 text-[14px] text-[var(--muted)] leading-relaxed">{result.notes}</p>}
              </div>

              {/* claim gate */}
              <div className="bg-white border border-[var(--line-2)] rounded-[18px] p-7 lg:p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                {phase === "claimed" ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-[#3f6b3f]/12 flex items-center justify-center mx-auto"><Check className="w-7 h-7 text-[#3f6b3f]" /></div>
                    <h3 className="font-display text-3xl mt-5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>We're on it.</h3>
                    <p className="text-[var(--muted)] mt-3 max-w-sm mx-auto">
                      Your full report and a few free mockups are being put together. Expect them from a real
                      person within one working day.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-[var(--accent)]"><Lock className="w-4 h-4" /><p className="font-mono text-[10px] uppercase tracking-widest">Unlock the full report</p></div>
                    <h3 className="font-display text-3xl mt-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                      Get the breakdown <em>+ free mockups.</em>
                    </h3>
                    <p className="text-[14px] text-[var(--muted)] mt-2">
                      We'll send the detailed findings and actually redesign part of your homepage or feed. No charge, no catch.
                    </p>
                    <form onSubmit={claim} className="mt-5 space-y-3">
                      <input className="dash-input w-full" placeholder="Your name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} required />
                      <input className="dash-input w-full" type="email" placeholder="Email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} required />
                      <input className="dash-input w-full" placeholder="Brand / company (optional)" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} />
                      <input className="dash-input w-full" placeholder="What are you hoping to grow? (optional)" value={lead.goal} onChange={(e) => setLead({ ...lead, goal: e.target.value })} />
                      <button type="submit" disabled={claiming} className="btn btn-primary w-full justify-center disabled:opacity-60">
                        {claiming ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Send me the full report <ArrowUpRight className="w-4 h-4" /></>}
                      </button>
                      {error && <p className="text-[13px] text-[#a03d2a]">{error}</p>}
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus, X, Trash2, Upload, Radar, Sparkles, Globe, Instagram, Download,
  Loader2, Check, RefreshCw, ChevronRight, TrendingUp, Search, MapPin, Mail, Phone,
} from "lucide-react";

const TIER = {
  amazing: { label: "Amazing prospect", cls: "bg-[#3f6b3f]/12 text-[#3f6b3f]" },
  worth: { label: "Worth contacting", cls: "bg-[#b3552e]/12 text-[#b3552e]" },
  low: { label: "Low priority", cls: "bg-[var(--paper-3)] text-[var(--muted)]" },
  skip: { label: "Skip", cls: "bg-[var(--paper-2)] text-[var(--muted)]" },
};
const REVIEW = {
  pending: { label: "Pending", cls: "bg-[var(--paper-2)] text-[var(--muted)] border border-[var(--line)]" },
  approved: { label: "Ready", cls: "bg-[#3f6b3f]/12 text-[#3f6b3f]" },
  skip: { label: "Skipped", cls: "bg-[var(--paper-2)] text-[var(--muted)]" },
  contacted: { label: "Contacted", cls: "bg-[#b3552e]/12 text-[#b3552e]" },
};
const WS_DIMS = ["branding", "modernity", "ux", "copywriting", "trust", "seo", "conversion", "premium"];
const DELIVERABLES = [
  ["homepage_redesign", "Homepage redesign"],
  ["instagram_redesign", "Instagram redesign"],
  ["reel_ideas", "10 Reel ideas"],
  ["brand_pdf", "Brand strategy PDF"],
  ["audit_pdf", "Website audit PDF"],
];

// tolerant CSV parser (quoted fields, commas, CRLF)
function parseCSV(text) {
  const rows = [];
  let field = "", row = [], inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      if (field.length || row.length) { row.push(field); rows.push(row); row = []; field = ""; }
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const pick = (headers, names) => {
  for (const n of names) {
    const i = headers.findIndex((h) => h === n || h.includes(n));
    if (i !== -1) return i;
  }
  return -1;
};

export default function Prospector() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [auditing, setAuditing] = useState({});
  const [form, setForm] = useState({ company: "", website: "", industry: "", founder: "", linkedin: "", instagram: "" });
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listProspects()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const selected = items.find((p) => p.id === selectedId);
  const patchLocal = (u) => setItems((prev) => prev.map((p) => (p.id === u.id ? u : p)));

  // ---- CSV import (Apollo export) ----
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text).filter((r) => r.some((c) => c.trim()));
    if (rows.length < 2) { toast.error("That CSV looks empty."); return; }
    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const ci = pick(headers, ["company", "organization", "account"]);
    const wi = pick(headers, ["website", "url", "domain"]);
    const ii = pick(headers, ["industry"]);
    const fi = pick(headers, ["founder", "first name", "owner", "name", "contact"]);
    const li = pick(headers, ["linkedin"]);
    const gi = pick(headers, ["instagram"]);
    const ei = pick(headers, ["email"]);
    const pi = pick(headers, ["phone", "mobile"]);
    if (ci === -1) { toast.error("No 'Company' column found in that CSV."); return; }
    const cell = (r, idx) => (idx !== -1 ? (r[idx] || "").trim() : "");
    const prospects = rows.slice(1).map((r) => ({
      company: cell(r, ci),
      website: cell(r, wi),
      industry: cell(r, ii),
      founder: cell(r, fi),
      linkedin: cell(r, li),
      instagram: cell(r, gi),
      email: cell(r, ei),
      phone: cell(r, pi),
      source: "Apollo",
    })).filter((p) => p.company);
    if (!prospects.length) { toast.error("No rows with a company name."); return; }
    try {
      const res = await api.bulkProspects(prospects);
      toast.success(`Imported ${res.created} prospects`);
      load();
    } catch { toast.error("Import failed"); }
  };

  const addManual = async (e) => {
    e.preventDefault();
    if (!form.company.trim()) { toast.error("Company is required"); return; }
    try {
      const created = await api.createProspect({ ...form, source: "Manual" });
      setItems((p) => [created, ...p]);
      setAddOpen(false);
      setForm({ company: "", website: "", industry: "", founder: "", linkedin: "", instagram: "" });
      setSelectedId(created.id);
    } catch { toast.error("Could not add prospect"); }
  };

  const runAudit = async (id) => {
    setAuditing((a) => ({ ...a, [id]: true }));
    try {
      const updated = await api.auditProspect(id);
      patchLocal(updated);
      const note = updated.website_scores && Object.keys(updated.website_scores).length
        ? `Audited ${updated.company} · opportunity ${updated.opportunity_score}/100`
        : `${updated.company}: site unreachable — add metrics manually`;
      toast.success(note);
    } catch { toast.error("Audit failed"); }
    finally { setAuditing((a) => ({ ...a, [id]: false })); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this prospect?")) return;
    try { await api.deleteProspect(id); setItems((p) => p.filter((x) => x.id !== id)); if (selectedId === id) setSelectedId(null); }
    catch { toast.error("Delete failed"); }
  };

  const exportCSV = () => {
    const head = ["Company", "Website", "Instagram", "Website Score", "Social Score", "Opportunity", "Tier", "Status", "Review"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.join(",")].concat(
      items.map((p) => [p.company, p.website, p.instagram, p.website_score ?? "", p.social_score ?? "", p.opportunity_score ?? "", p.opportunity_tier ?? "", p.status, p.review].map(esc).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gog-prospects.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filtered = useMemo(
    () => (tierFilter === "all" ? items : items.filter((p) => p.opportunity_tier === tierFilter)),
    [items, tierFilter]
  );
  const hot = items.filter((p) => ["amazing", "worth"].includes(p.opportunity_tier)).length;
  const ready = items.filter((p) => p.review === "approved").length;

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-[var(--accent)]" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">AI Business Auditor</p>
          </div>
          <p className="text-[var(--ink-2)] text-sm mt-1 max-w-xl">
            Import Apollo leads, run a live website audit, score the opportunity, and generate outreach. A human approves before anything is sent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" data-testid="prospector-csv-input" />
          <button onClick={() => setDiscoverOpen(true)} className="dash-btn-ghost inline-flex items-center gap-1.5" data-testid="prospector-discover-btn">
            <Search className="w-4 h-4" /> Find free
          </button>
          <button onClick={() => fileRef.current?.click()} className="dash-btn-ghost inline-flex items-center gap-1.5" data-testid="prospector-import-btn">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={() => setAddOpen(true)} className="dash-btn inline-flex items-center gap-1.5" data-testid="prospector-add-btn">
            <Plus className="w-4 h-4" /> Add prospect
          </button>
        </div>
      </div>

      {/* stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Prospects", value: items.length, icon: Radar },
          { label: "Hot (worth+)", value: hot, icon: TrendingUp },
          { label: "Ready to send", value: ready, icon: Check },
          { label: "Avg opportunity", value: items.length ? Math.round(items.reduce((s, p) => s + (p.opportunity_score || 0), 0) / items.length) : 0, icon: Sparkles },
        ].map((s) => (
          <div key={s.label} className="dash-card p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{s.label}</p>
              <s.icon className="w-3.5 h-3.5 text-[var(--muted)]" />
            </div>
            <p className="font-display text-3xl mt-1 text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "amazing", "worth", "low", "skip"].map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium capitalize transition ${
              tierFilter === t ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper-2)] text-[var(--ink-2)] hover:bg-[var(--paper-3)]"
            }`}
          >
            {t === "all" ? "All" : TIER[t].label}
          </button>
        ))}
        <div className="flex-1" />
        {items.length > 0 && (
          <button onClick={exportCSV} className="dash-btn-ghost inline-flex items-center gap-1.5 text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <Radar className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">No prospects yet.</p>
          <p className="text-[var(--muted)] mt-2 max-w-md mx-auto">Drop in an Apollo CSV (Company, Website, Industry, Founder, LinkedIn) and start auditing.</p>
          <button onClick={() => fileRef.current?.click()} className="dash-btn mt-6 inline-flex items-center gap-1.5"><Upload className="w-4 h-4" /> Import Apollo CSV</button>
        </div>
      ) : (
        <div className="dash-card overflow-x-auto">
          <table className="tbl min-w-[860px]" data-testid="prospector-table">
            <thead>
              <tr>
                <th>Company</th><th>Website</th><th>Social</th><th>Opportunity</th><th>Status</th><th>Review</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const tier = TIER[p.opportunity_tier] || TIER.skip;
                const rev = REVIEW[p.review] || REVIEW.pending;
                return (
                  <tr key={p.id} className="group cursor-pointer" onClick={() => setSelectedId(p.id)}>
                    <td>
                      <div className="font-medium text-[var(--ink)]">{p.company}</div>
                      {p.industry && <div className="text-xs text-[var(--muted)]">{p.industry}</div>}
                    </td>
                    <td><ScoreCell value={p.website_score} /></td>
                    <td><ScoreCell value={p.social_score} /></td>
                    <td>
                      {p.opportunity_score == null ? (
                        <span className="text-[var(--muted)] text-xs">not audited</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[15px] text-[var(--ink)]">{p.opportunity_score}</span>
                          <span className={`badge ${tier.cls}`}>{tier.label}</span>
                        </div>
                      )}
                    </td>
                    <td><span className="text-[13px] capitalize text-[var(--ink-2)]">{p.status}</span></td>
                    <td><span className={`badge ${rev.cls}`}>{rev.label}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => runAudit(p.id)}
                          disabled={auditing[p.id]}
                          title="Run website audit"
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
                        >
                          {auditing[p.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radar className="w-3.5 h-3.5" />}
                          Audit
                        </button>
                        <button onClick={() => del(p.id)} className="opacity-0 group-hover:opacity-100 transition text-[var(--muted)] hover:text-[#a03d2a]"><Trash2 className="w-4 h-4" /></button>
                        <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* provider note */}
      <p className="font-mono text-[10px] text-[var(--muted)] leading-relaxed">
        Live now: website heuristic audit · deterministic scoring · pitch drafts · human review.
        Connect later (needs keys): GPT/Claude deep audit + Vision screenshots · automated Instagram metrics · email send.
      </p>

      {/* add slide-over */}
      {addOpen && (
        <SlideOver title="New prospect" onClose={() => setAddOpen(false)}>
          <form onSubmit={addManual} className="space-y-3">
            {[["company", "Company *"], ["website", "Website"], ["industry", "Industry"], ["founder", "Founder / contact"], ["instagram", "Instagram handle"], ["linkedin", "LinkedIn"]].map(([k, label]) => (
              <div key={k} className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">{label}</label>
                <input className="dash-input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} data-testid={k === "company" ? "prospector-form-company" : undefined} />
              </div>
            ))}
            <div className="pt-3 flex gap-2">
              <button type="submit" className="dash-btn flex-1" data-testid="prospector-form-submit">Add prospect</button>
              <button type="button" onClick={() => setAddOpen(false)} className="dash-btn-ghost">Cancel</button>
            </div>
          </form>
        </SlideOver>
      )}

      {/* detail slide-over */}
      {selected && (
        <ProspectDetail
          key={selected.id}
          prospect={selected}
          auditing={!!auditing[selected.id]}
          onClose={() => setSelectedId(null)}
          onAudit={() => runAudit(selected.id)}
          onPatch={patchLocal}
        />
      )}

      {/* free discovery slide-over */}
      {discoverOpen && (
        <DiscoverPanel onClose={() => setDiscoverOpen(false)} onAdded={load} />
      )}
    </div>
  );
}

function DiscoverPanel({ onClose, onAdded }) {
  const [q, setQ] = useState({ category: "", city: "" });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState(() => new Set());
  const [adding, setAdding] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!q.category.trim() || !q.city.trim()) { setError("Enter a category and a city."); return; }
    setError(""); setLoading(true); setResults(null); setPicked(new Set());
    try {
      const r = await api.discoverOsm({ category: q.category, city: q.city, limit: 60 });
      setResults(r.results);
      setPicked(new Set(r.results.map((_, i) => i))); // default: all selected
    } catch (err) {
      setError(err?.response?.data?.detail || "Search failed. Try again shortly.");
    } finally { setLoading(false); }
  };

  const toggle = (i) => setPicked((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const allOn = results && picked.size === results.length;
  const toggleAll = () => setPicked(allOn ? new Set() : new Set(results.map((_, i) => i)));

  const add = async () => {
    if (!results || picked.size === 0) return;
    setAdding(true);
    try {
      const chosen = results.filter((_, i) => picked.has(i)).map((r) => ({ ...r, source: "OSM Discovery" }));
      const res = await api.bulkProspects(chosen);
      toast.success(`Added ${res.created} prospects to the board`);
      onAdded();
      onClose();
    } catch { toast.error("Could not add prospects"); }
    finally { setAdding(false); }
  };

  return (
    <SlideOver title="Find prospects" onClose={onClose} wide>
      <p className="text-[13.5px] text-[var(--muted)] -mt-3 mb-5 leading-relaxed">
        Free public business listings from OpenStreetMap. No API key, no cold-scraping. Pick a category and a city.
      </p>
      <form onSubmit={search} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 dash-input !py-0 !px-3">
            <Radar className="w-4 h-4 text-[var(--muted)] shrink-0" />
            <input className="bg-transparent outline-none text-sm py-2.5 w-full" placeholder="Category e.g. chocolate, perfume, cafe" value={q.category} onChange={(e) => setQ({ ...q, category: e.target.value })} data-testid="discover-category" />
          </div>
          <div className="flex items-center gap-2 dash-input !py-0 !px-3">
            <MapPin className="w-4 h-4 text-[var(--muted)] shrink-0" />
            <input className="bg-transparent outline-none text-sm py-2.5 w-full" placeholder="City e.g. Mumbai" value={q.city} onChange={(e) => setQ({ ...q, city: e.target.value })} data-testid="discover-city" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="dash-btn inline-flex items-center gap-1.5 disabled:opacity-60" data-testid="discover-search">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching listings…</> : <><Search className="w-4 h-4" /> Search public listings</>}
        </button>
        {error && <p className="text-[13px] text-[#a03d2a]">{error}</p>}
      </form>

      {results && (
        <div className="mt-6">
          {results.length === 0 ? (
            <p className="text-[var(--muted)] text-sm">No listings found for that category + city. Try a broader category.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <button onClick={toggleAll} className="text-[12.5px] font-medium text-[var(--accent)] hover:underline">{allOn ? "Deselect all" : "Select all"}</button>
                <p className="font-mono text-[11px] text-[var(--muted)]">{picked.size} of {results.length} selected</p>
              </div>
              <div className="border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] max-h-[46vh] overflow-y-auto">
                {results.map((r, i) => (
                  <label key={i} className="flex items-start gap-3 p-3 cursor-pointer hover:bg-[var(--paper-2)]">
                    <input type="checkbox" checked={picked.has(i)} onChange={() => toggle(i)} className="accent-[var(--ink)] mt-1" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--ink)] text-sm truncate">{r.company}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-[11.5px] text-[var(--muted)]">
                        {r.website && <span className="inline-flex items-center gap-1 truncate max-w-[180px]"><Globe className="w-3 h-3" /> {r.website.replace(/^https?:\/\//, "")}</span>}
                        {r.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {r.email}</span>}
                        {r.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {r.phone}</span>}
                        {r.area && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.area}</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={add} disabled={adding || picked.size === 0} className="dash-btn mt-4 w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-60">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add {picked.size} to board
              </button>
            </>
          )}
        </div>
      )}
    </SlideOver>
  );
}

function ScoreCell({ value }) {
  if (value == null) return <span className="text-[var(--muted)] text-xs">—</span>;
  const color = value >= 70 ? "#3f6b3f" : value >= 45 ? "#b3552e" : "#a03d2a";
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[13px] text-[var(--ink)] w-7">{value}</span>
      <div className="w-16 h-1.5 rounded-full bg-[var(--paper-3)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function SlideOver({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute right-0 top-0 bottom-0 w-full ${wide ? "max-w-xl" : "max-w-md"} bg-white border-l border-[var(--line)] p-6 overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-3xl text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const SOCIAL_FIELDS = [
  ["followers", "Followers", "number"],
  ["following", "Following", "number"],
  ["posts", "Posts", "number"],
  ["last_post_days", "Days since last post", "number"],
  ["avg_likes", "Avg likes", "number"],
  ["avg_comments", "Avg comments", "number"],
];

function ProspectDetail({ prospect, auditing, onClose, onAudit, onPatch }) {
  const [social, setSocial] = useState(() => ({
    followers: prospect.followers ?? "", following: prospect.following ?? "", posts: prospect.posts ?? "",
    last_post_days: prospect.last_post_days ?? "", avg_likes: prospect.avg_likes ?? "", avg_comments: prospect.avg_comments ?? "",
    has_reels: prospect.has_reels ?? false, brand_consistent: prospect.brand_consistent ?? false,
  }));
  const [pitch, setPitch] = useState(prospect.pitch || "");
  const [savingSocial, setSavingSocial] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const tier = TIER[prospect.opportunity_tier] || TIER.skip;

  const saveSocial = async () => {
    setSavingSocial(true);
    try {
      const payload = {};
      for (const [k] of SOCIAL_FIELDS) payload[k] = social[k] === "" ? null : Number(social[k]);
      payload.has_reels = social.has_reels;
      payload.brand_consistent = social.brand_consistent;
      const u = await api.updateProspect(prospect.id, payload);
      onPatch(u);
      toast.success(`Recomputed · opportunity ${u.opportunity_score ?? "—"}/100`);
    } catch { toast.error("Could not save"); }
    finally { setSavingSocial(false); }
  };

  const setReview = async (review) => {
    try { onPatch(await api.updateProspect(prospect.id, { review })); toast.success(review === "approved" ? "Marked ready to send" : `Marked ${review}`); }
    catch { toast.error("Update failed"); }
  };
  const toggleDeliverable = async (k) => {
    const next = { ...(prospect.deliverables || {}), [k]: !prospect.deliverables?.[k] };
    try { onPatch(await api.updateProspect(prospect.id, { deliverables: next })); }
    catch { toast.error("Update failed"); }
  };
  const savePitch = async () => {
    try { onPatch(await api.updateProspect(prospect.id, { pitch })); toast.success("Pitch saved"); }
    catch { toast.error("Save failed"); }
  };
  const regen = async () => {
    setRegenerating(true);
    try { const u = await api.regeneratePitch(prospect.id); setPitch(u.pitch || ""); onPatch(u); }
    catch { toast.error("Could not regenerate"); }
    finally { setRegenerating(false); }
  };

  return (
    <SlideOver title={prospect.company} onClose={onClose} wide>
      <div className="space-y-7">
        {/* meta + audit */}
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {prospect.website && <a href={prospect.website.startsWith("http") ? prospect.website : `https://${prospect.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-[var(--accent)] hover:underline"><Globe className="w-3.5 h-3.5" /> {prospect.website}</a>}
            {prospect.instagram && <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-2)]"><Instagram className="w-3.5 h-3.5" /> {prospect.instagram}</span>}
            {prospect.email && <a href={`mailto:${prospect.email}`} className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-2)] hover:text-[var(--ink)]"><Mail className="w-3.5 h-3.5" /> {prospect.email}</a>}
            {prospect.phone && <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--ink-2)]"><Phone className="w-3.5 h-3.5" /> {prospect.phone}</span>}
          </div>
          <button onClick={onAudit} disabled={auditing} className="dash-btn mt-4 inline-flex items-center gap-1.5 disabled:opacity-60">
            {auditing ? <><Loader2 className="w-4 h-4 animate-spin" /> Auditing…</> : <><Radar className="w-4 h-4" /> Run website audit</>}
          </button>
          {prospect.website_notes && <p className="mt-3 text-[13px] text-[var(--muted)] leading-relaxed">{prospect.website_notes}</p>}
        </div>

        {/* opportunity */}
        {prospect.opportunity_score != null && (
          <div className="dash-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Opportunity</p>
              <span className={`badge ${tier.cls}`}>{tier.label}</span>
            </div>
            <p className="font-display text-6xl mt-1 text-[var(--ink)]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{prospect.opportunity_score}<span className="text-2xl text-[var(--muted)]">/100</span></p>
            {prospect.signals?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {prospect.signals.map((s, i) => (
                  <li key={i} className="text-[13px] text-[var(--ink-2)] flex items-start gap-2"><span className="text-[var(--accent)] mt-0.5">+</span>{s.replace(/\s*\(\+\d+\)$/, "")}<span className="ml-auto font-mono text-[11px] text-[var(--muted)]">{s.match(/\(\+(\d+)\)/)?.[0] || ""}</span></li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* website sub-scores */}
        {prospect.website_scores && Object.keys(prospect.website_scores).length > 0 && (
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3">Website audit · {prospect.website_score}/100</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {WS_DIMS.map((d) => {
                const v = prospect.website_scores[d] ?? 0;
                return (
                  <div key={d}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="capitalize text-[var(--ink-2)]">{d}</span>
                      <span className="font-mono text-[var(--muted)]">{v}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--paper-3)] mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${v * 10}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* social metrics */}
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3">
            Instagram metrics {prospect.social_score != null && <span className="text-[var(--ink-2)]">· {prospect.social_score}/100</span>}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SOCIAL_FIELDS.map(([k, label]) => (
              <div key={k} className="grid gap-1">
                <label className="text-[11px] text-[var(--muted)]">{label}</label>
                <input type="number" min="0" className="dash-input" value={social[k]} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-3">
            <label className="flex items-center gap-2 text-[13px] text-[var(--ink-2)] cursor-pointer">
              <input type="checkbox" checked={social.has_reels} onChange={(e) => setSocial({ ...social, has_reels: e.target.checked })} className="accent-[var(--ink)]" /> Has Reels
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[var(--ink-2)] cursor-pointer">
              <input type="checkbox" checked={social.brand_consistent} onChange={(e) => setSocial({ ...social, brand_consistent: e.target.checked })} className="accent-[var(--ink)]" /> Brand consistent
            </label>
          </div>
          <button onClick={saveSocial} disabled={savingSocial} className="dash-btn-ghost mt-3 inline-flex items-center gap-1.5 text-sm">
            {savingSocial ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Save & recompute
          </button>
        </div>

        {/* deliverables */}
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3">Free work to prepare</p>
          <div className="space-y-2">
            {DELIVERABLES.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2.5 text-[14px] text-[var(--ink-2)] cursor-pointer">
                <input type="checkbox" checked={!!prospect.deliverables?.[k]} onChange={() => toggleDeliverable(k)} className="accent-[var(--ink)] w-4 h-4" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* pitch */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Personalized pitch</p>
            <button onClick={regen} disabled={regenerating} className="inline-flex items-center gap-1 text-[12px] text-[var(--accent)] hover:underline">
              {regenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Regenerate
            </button>
          </div>
          <textarea rows={11} className="dash-input font-body text-[13.5px] leading-relaxed" value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="Run an audit to draft a pitch, or write one." />
          <button onClick={savePitch} className="dash-btn-ghost mt-2 text-sm">Save pitch</button>
        </div>

        {/* review actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--line)]">
          <button onClick={() => setReview("approved")} className="dash-btn flex-1 inline-flex items-center justify-center gap-1.5"><Check className="w-4 h-4" /> Ready to send</button>
          <button onClick={() => setReview("contacted")} className="dash-btn-ghost">Contacted</button>
          <button onClick={() => setReview("skip")} className="dash-btn-ghost">Skip</button>
        </div>
      </div>
    </SlideOver>
  );
}

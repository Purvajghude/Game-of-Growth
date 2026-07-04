import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, FileSignature, Copy } from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  "Social media management",
  "Content & film",
  "On-location shoot",
  "Web design",
  "Custom software",
  "App development",
];
const STATUSES = ["draft", "sent", "accepted", "declined"];
const STATUS_STYLE = {
  draft: "bg-[var(--paper-2)] text-[var(--muted)] border border-[var(--line)]",
  sent: "bg-[#b3552e]/10 text-[#b3552e] border border-transparent",
  accepted: "bg-[#3f6b3f]/10 text-[#3f6b3f] border border-transparent",
  declined: "bg-[#a03d2a]/10 text-[#a03d2a] border border-transparent",
};

const EMPTY = { title: "", client: "", contact: "", services: [], amount: 0, status: "draft", valid_until: "", scope: "", notes: "" };

export default function Proposals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listProposals()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm(EMPTY); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, client: p.client || "", contact: p.contact || "",
      services: p.services || [], amount: p.amount || 0, status: p.status || "draft",
      valid_until: p.valid_until || "", scope: p.scope || "", notes: p.notes || "",
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    const payload = { ...form, amount: Number(form.amount) || 0, valid_until: form.valid_until || null };
    try {
      if (editing) {
        const updated = await api.updateProposal(editing.id, payload);
        setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Proposal updated");
      } else {
        const created = await api.createProposal(payload);
        setItems((p) => [created, ...p]);
        toast.success("Proposal created");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this proposal?")) return;
    try { await api.deleteProposal(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Proposal deleted"); }
    catch { toast.error("Delete failed"); }
  };

  const setStatus = async (p, status) => {
    try {
      const updated = await api.updateProposal(p.id, { status });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch { toast.error("Update failed"); }
  };

  const duplicate = async (p) => {
    try {
      const created = await api.createProposal({
        title: `${p.title} (copy)`, client: p.client, contact: p.contact,
        services: p.services, amount: p.amount, status: "draft",
        valid_until: p.valid_until, scope: p.scope, notes: p.notes,
      });
      setItems((prev) => [created, ...prev]);
      toast.success("Proposal duplicated");
    } catch { toast.error("Duplicate failed"); }
  };

  const toggleService = (s) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));

  const filtered = filter === "all" ? items : items.filter((p) => p.status === filter);
  const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">
            {items.length} {items.length === 1 ? "proposal" : "proposals"}
          </p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Quotes that close clients. Draft, send, and track every offer.</p>
        </div>
        <button data-testid="proposals-add-btn" onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New proposal
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium capitalize transition ${
              filter === s ? "bg-[var(--ink)] text-white" : "bg-[var(--paper-2)] text-[var(--ink-2)] hover:bg-[var(--paper-3)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <FileSignature className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">No proposals yet.</p>
          <p className="text-[var(--muted)] mt-2">Turn your next lead into a client. Write the first offer.</p>
          <button onClick={openCreate} className="dash-btn mt-6">+ Create proposal</button>
        </div>
      ) : (
        <div className="dash-card overflow-x-auto">
          <table className="tbl min-w-[820px]" data-testid="proposals-table">
            <thead>
              <tr>
                <th>Proposal</th>
                <th>Client</th>
                <th>Services</th>
                <th>Amount</th>
                <th>Valid until</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="group">
                  <td className="font-medium">{p.title}</td>
                  <td>
                    <div>{p.client || "—"}</div>
                    {p.contact && <div className="text-xs text-[var(--muted)]">{p.contact}</div>}
                  </td>
                  <td className="max-w-[220px]">
                    <div className="flex flex-wrap gap-1">
                      {(p.services || []).slice(0, 3).map((s) => (
                        <span key={s} className="badge bg-[var(--paper-2)] text-[var(--muted)] border border-[var(--line)]">{s}</span>
                      ))}
                      {(p.services || []).length > 3 && (
                        <span className="text-xs text-[var(--muted)]">+{p.services.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="font-mono text-[13px]">{money(p.amount)}</td>
                  <td className="text-[13px] text-[var(--ink-2)]">{p.valid_until || "—"}</td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => setStatus(p, e.target.value)}
                      className={`badge cursor-pointer appearance-none pr-3 ${STATUS_STYLE[p.status] || STATUS_STYLE.draft}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition justify-end">
                      <button onClick={() => duplicate(p)} title="Duplicate" className="text-[var(--muted)] hover:text-[var(--ink)]"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(p)} title="Edit" className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} title="Delete" className="text-[var(--muted)] hover:text-[#a03d2a]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit proposal" : "New proposal"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.title : "Make an offer"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label>
                <input data-testid="proposals-form-title" className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Launch package for Third Wave Café" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Client</label>
                  <input className="dash-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Contact</label>
                  <input className="dash-input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="email or phone" />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Services</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleService(s)}
                      className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition ${
                        form.services.includes(s)
                          ? "bg-[var(--ink)] text-[var(--paper)]"
                          : "bg-[var(--paper-2)] text-[var(--ink-2)] hover:bg-[var(--paper-3)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Amount (₹)</label>
                  <input type="number" min="0" className="dash-input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Valid until</label>
                  <input type="date" className="dash-input" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                  <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Scope</label>
                <textarea rows={6} className="dash-input" placeholder="What's included, deliverables, timeline…" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Internal notes</label>
                <textarea rows={3} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid="proposals-form-submit" type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create proposal"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

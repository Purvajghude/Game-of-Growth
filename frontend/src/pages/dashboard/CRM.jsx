import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Trash2, X, Edit3, Search, Users } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];
const SOURCES = ["Website", "Referral", "LinkedIn", "Cold Outreach", "Event", "Partner", "Other"];

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [form, setForm] = useState({ name: "", email: "", company: "", status: "new", value: 0, notes: "", source: "Website" });

  const load = async () => {
    setLoading(true);
    try { setLeads(await api.listLeads()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ name: "", email: "", company: "", status: "new", value: 0, notes: "", source: "Website" }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (l) => { setEditing(l); setForm({ name: l.name, email: l.email, company: l.company || "", status: l.status, value: l.value || 0, notes: l.notes || "", source: l.source || "Website" }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    try {
      if (editing) {
        const updated = await api.updateLead(editing.id, { ...form, value: Number(form.value) || 0 });
        setLeads((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Lead updated");
      } else {
        const created = await api.createLead({ ...form, value: Number(form.value) || 0 });
        setLeads((p) => [created, ...p]);
        toast.success("Lead created");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try { await api.deleteLead(id); setLeads((p) => p.filter((l) => l.id !== id)); toast.success("Lead deleted"); }
    catch (e) { console.error(e); toast.error("Delete failed"); }
  };

  const bulkUpdateStatus = async (newStatus) => {
    if (selected.size === 0) return;
    const ids = [...selected];
    try {
      await Promise.all(ids.map((id) => api.updateLead(id, { status: newStatus })));
      setLeads((p) => p.map((l) => ids.includes(l.id) ? { ...l, status: newStatus } : l));
      setSelected(new Set());
      toast.success(`${ids.length} lead(s) updated to ${newStatus}`);
    } catch (e) { toast.error("Bulk update failed"); }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };

  const filtered = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q) && !(l.company || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const statusCounts = STATUSES.reduce((acc, s) => { acc[s] = leads.filter((l) => l.status === s).length; return acc; }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{leads.length} {leads.length === 1 ? "lead" : "leads"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Track every conversation from first touch to closed-won.</p>
        </div>
        <button data-testid={DASH.crmAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Lead</button>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilterStatus("all")} className={`badge ${filterStatus === "all" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]"}`}>All ({leads.length})</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`badge ${filterStatus === s ? badgeStyle(s) : "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]"}`}>
            <span className="capitalize">{s}</span> ({statusCounts[s] || 0})
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 bg-white border border-[var(--line)] rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
          <input className="bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--muted)] w-40" placeholder="Search leads…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="dash-card p-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-[var(--ink-2)]">{selected.size} selected</span>
          <span className="text-[var(--muted)]">·</span>
          <span className="text-xs text-[var(--muted)]">Move to:</span>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => bulkUpdateStatus(s)} className="badge bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition capitalize">{s}</button>
          ))}
          <button onClick={() => setSelected(new Set())} className="text-xs text-[var(--muted)] hover:text-[var(--ink)] ml-auto">Clear</button>
        </div>
      )}

      <div className="dash-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[var(--muted)]">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
            <p className="font-display text-4xl text-[var(--ink)]">{leads.length === 0 ? "Your CRM is empty." : "No matches."}</p>
            <p className="text-[var(--muted)] mt-2">{leads.length === 0 ? "Start by capturing your first lead." : "Try adjusting your filters."}</p>
            {leads.length === 0 && <button onClick={openCreate} className="dash-btn mt-6">+ Add your first lead</button>}
          </div>
        ) : (
          <table data-testid={DASH.crmTable} className="tbl">
            <thead>
              <tr>
                <th><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} className="accent-[var(--ink)]" /></th>
                <th>Name</th><th>Email</th><th>Company</th><th>Source</th><th>Status</th><th className="text-right">Value</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className={selected.has(l.id) ? "bg-[var(--paper-2)]" : ""}>
                  <td><input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleSelect(l.id)} className="accent-[var(--ink)]" /></td>
                  <td className="text-[var(--ink)] font-medium">{l.name}</td>
                  <td className="text-[var(--ink-2)]">{l.email}</td>
                  <td className="text-[var(--ink-2)]">{l.company || "—"}</td>
                  <td className="text-[var(--muted)]">{l.source || "—"}</td>
                  <td><span className={`badge ${badgeStyle(l.status)}`}>{l.status}</span></td>
                  <td className="text-right text-[var(--ink)] font-mono">${(l.value || 0).toLocaleString()}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(l)} className="text-[var(--ink-2)] hover:text-[var(--ink)]" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(l.id)} className="text-[var(--muted)] hover:text-[#7a3a23]" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit lead" : "New lead"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.name : "Capture details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Name *</label>
                <input data-testid={DASH.crmFormName} className="dash-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Email *</label>
                <input data-testid={DASH.crmFormEmail} type="email" className="dash-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Company</label>
                <input data-testid={DASH.crmFormCompany} className="dash-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                  <select data-testid={DASH.crmFormStatus} className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Value</label>
                  <input data-testid={DASH.crmFormValue} type="number" className="dash-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Source</label>
                <select className="dash-input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label>
                <textarea rows={4} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.crmFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create lead"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function badgeStyle(s) {
  switch (s) {
    case "new":       return "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]";
    case "contacted": return "bg-[#e9e3d8] text-[#5b4d2e]";
    case "qualified": return "bg-[#e6dec6] text-[#6b5a1e]";
    case "won":       return "bg-[var(--ink)] text-[var(--paper)]";
    case "lost":      return "bg-[#f0d9d0] text-[#7a3a23]";
    default:          return "bg-[var(--paper-2)] text-[var(--ink-2)]";
  }
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Trash2, X, Edit3 } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", status: "new", value: 0, notes: "" });

  const load = async () => {
    setLoading(true);
    try { setLeads(await api.listLeads()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ name: "", email: "", company: "", status: "new", value: 0, notes: "" }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (l) => { setEditing(l); setForm({ name: l.name, email: l.email, company: l.company || "", status: l.status, value: l.value || 0, notes: l.notes || "" }); setOpen(true); };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">{leads.length} {leads.length === 1 ? "lead" : "leads"}</p>
          <p className="text-white/70 text-sm mt-1">Track every conversation from first touch to closed-won.</p>
        </div>
        <button data-testid={DASH.crmAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Lead</button>
      </div>

      <div className="dash-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/40">Loading…</div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-display italic text-4xl text-white/80">Your CRM is empty.</p>
            <p className="text-white/40 mt-2">Start by capturing your first lead. They'll appear here, ready to be moved through your pipeline.</p>
            <button onClick={openCreate} className="dash-btn mt-6">+ Add your first lead</button>
          </div>
        ) : (
          <table data-testid={DASH.crmTable} className="tbl">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Source</th><th>Status</th><th className="text-right">Value</th><th></th></tr></thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="text-white font-medium">{l.name}</td>
                  <td className="text-white/70">{l.email}</td>
                  <td className="text-white/70">{l.company || "—"}</td>
                  <td className="text-white/50">{l.source || "—"}</td>
                  <td><span className={`badge ${badgeStyle(l.status)}`}>{l.status}</span></td>
                  <td className="text-right text-white font-mono">${(l.value || 0).toLocaleString()}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(l)} className="text-white/60 hover:text-white" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(l.id)} className="text-white/40 hover:text-rose-300" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d0d10] border-l border-white/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">{editing ? "Edit lead" : "New lead"}</p>
                <h3 className="font-display italic text-3xl text-white mt-1">{editing ? editing.name : "Capture details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Name *</label>
                <input data-testid={DASH.crmFormName} className="dash-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Email *</label>
                <input data-testid={DASH.crmFormEmail} type="email" className="dash-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Company</label>
                <input data-testid={DASH.crmFormCompany} className="dash-input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Status</label>
                  <select data-testid={DASH.crmFormStatus} className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Value</label>
                  <input data-testid={DASH.crmFormValue} type="number" className="dash-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Notes</label>
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
    case "new": return "bg-cyan-500/15 text-cyan-300";
    case "contacted": return "bg-violet-500/15 text-violet-300";
    case "qualified": return "bg-amber-500/15 text-amber-300";
    case "won": return "bg-emerald-500/15 text-emerald-300";
    case "lost": return "bg-rose-500/15 text-rose-300";
    default: return "bg-white/10 text-white/70";
  }
}

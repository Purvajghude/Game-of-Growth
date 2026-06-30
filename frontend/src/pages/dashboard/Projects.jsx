import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, FolderKanban, LayoutGrid, List } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const TYPES = ["Brand", "Web", "Motion", "Strategy", "Content", "Other"];
const STATUSES = ["briefing", "in-progress", "review", "delivered", "archived"];

const STATUS_STYLE = {
  briefing: "bg-[#e0e7ef] text-[#2c4a6e]",
  "in-progress": "bg-[#e6dec6] text-[#6b5a1e]",
  review: "bg-[#e0d4f5] text-[#5b3a99]",
  delivered: "bg-[var(--ink)] text-[var(--paper)]",
  archived: "bg-[var(--paper-3)] text-[var(--muted)]",
};

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", client: "", project_type: "Brand", status: "briefing", budget: 0, deadline: "", team: [], progress: 0, description: "", notes: "" });

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listProjects()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ title: "", client: "", project_type: "Brand", status: "briefing", budget: 0, deadline: "", team: [], progress: 0, description: "", notes: "" }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, client: p.client || "", project_type: p.project_type || "Brand", status: p.status, budget: p.budget || 0, deadline: p.deadline || "", team: p.team || [], progress: p.progress || 0, description: p.description || "", notes: p.notes || "" });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      const payload = { ...form, budget: Number(form.budget) || 0, progress: Number(form.progress) || 0 };
      if (editing) {
        const updated = await api.updateProject(editing.id, payload);
        setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Project updated");
      } else {
        const created = await api.createProject(payload);
        setItems((p) => [created, ...p]);
        toast.success("Project created");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await api.deleteProject(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Project deleted"); }
    catch (e) { toast.error("Delete failed"); }
  };

  const filtered = items.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !(p.client || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusCounts = STATUSES.reduce((acc, s) => { acc[s] = items.filter((p) => p.status === s).length; return acc; }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{items.length} {items.length === 1 ? "project" : "projects"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Track every client engagement from brief to delivery.</p>
        </div>
        <button data-testid={DASH.projectsAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Project</button>
      </div>

      {/* Status badges + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilterStatus("all")} className={`badge ${filterStatus === "all" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]"}`}>All ({items.length})</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`badge ${filterStatus === s ? STATUS_STYLE[s] : "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]"}`}>
            <span className="capitalize">{s}</span> ({statusCounts[s] || 0})
          </button>
        ))}
        <div className="flex-1" />
        <input className="dash-input w-48 text-sm" placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex border border-[var(--line)] rounded-lg overflow-hidden">
          <button onClick={() => setView("table")} className={`p-2 ${view === "table" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-white text-[var(--ink-2)]"}`}><List className="w-4 h-4" /></button>
          <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-white text-[var(--ink-2)]"}`}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <FolderKanban className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">No projects yet.</p>
          <p className="text-[var(--muted)] mt-2">Create your first project to start tracking client work.</p>
          <button onClick={openCreate} className="dash-btn mt-6">+ Create project</button>
        </div>
      ) : view === "table" ? (
        <div className="dash-card overflow-hidden">
          <table data-testid={DASH.projectsTable} className="tbl">
            <thead><tr><th>Project</th><th>Client</th><th>Type</th><th>Status</th><th>Progress</th><th className="text-right">Budget</th><th>Deadline</th><th></th></tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-[var(--ink)]">{p.title}</td>
                  <td className="text-[var(--ink-2)]">{p.client || "—"}</td>
                  <td><span className="badge bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]">{p.project_type}</span></td>
                  <td><span className={`badge ${STATUS_STYLE[p.status] || ""}`}>{p.status}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-[var(--paper-2)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--ink)]" style={{ width: `${p.progress || 0}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-[var(--muted)]">{p.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="text-right font-mono">${(p.budget || 0).toLocaleString()}</td>
                  <td className="text-[var(--muted)] font-mono text-xs">{p.deadline || "—"}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-[var(--ink-2)] hover:text-[var(--ink)]" aria-label="Edit"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="text-[var(--muted)] hover:text-[#7a3a23]" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="dash-card p-5 group">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`badge ${STATUS_STYLE[p.status] || ""} mb-2`}>{p.status}</span>
                  <p className="font-medium text-[var(--ink)] text-[15px]">{p.title}</p>
                  <p className="text-[var(--muted)] text-xs mt-0.5">{p.client || "No client"} · {p.project_type}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(p)} className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--muted)]">Progress</span>
                  <span className="font-mono text-[var(--ink-2)]">{p.progress || 0}%</span>
                </div>
                <div className="h-1.5 bg-[var(--paper-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--ink)] transition-all" style={{ width: `${p.progress || 0}%` }} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--ink-2)]">${(p.budget || 0).toLocaleString()}</span>
                <span className="font-mono text-[10px] text-[var(--muted)]">{p.deadline || "No deadline"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit project" : "New project"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.title : "Project details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label><input data-testid={DASH.projectsFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Client</label><input data-testid={DASH.projectsFormClient} className="dash-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Type</label>
                  <select className="dash-input" value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                  <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Budget</label><input type="number" className="dash-input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Deadline</label><input type="date" className="dash-input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Progress ({form.progress}%)</label>
                <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-[var(--ink)]" />
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Description</label><textarea rows={3} className="dash-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label><textarea rows={2} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.projectsFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create project"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

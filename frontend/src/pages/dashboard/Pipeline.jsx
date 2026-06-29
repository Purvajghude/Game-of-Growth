import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2 } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const STAGES = [
  { id: "discovery", label: "Discovery", color: "#06b6d4" },
  { id: "proposal", label: "Proposal", color: "#a855f7" },
  { id: "negotiation", label: "Negotiation", color: "#f59e0b" },
  { id: "won", label: "Closed Won", color: "#10b981" },
  { id: "lost", label: "Closed Lost", color: "#ef4444" },
];

export default function Pipeline() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", client: "", value: 0, stage: "discovery", owner: "", due_date: "", notes: "" });
  const [draggingId, setDraggingId] = useState(null);

  const load = async () => { try { setItems(await api.listPipeline()); } catch (e) { console.error(e); } };
  useEffect(() => { load(); }, []);

  const reset = () => setForm({ title: "", client: "", value: 0, stage: "discovery", owner: "", due_date: "", notes: "" });

  const create = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      const created = await api.createPipeline({ ...form, value: Number(form.value) || 0 });
      setItems((p) => [created, ...p]);
      toast.success("Deal added"); setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Create failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try { await api.deletePipeline(id); setItems((p) => p.filter((i) => i.id !== id)); }
    catch (e) { toast.error("Delete failed"); }
  };

  const onDrop = async (stage) => {
    if (!draggingId) return;
    const target = items.find((i) => i.id === draggingId);
    if (!target || target.stage === stage) { setDraggingId(null); return; }
    // optimistic
    setItems((p) => p.map((i) => i.id === draggingId ? { ...i, stage } : i));
    setDraggingId(null);
    try { await api.updatePipeline(target.id, { stage }); }
    catch (e) { toast.error("Move failed"); load(); }
  };

  const totalByStage = (stage) => items.filter((i) => i.stage === stage).reduce((sum, i) => sum + (i.value || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Drag deals between stages to update.</p>
        <button data-testid={DASH.pipelineAddBtn} onClick={() => setOpen(true)} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Deal</button>
      </div>

      <div data-testid={DASH.pipelineBoard} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 overflow-x-auto">
        {STAGES.map((s) => (
          <div
            key={s.id}
            className="kanban-col p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(s.id)}
          >
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[var(--ink)] text-sm font-medium">{s.label}</span>
                <span className="text-[var(--muted)] text-xs font-mono">{items.filter((i) => i.stage === s.id).length}</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--muted)]">${totalByStage(s.id).toLocaleString()}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {items.filter((i) => i.stage === s.id).map((i) => (
                <div
                  key={i.id}
                  draggable
                  onDragStart={() => setDraggingId(i.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className="kanban-card group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[var(--ink)] text-sm font-medium leading-snug">{i.title}</p>
                    <button onClick={() => remove(i.id)} className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {i.client && <p className="text-[var(--muted)] text-xs mt-1">{i.client}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[var(--ink-2)]">${(i.value || 0).toLocaleString()}</span>
                    {i.due_date && <span className="font-mono text-[10px] text-[var(--muted)]">{i.due_date}</span>}
                  </div>
                </div>
              ))}
              {items.filter((i) => i.stage === s.id).length === 0 && (
                <div className="text-[var(--muted)] text-xs text-center py-6 border border-dashed border-[var(--line)] rounded-lg">Drop here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-3xl text-[var(--ink)]">New deal</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={create} className="space-y-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label><input data-testid={DASH.pipelineFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Client</label><input data-testid={DASH.pipelineFormClient} className="dash-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Value</label><input data-testid={DASH.pipelineFormValue} type="number" className="dash-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Stage</label>
                  <select data-testid={DASH.pipelineFormStage} className="dash-input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                    {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Owner</label><input className="dash-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Due date</label><input type="date" className="dash-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label><textarea rows={4} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.pipelineFormSubmit} type="submit" className="dash-btn flex-1">Create deal</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, DollarSign } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const COLUMNS = [
  { id: "discovery", label: "Discovery" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

export default function Pipeline() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [form, setForm] = useState({ title: "", client: "", value: 0, stage: "discovery", owner: "", due_date: "", notes: "" });

  const load = async () => { try { setItems(await api.listPipeline()); } catch (e) { console.error(e); } };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ title: "", client: "", value: 0, stage: "discovery", owner: "", due_date: "", notes: "" }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (i) => {
    setEditing(i);
    setForm({ title: i.title, client: i.client || "", value: i.value || 0, stage: i.stage, owner: i.owner || "", due_date: i.due_date || "", notes: i.notes || "" });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      const payload = { ...form, value: Number(form.value) || 0 };
      if (editing) {
        const updated = await api.updatePipeline(editing.id, payload);
        setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Deal updated");
      } else {
        const created = await api.createPipeline(payload);
        setItems((p) => [created, ...p]);
        toast.success("Deal added");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this deal?")) return;
    try { await api.deletePipeline(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Deal deleted"); }
    catch (e) { toast.error("Delete failed"); }
  };

  const onDrop = async (stage) => {
    if (!draggingId) return;
    const target = items.find((i) => i.id === draggingId);
    if (!target || target.stage === stage) { setDraggingId(null); return; }
    setItems((p) => p.map((i) => i.id === draggingId ? { ...i, stage } : i));
    setDraggingId(null);
    try { await api.updatePipeline(target.id, { stage }); }
    catch (e) { toast.error("Move failed"); load(); }
  };

  const totalValue = items.filter(i => i.stage !== 'lost').reduce((s, i) => s + (i.value || 0), 0);
  const byStage = COLUMNS.reduce((acc, col) => {
    acc[col.id] = items.filter(i => i.stage === col.id).reduce((s, i) => s + (i.value || 0), 0);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{items.length} {items.length === 1 ? "deal" : "deals"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Visualize your sales process. Drag and drop deals to update their stage.</p>
        </div>
        <button data-testid={DASH.pipelineAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Deal</button>
      </div>

      {/* Value Summary Bar */}
      <div className="dash-card p-4 flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap">
        <div className="pr-6 border-r border-[var(--line)]">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Total Pipeline</p>
          <p className="font-mono text-xl text-[var(--ink)] mt-1">${totalValue.toLocaleString()}</p>
        </div>
        {COLUMNS.map(col => (
          <div key={col.id} className="min-w-[120px]">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{col.label}</p>
            <p className="font-mono text-lg text-[var(--ink-2)] mt-1">${(byStage[col.id] || 0).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div data-testid={DASH.pipelineBoard} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="kanban-col p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[var(--ink)] text-sm font-medium">{col.label}</span>
              <span className="text-[var(--muted)] text-xs font-mono">{items.filter((i) => i.stage === col.id).length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {items.filter((i) => i.stage === col.id).map((i) => (
                <div
                  key={i.id}
                  draggable
                  onDragStart={() => setDraggingId(i.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className="kanban-card group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[var(--ink)] text-sm font-medium leading-snug">{i.title}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                      <button onClick={() => openEdit(i)} className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => remove(i.id)} className="text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {i.client && <p className="text-[var(--muted)] text-xs mt-1">{i.client}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[var(--ink)] font-mono text-xs">${(i.value || 0).toLocaleString()}</span>
                    {i.owner && <span className="w-6 h-6 rounded-full bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)] flex items-center justify-center text-[10px] font-medium" title={i.owner}>{i.owner.charAt(0).toUpperCase()}</span>}
                  </div>
                  {i.due_date && <p className="mt-2 font-mono text-[9px] text-[var(--muted)]">Due: {i.due_date}</p>}
                </div>
              ))}
              {items.filter((i) => i.stage === col.id).length === 0 && (
                <div className="text-[var(--muted)] text-xs text-center py-6 border border-dashed border-[var(--line)] rounded-lg">Drop here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit deal" : "New deal"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.title : "Deal details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label>
                <input data-testid={DASH.pipelineFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Client</label>
                <input data-testid={DASH.pipelineFormClient} className="dash-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Value</label>
                  <input data-testid={DASH.pipelineFormValue} type="number" className="dash-input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Stage</label>
                  <select data-testid={DASH.pipelineFormStage} className="dash-input" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                    {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Owner</label>
                  <input className="dash-input" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Due Date</label>
                  <input type="date" className="dash-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label>
                <textarea rows={4} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.pipelineFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create deal"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, CheckSquare } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "in-progress", label: "In Progress", color: "#f59e0b" },
  { id: "review", label: "Review", color: "#a855f7" },
  { id: "done", label: "Done", color: "#10b981" },
];

const PRIORITIES = ["low", "medium", "high", "urgent"];
const PRIORITY_STYLE = {
  low: "bg-[var(--paper-3)] text-[var(--muted)]",
  medium: "bg-[#e6dec6] text-[#6b5a1e]",
  high: "bg-[#f0d9d0] text-[#7a3a23]",
  urgent: "bg-[#e74c3c] text-white",
};

export default function TeamTasks() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [quickAdd, setQuickAdd] = useState({});
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [form, setForm] = useState({ title: "", assignee: "", priority: "medium", status: "todo", due_date: "", tags: [], description: "", project: "" });

  const load = async () => { try { setItems(await api.listTasks()); } catch (e) { console.error(e); } };
  useEffect(() => { load(); }, []);

  const reset = () => setForm({ title: "", assignee: "", priority: "medium", status: "todo", due_date: "", tags: [], description: "", project: "" });

  const create = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      const created = await api.createTask(form);
      setItems((p) => [created, ...p]);
      toast.success("Task added"); setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Create failed"); }
  };

  const quickCreate = async (colId) => {
    const title = quickAdd[colId]?.trim();
    if (!title) return;
    try {
      const created = await api.createTask({ title, status: colId, priority: "medium" });
      setItems((p) => [created, ...p]);
      setQuickAdd({ ...quickAdd, [colId]: "" });
    } catch (err) { toast.error("Create failed"); }
  };

  const remove = async (id) => {
    try { await api.deleteTask(id); setItems((p) => p.filter((i) => i.id !== id)); }
    catch (e) { toast.error("Delete failed"); }
  };

  const onDrop = async (status) => {
    if (!draggingId) return;
    const target = items.find((i) => i.id === draggingId);
    if (!target || target.status === status) { setDraggingId(null); return; }
    setItems((p) => p.map((i) => i.id === draggingId ? { ...i, status } : i));
    setDraggingId(null);
    try { await api.updateTask(target.id, { status }); }
    catch (e) { toast.error("Move failed"); load(); }
  };

  const assignees = [...new Set(items.map((i) => i.assignee).filter(Boolean))];

  const filteredItems = items.filter((i) => {
    if (filterAssignee !== "all" && i.assignee !== filterAssignee) return false;
    if (filterPriority !== "all" && i.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{items.length} {items.length === 1 ? "task" : "tasks"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Internal task board. Drag tasks between columns to update status.</p>
        </div>
        <button data-testid={DASH.tasksAddBtn} onClick={() => setOpen(true)} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Task</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select className="dash-input text-sm py-1.5" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
          <option value="all">All assignees</option>
          {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="dash-input text-sm py-1.5" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Kanban */}
      <div data-testid={DASH.tasksBoard} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="kanban-col p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
          >
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.color }} />
                <span className="text-[var(--ink)] text-sm font-medium">{col.label}</span>
                <span className="text-[var(--muted)] text-xs font-mono">{filteredItems.filter((i) => i.status === col.id).length}</span>
              </div>
            </div>

            {/* Quick add */}
            <div className="mb-2">
              <input
                className="dash-input text-sm w-full"
                placeholder="+ Quick add…"
                value={quickAdd[col.id] || ""}
                onChange={(e) => setQuickAdd({ ...quickAdd, [col.id]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && quickCreate(col.id)}
              />
            </div>

            <div className="space-y-2 min-h-[100px]">
              {filteredItems.filter((i) => i.status === col.id).map((i) => (
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
                  {i.description && <p className="text-[var(--muted)] text-xs mt-1 line-clamp-2">{i.description}</p>}
                  <div className="mt-3 flex items-center justify-between flex-wrap gap-1">
                    <span className={`badge text-[9px] ${PRIORITY_STYLE[i.priority] || ""}`}>{i.priority}</span>
                    <div className="flex items-center gap-2">
                      {i.assignee && <span className="w-6 h-6 rounded-full bg-[var(--ink)] text-[var(--paper)] flex items-center justify-center text-[10px] font-medium">{i.assignee.charAt(0).toUpperCase()}</span>}
                      {i.due_date && <span className="font-mono text-[10px] text-[var(--muted)]">{i.due_date}</span>}
                    </div>
                  </div>
                  {i.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {i.tags.map((t) => <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--paper-2)] text-[var(--muted)]">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
              {filteredItems.filter((i) => i.status === col.id).length === 0 && (
                <div className="text-[var(--muted)] text-xs text-center py-6 border border-dashed border-[var(--line)] rounded-lg">Drop here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-3xl text-[var(--ink)]">New task</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={create} className="space-y-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label><input data-testid={DASH.tasksFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Assignee</label><input className="dash-input" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Priority</label>
                  <select className="dash-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                  <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Due date</label><input type="date" className="dash-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Project</label><input className="dash-input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Description</label><textarea rows={4} className="dash-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.tasksFormSubmit} type="submit" className="dash-btn flex-1">Create task</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

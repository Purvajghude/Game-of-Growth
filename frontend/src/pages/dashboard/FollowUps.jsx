import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Phone, Mail, MessageCircle, CalendarClock, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

const CHANNELS = [
  { value: "call", label: "Call", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
  { value: "meeting", label: "Meeting", icon: CalendarClock },
];
const EMPTY = { lead_name: "", contact: "", channel: "call", due_date: "", note: "" };

const todayStr = () => new Date().toISOString().slice(0, 10);

function bucketOf(f) {
  const today = todayStr();
  if (f.done) return "done";
  if (f.due_date < today) return "overdue";
  if (f.due_date === today) return "today";
  return "upcoming";
}

const BUCKETS = [
  { key: "overdue", label: "Overdue", tone: "text-[#a03d2a]" },
  { key: "today", label: "Due today", tone: "text-[#b3552e]" },
  { key: "upcoming", label: "Upcoming", tone: "text-[var(--ink-2)]" },
  { key: "done", label: "Done", tone: "text-[var(--muted)]" },
];

export default function FollowUps() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listFollowups()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.lead_name || !form.due_date) { toast.error("Lead name and date are required"); return; }
    try {
      const created = await api.createFollowup(form);
      setItems((p) => [...p, created].sort((a, b) => a.due_date.localeCompare(b.due_date)));
      toast.success("Follow-up scheduled");
      setOpen(false); setForm(EMPTY);
    } catch { toast.error("Save failed"); }
  };

  const toggleDone = async (f) => {
    try {
      const updated = await api.updateFollowup(f.id, { done: !f.done });
      setItems((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    } catch { toast.error("Update failed"); }
  };

  const remove = async (id) => {
    try { await api.deleteFollowup(id); setItems((p) => p.filter((i) => i.id !== id)); }
    catch { toast.error("Delete failed"); }
  };

  const grouped = BUCKETS.map((b) => ({ ...b, rows: items.filter((f) => bucketOf(f) === b.key) }));
  const openCount = items.filter((f) => !f.done).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">
            {openCount} open
          </p>
          <p className="text-[var(--ink-2)] text-sm mt-1">
            Leads go cold in days. This list makes sure nobody slips.
          </p>
        </div>
        <button data-testid="followups-add-btn" onClick={() => setOpen(true)} className="dash-btn inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Schedule follow-up
        </button>
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <CalendarClock className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">Nothing scheduled.</p>
          <p className="text-[var(--muted)] mt-2">Every lead deserves a next touch. Add the first one.</p>
          <button onClick={() => setOpen(true)} className="dash-btn mt-6">+ Schedule follow-up</button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(
            (bucket) =>
              bucket.rows.length > 0 && (
                <div key={bucket.key}>
                  <p className={`font-mono text-[10px] tracking-widest uppercase mb-2 ${bucket.tone}`}>
                    {bucket.label} ({bucket.rows.length})
                  </p>
                  <div className="dash-card divide-y divide-[var(--line)]">
                    {bucket.rows.map((f) => {
                      const ch = CHANNELS.find((c) => c.value === f.channel) || CHANNELS[0];
                      const Icon = ch.icon;
                      return (
                        <div key={f.id} className="flex items-center gap-4 px-5 py-3.5 group">
                          <button onClick={() => toggleDone(f)} title={f.done ? "Mark open" : "Mark done"} className="shrink-0">
                            {f.done ? (
                              <CheckCircle2 className="w-5 h-5 text-[#3f6b3f]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[var(--muted)] hover:text-[var(--ink)] transition" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${f.done ? "line-through text-[var(--muted)]" : "text-[var(--ink)]"}`}>
                              {f.lead_name}
                              {f.contact && <span className="text-[var(--muted)] font-normal"> · {f.contact}</span>}
                            </p>
                            {f.note && <p className="text-xs text-[var(--muted)] truncate mt-0.5">{f.note}</p>}
                          </div>
                          <span className="badge bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)] inline-flex items-center gap-1.5 shrink-0">
                            <Icon className="w-3 h-3" /> {ch.label}
                          </span>
                          <span className="font-mono text-[12px] text-[var(--ink-2)] shrink-0 w-24 text-right">{f.due_date}</span>
                          <button
                            onClick={() => remove(f.id)}
                            className="opacity-0 group-hover:opacity-100 transition text-[var(--muted)] hover:text-[#a03d2a] shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">New follow-up</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">Stay on it</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Lead / client *</label>
                <input data-testid="followups-form-name" className="dash-input" value={form.lead_name} onChange={(e) => setForm({ ...form, lead_name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Contact</label>
                <input className="dash-input" placeholder="phone / email / handle" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Channel</label>
                  <select className="dash-input" value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                    {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Due date *</label>
                  <input type="date" className="dash-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Note</label>
                <textarea rows={3} className="dash-input" placeholder="What to say, what they asked for…" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid="followups-form-submit" type="submit" className="dash-btn flex-1">Schedule</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

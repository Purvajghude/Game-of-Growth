import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, Calendar as CalendarIcon, List as ListIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const PLATFORMS = ["Instagram", "LinkedIn", "Twitter", "TikTok", "Blog", "Newsletter"];
const STATUSES = ["draft", "scheduled", "published"];

const PLATFORM_COLORS = {
  Instagram: "bg-pink-100 text-pink-700 border-pink-200",
  LinkedIn: "bg-blue-100 text-blue-700 border-blue-200",
  Twitter: "bg-sky-100 text-sky-700 border-sky-200",
  TikTok: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Blog: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Newsletter: "bg-purple-100 text-purple-700 border-purple-200",
};

const STATUS_STYLE = {
  draft: "bg-[var(--paper-3)] text-[var(--muted)]",
  scheduled: "bg-[#e6dec6] text-[#6b5a1e]",
  published: "bg-[var(--ink)] text-[var(--paper)]",
};

export default function ContentCalendar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState("calendar"); // calendar | list
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [form, setForm] = useState({ title: "", platform: "Instagram", date: "", status: "draft", notes: "" });

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listContent()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = (date = "") => { setEditing(null); setForm({ title: "", platform: "Instagram", date, status: "draft", notes: "" }); };
  const openCreate = (date = "") => { reset(date); setOpen(true); };
  const openEdit = (i) => {
    setEditing(i);
    setForm({ title: i.title, platform: i.platform || "Instagram", date: i.date || "", status: i.status || "draft", notes: i.notes || "" });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error("Title and Date required"); return; }
    try {
      if (editing) {
        const updated = await api.updateContent(editing.id, form);
        setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Event updated");
      } else {
        const created = await api.createContent(form);
        setItems((p) => [...p, created]);
        toast.success("Event added");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try { await api.deleteContent(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Event deleted"); }
    catch (e) { toast.error("Delete failed"); }
  };

  // Calendar logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const today = new Date();
  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Monday start

  const formatMonth = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Stats
  const draftCount = items.filter(i => i.status === 'draft').length;
  const scheduledCount = items.filter(i => i.status === 'scheduled').length;
  const publishedCount = items.filter(i => i.status === 'published').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Content Calendar</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Plan, schedule, and publish your content.</p>
        </div>
        <button data-testid={DASH.calendarAddBtn} onClick={() => openCreate()} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Event</button>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-[var(--line)] rounded-xl p-3">
        <div className="flex items-center gap-4 text-sm px-2">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--paper-3)]"></span> Drafts ({draftCount})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e6dec6]"></span> Scheduled ({scheduledCount})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--ink)]"></span> Published ({publishedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-[var(--line)] rounded-lg overflow-hidden">
            <button onClick={() => setView("calendar")} className={`p-1.5 ${view === "calendar" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-white text-[var(--ink-2)]"}`}><CalendarIcon className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 ${view === "list" ? "bg-[var(--ink)] text-[var(--paper)]" : "bg-white text-[var(--ink-2)]"}`}><ListIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : view === "calendar" ? (
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-[var(--ink)]">{formatMonth}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1.5 rounded hover:bg-[var(--paper-2)] border border-[var(--line)]"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentMonth(new Date())} className={`text-xs font-medium px-2 py-1 rounded border ${isCurrentMonth ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]" : "bg-white border-[var(--line)]"}`}>Today</button>
              <button onClick={nextMonth} className="p-1.5 rounded hover:bg-[var(--paper-2)] border border-[var(--line)]"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-[var(--line)] rounded-lg overflow-hidden border border-[var(--line)]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="bg-[var(--paper-2)] p-2 text-center font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">{d}</div>
            ))}
            {blanks.map((b) => <div key={`b-${b}`} className="bg-[#fcfbf9] min-h-[100px] p-2 opacity-50" />)}
            {days.map((d) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const dayEvents = items.filter((i) => i.date === dateStr);
              const isToday = isCurrentMonth && d === today.getDate();
              
              return (
                <div key={d} className={`bg-white min-h-[100px] p-2 relative group ${isToday ? "ring-inset ring-2 ring-[var(--ink)] z-10" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-mono ${isToday ? "bg-[var(--ink)] text-white w-5 h-5 rounded-full flex items-center justify-center" : "text-[var(--ink-2)]"}`}>{d}</span>
                    <button onClick={() => openCreate(dateStr)} className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--ink)]"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((evt) => (
                      <div key={evt.id} onClick={() => openEdit(evt)} className={`text-[10px] p-1.5 rounded border leading-tight cursor-pointer group/evt ${PLATFORM_COLORS[evt.platform] || "bg-[var(--paper-2)] border-[var(--line)]"}`}>
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-medium truncate">{evt.title}</span>
                          {evt.status === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-0.5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="dash-card overflow-hidden">
          <table className="tbl">
            <thead>
              <tr><th>Date</th><th>Title</th><th>Platform</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.slice().sort((a,b) => new Date(a.date) - new Date(b.date)).map((evt) => (
                <tr key={evt.id}>
                  <td className="font-mono text-sm">{evt.date}</td>
                  <td className="font-medium text-[var(--ink)]">{evt.title}</td>
                  <td><span className={`badge border ${PLATFORM_COLORS[evt.platform] || "bg-[var(--paper-2)] border-[var(--line)]"}`}>{evt.platform}</span></td>
                  <td><span className={`badge ${STATUS_STYLE[evt.status] || ""}`}>{evt.status}</span></td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(evt)} className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(evt.id)} className="text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-[var(--muted)]">No content scheduled.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit event" : "New event"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.title : "Content details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label>
                <input data-testid={DASH.calendarFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Platform</label>
                  <select data-testid={DASH.calendarFormPlatform} className="dash-input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Date *</label>
                  <input data-testid={DASH.calendarFormDate} type="date" className="dash-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label>
                <textarea rows={4} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.calendarFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create event"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

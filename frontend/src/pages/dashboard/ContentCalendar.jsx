import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const PLATFORMS = ["Instagram", "X / Twitter", "LinkedIn", "YouTube", "TikTok", "Newsletter", "Blog"];
const STATUSES = ["draft", "scheduled", "published"];

function monthMatrix(year, month) {
  // month 0-indexed
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function ContentCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [presetDate, setPresetDate] = useState("");
  const [form, setForm] = useState({ title: "", platform: "Instagram", date: iso(today), status: "draft", notes: "" });

  const load = async () => { try { setEvents(await api.listContent()); } catch (e) { console.error(e); } };
  useEffect(() => { load(); }, []);

  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const monthName = new Date(year, month, 1).toLocaleString("en", { month: "long" });

  const prev = () => { const d = new Date(year, month - 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };
  const next = () => { const d = new Date(year, month + 1, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) { toast.error("Title and date required"); return; }
    try {
      const ev = await api.createContent(form);
      setEvents((p) => [...p, ev]); toast.success("Event added"); setOpen(false);
    } catch (err) { toast.error("Create failed"); }
  };

  const remove = async (id) => {
    try { await api.deleteContent(id); setEvents((p) => p.filter((e) => e.id !== id)); }
    catch (e) { toast.error("Delete failed"); }
  };

  const openAt = (date) => {
    setPresetDate(date);
    setForm({ title: "", platform: "Instagram", date, status: "draft", notes: "" });
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
          <h2 className="font-display italic text-3xl text-white">{monthName} {year}</h2>
          <button onClick={next} className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <button data-testid={DASH.calendarAddBtn} onClick={() => openAt(iso(new Date()))} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Event</button>
      </div>

      <div className="dash-card p-3">
        <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="bg-[#0d0d10] py-2 text-center font-mono text-[10px] text-white/40 tracking-widest uppercase">{d}</div>
          ))}
          {cells.map((c, i) => {
            const dateStr = c ? iso(c) : null;
            const dayEvents = c ? events.filter((e) => e.date === dateStr) : [];
            const isToday = c && iso(c) === iso(new Date());
            return (
              <div key={i} onClick={() => c && openAt(dateStr)} className={`bg-[#0d0d10] min-h-[110px] p-2 ${c ? "cursor-pointer hover:bg-white/[0.02]" : "opacity-30"}`}>
                {c && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs ${isToday ? "text-[#ffb800] font-bold" : "text-white/60"}`}>{c.getDate()}</span>
                      {dayEvents.length > 0 && <span className="font-mono text-[10px] text-white/40">{dayEvents.length}</span>}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div key={e.id} onClick={(ev) => { ev.stopPropagation(); remove(e.id); }} title="Click to delete" className={`group text-[11px] rounded px-1.5 py-0.5 ${statusStyle(e.status)} truncate`}>
                          <span className="text-[9px] opacity-60 mr-1">{e.platform.slice(0, 2).toUpperCase()}</span>{e.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && <p className="text-[10px] text-white/40">+{dayEvents.length - 3} more</p>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0d0d10] border-l border-white/10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display italic text-3xl text-white">New content</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={create} className="space-y-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Title *</label><input data-testid={DASH.calendarFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Platform</label>
                  <select data-testid={DASH.calendarFormPlatform} className="dash-input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Date *</label><input data-testid={DASH.calendarFormDate} type="date" className="dash-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Status</label>
                <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Notes</label><textarea rows={4} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.calendarFormSubmit} type="submit" className="dash-btn flex-1">Create event</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
              <p className="font-mono text-[10px] text-white/40">Tip: click any day to add an event for that date.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function statusStyle(s) {
  switch (s) {
    case "published": return "bg-emerald-500/20 text-emerald-300";
    case "scheduled": return "bg-amber-500/20 text-amber-300";
    default: return "bg-cyan-500/15 text-cyan-300";
  }
}

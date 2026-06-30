import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, Pin, PinOff, Search, FileText } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const CATEGORIES = ["General", "Meeting Notes", "Strategy", "Brief", "Research", "Ideas"];

export default function Notes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({ title: "", content: "", category: "General", project: "", pinned: false, tags: [] });

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listNotes()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ title: "", content: "", category: "General", project: "", pinned: false, tags: [] }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (note) => {
    setEditing(note);
    setForm({ title: note.title, content: note.content || "", category: note.category || "General", project: note.project || "", pinned: note.pinned || false, tags: note.tags || [] });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required"); return; }
    try {
      if (editing) {
        const updated = await api.updateNote(editing.id, form);
        setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Note updated");
      } else {
        const created = await api.createNote(form);
        setItems((p) => [created, ...p]);
        toast.success("Note created");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try { await api.deleteNote(id); setItems((p) => p.filter((i) => i.id !== id)); if (selectedId === id) setSelectedId(null); toast.success("Note deleted"); }
    catch (e) { toast.error("Delete failed"); }
  };

  const togglePin = async (note) => {
    try {
      const updated = await api.updateNote(note.id, { pinned: !note.pinned });
      setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
    } catch (e) { toast.error("Update failed"); }
  };

  const filtered = items.filter((n) => {
    if (filterCategory !== "all" && n.category !== filterCategory) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !(n.content || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const selected = items.find((n) => n.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{items.length} {items.length === 1 ? "note" : "notes"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Your team's knowledge base. Pin important notes, tag by project.</p>
        </div>
        <button data-testid={DASH.notesAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Note</button>
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-[var(--line)] rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
          <input className="bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--muted)] w-full" placeholder="Search notes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="dash-input text-sm py-1.5" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <FileText className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">No notes yet.</p>
          <p className="text-[var(--muted)] mt-2">Start capturing ideas, meeting notes, and project briefs.</p>
          <button onClick={openCreate} className="dash-btn mt-6">+ Create note</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Notes list */}
          <div className="lg:col-span-5 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`dash-card p-4 cursor-pointer group transition-all ${selectedId === n.id ? "ring-2 ring-[var(--ink)]" : "hover:shadow-sm"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {n.pinned && <Pin className="w-3 h-3 text-[var(--accent)] shrink-0" />}
                      <p className="font-medium text-[var(--ink)] text-sm truncate">{n.title}</p>
                    </div>
                    <p className="text-[var(--muted)] text-xs mt-1 line-clamp-2">{n.content || "Empty note"}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); togglePin(n); }} className="text-[var(--muted)] hover:text-[var(--ink)]">{n.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}</button>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(n); }} className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="badge bg-[var(--paper-2)] text-[var(--muted)] border border-[var(--line)] text-[9px]">{n.category}</span>
                  {n.project && <span className="text-[9px] font-mono text-[var(--muted)]">{n.project}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Note preview */}
          <div className="lg:col-span-7">
            {selected ? (
              <div className="dash-card p-6 min-h-[500px]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {selected.pinned && <Pin className="w-4 h-4 text-[var(--accent)]" />}
                      <h2 className="font-display text-3xl text-[var(--ink)]">{selected.title}</h2>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="badge bg-[var(--paper-2)] text-[var(--muted)] border border-[var(--line)]">{selected.category}</span>
                      {selected.project && <span className="font-mono text-[10px] text-[var(--muted)]">Project: {selected.project}</span>}
                    </div>
                  </div>
                  <button onClick={() => openEdit(selected)} className="dash-btn-ghost text-sm inline-flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                </div>
                <div className="prose max-w-none text-[var(--ink-2)] whitespace-pre-wrap leading-relaxed text-[15px] mt-6">
                  {selected.content || "No content yet. Click Edit to add content."}
                </div>
              </div>
            ) : (
              <div className="dash-card p-16 text-center min-h-[500px] flex flex-col items-center justify-center">
                <FileText className="w-10 h-10 text-[var(--muted)] mb-3" />
                <p className="font-display italic text-2xl text-[var(--ink-2)]">Select a note to preview</p>
                <p className="text-[var(--muted)] text-sm mt-1">Or create a new one to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit note" : "New note"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? editing.title : "Write something"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Title *</label><input data-testid={DASH.notesFormTitle} className="dash-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Category</label>
                  <select className="dash-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Project</label><input className="dash-input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} /></div>
              </div>
              <div className="grid gap-1">
                <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Content</label>
                <textarea rows={16} className="dash-input font-mono text-sm" placeholder="Start writing…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="accent-[var(--ink)]" />
                  <span className="text-sm text-[var(--ink-2)]">Pin this note</span>
                </label>
              </div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.notesFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create note"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

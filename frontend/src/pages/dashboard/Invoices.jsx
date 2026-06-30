import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, Trash2, Edit3, Receipt, DollarSign } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { toast } from "sonner";

const STATUSES = ["draft", "sent", "paid", "overdue"];
const STATUS_STYLE = {
  draft: "bg-[var(--paper-3)] text-[var(--ink-2)]",
  sent: "bg-[#e6dec6] text-[#6b5a1e]",
  paid: "bg-[var(--ink)] text-[var(--paper)]",
  overdue: "bg-[#f0d9d0] text-[#7a3a23]",
};

function calcTotal(items, taxRate) {
  const sub = (items || []).reduce((s, li) => s + (li.quantity || 1) * (li.rate || 0), 0);
  return sub + sub * ((taxRate || 0) / 100);
}

export default function Invoices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ invoice_number: "", client: "", project: "", status: "draft", line_items: [{ description: "", quantity: 1, rate: 0 }], tax_rate: 0, notes: "", due_date: "" });

  const load = async () => {
    setLoading(true);
    try { setItems(await api.listInvoices()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setEditing(null); setForm({ invoice_number: "", client: "", project: "", status: "draft", line_items: [{ description: "", quantity: 1, rate: 0 }], tax_rate: 0, notes: "", due_date: "" }); };
  const openCreate = () => { reset(); setOpen(true); };
  const openEdit = (inv) => {
    setEditing(inv);
    setForm({ invoice_number: inv.invoice_number || "", client: inv.client, project: inv.project || "", status: inv.status, line_items: inv.line_items?.length ? inv.line_items : [{ description: "", quantity: 1, rate: 0 }], tax_rate: inv.tax_rate || 0, notes: inv.notes || "", due_date: inv.due_date || "" });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.client) { toast.error("Client is required"); return; }
    try {
      const payload = { ...form, tax_rate: Number(form.tax_rate) || 0, line_items: form.line_items.map((li) => ({ ...li, quantity: Number(li.quantity) || 1, rate: Number(li.rate) || 0 })) };
      if (editing) {
        const updated = await api.updateInvoice(editing.id, payload);
        setItems((p) => p.map((x) => x.id === updated.id ? updated : x));
        toast.success("Invoice updated");
      } else {
        const created = await api.createInvoice(payload);
        setItems((p) => [created, ...p]);
        toast.success("Invoice created");
      }
      setOpen(false); reset();
    } catch (err) { console.error(err); toast.error("Save failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try { await api.deleteInvoice(id); setItems((p) => p.filter((i) => i.id !== id)); toast.success("Invoice deleted"); }
    catch (e) { toast.error("Delete failed"); }
  };

  const addLine = () => setForm({ ...form, line_items: [...form.line_items, { description: "", quantity: 1, rate: 0 }] });
  const removeLine = (idx) => setForm({ ...form, line_items: form.line_items.filter((_, i) => i !== idx) });
  const updateLine = (idx, field, value) => {
    const updated = [...form.line_items];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, line_items: updated });
  };

  const subtotal = (form.line_items || []).reduce((s, li) => s + (Number(li.quantity) || 1) * (Number(li.rate) || 0), 0);
  const tax = subtotal * ((Number(form.tax_rate) || 0) / 100);
  const total = subtotal + tax;

  // Summary cards
  const totalInvoiced = items.reduce((s, i) => s + calcTotal(i.line_items, i.tax_rate), 0);
  const totalPaid = items.filter((i) => i.status === "paid").reduce((s, i) => s + calcTotal(i.line_items, i.tax_rate), 0);
  const totalOverdue = items.filter((i) => i.status === "overdue").reduce((s, i) => s + calcTotal(i.line_items, i.tax_rate), 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{items.length} {items.length === 1 ? "invoice" : "invoices"}</p>
          <p className="text-[var(--ink-2)] text-sm mt-1">Create invoices, track payments, manage cash flow.</p>
        </div>
        <button data-testid={DASH.invoicesAddBtn} onClick={openCreate} className="dash-btn inline-flex items-center gap-1.5"><Plus className="w-4 h-4" /> New Invoice</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Invoiced", value: totalInvoiced },
          { label: "Paid", value: totalPaid },
          { label: "Outstanding", value: totalOutstanding },
          { label: "Overdue", value: totalOverdue },
        ].map((c) => (
          <div key={c.label} className="dash-card p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{c.label}</p>
            <p className="font-display mt-1" style={{ fontSize: 28, fontVariationSettings: "'opsz' 144, 'SOFT' 30", color: "var(--ink)" }}>${c.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="dash-card p-12 text-center text-[var(--muted)]">Loading…</div>
      ) : items.length === 0 ? (
        <div className="dash-card p-16 text-center">
          <Receipt className="w-12 h-12 mx-auto text-[var(--muted)] mb-3" />
          <p className="font-display text-4xl text-[var(--ink)]">No invoices yet.</p>
          <p className="text-[var(--muted)] mt-2">Create your first invoice to start tracking revenue.</p>
          <button onClick={openCreate} className="dash-btn mt-6">+ Create invoice</button>
        </div>
      ) : (
        <div className="dash-card overflow-hidden">
          <table data-testid={DASH.invoicesTable} className="tbl">
            <thead><tr><th>Invoice #</th><th>Client</th><th>Project</th><th>Status</th><th className="text-right">Amount</th><th>Due</th><th></th></tr></thead>
            <tbody>
              {items.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-[var(--ink)]">{inv.invoice_number || "—"}</td>
                  <td className="font-medium text-[var(--ink)]">{inv.client}</td>
                  <td className="text-[var(--ink-2)]">{inv.project || "—"}</td>
                  <td><span className={`badge ${STATUS_STYLE[inv.status] || ""}`}>{inv.status}</span></td>
                  <td className="text-right font-mono">${calcTotal(inv.line_items, inv.tax_rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                  <td className="text-[var(--muted)] font-mono text-xs">{inv.due_date || "—"}</td>
                  <td className="text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(inv)} className="text-[var(--ink-2)] hover:text-[var(--ink)]"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => remove(inv.id)} className="text-[var(--muted)] hover:text-[#7a3a23]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[var(--ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-[var(--line)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{editing ? "Edit invoice" : "New invoice"}</p>
                <h3 className="font-display text-3xl text-[var(--ink)] mt-1">{editing ? `Invoice ${editing.invoice_number || ""}` : "Invoice details"}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Invoice #</label><input className="dash-input" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} placeholder="INV-001" /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Status</label>
                  <select className="dash-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Client *</label><input data-testid={DASH.invoicesFormClient} className="dash-input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Project</label><input className="dash-input" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} /></div>
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Due date</label><input type="date" className="dash-input" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
              </div>

              {/* Line items */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Line items</label>
                  <button type="button" onClick={addLine} className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)]">+ Add line</button>
                </div>
                <div className="space-y-2">
                  {form.line_items.map((li, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-end">
                      <input className="dash-input text-sm" placeholder="Description" value={li.description} onChange={(e) => updateLine(idx, "description", e.target.value)} />
                      <input className="dash-input text-sm" type="number" placeholder="Qty" value={li.quantity} onChange={(e) => updateLine(idx, "quantity", e.target.value)} />
                      <input className="dash-input text-sm" type="number" placeholder="Rate" value={li.rate} onChange={(e) => updateLine(idx, "rate", e.target.value)} />
                      {form.line_items.length > 1 && (
                        <button type="button" onClick={() => removeLine(idx)} className="text-[var(--muted)] hover:text-[#7a3a23] h-10 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Tax rate (%)</label><input type="number" className="dash-input" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} /></div>
                <div className="dash-card p-3 mt-1">
                  <div className="flex justify-between text-xs text-[var(--muted)]"><span>Subtotal</span><span className="font-mono">${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1"><span>Tax</span><span className="font-mono">${tax.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm font-medium text-[var(--ink)] mt-1 pt-1 border-t border-[var(--line)]"><span>Total</span><span className="font-mono">${total.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Notes</label><textarea rows={2} className="dash-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="pt-3 flex gap-2">
                <button data-testid={DASH.invoicesFormSubmit} type="submit" className="dash-btn flex-1">{editing ? "Save changes" : "Create invoice"}</button>
                <button type="button" onClick={() => setOpen(false)} className="dash-btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

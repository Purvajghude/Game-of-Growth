import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArrowUpRight, Activity, Users, DollarSign, CalendarDays, Sparkles, TrendingUp, FolderKanban, Receipt, CheckSquare, FileText, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const ACTIVITY = [
  { time: "2m ago", text: "New lead captured — Mira Castell (Atlas Labs)", type: "lead" },
  { time: "18m ago", text: "Deal 'Northwind Rebrand' moved to Proposal", type: "pipeline" },
  { time: "1h ago", text: "Invoice INV-014 marked as Paid ($8,400)", type: "invoice" },
  { time: "2h ago", text: "Task 'Finalize brand deck' completed by Jonas", type: "task" },
  { time: "3h ago", text: "Content published: Instagram — Q3 Campaign Hero", type: "content" },
  { time: "5h ago", text: "Project 'Maven Studio — Web' moved to Review", type: "project" },
  { time: "1d ago", text: "New note pinned: 'Client positioning framework'", type: "note" },
  { time: "1d ago", text: "Lead status changed — Devon Park → Qualified", type: "lead" },
];

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, l] = await Promise.all([api.stats(), api.listLeads()]);
        setStats(s); setLeads(l);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const topCards = [
    { label: "Pipeline Value", value: stats ? `$${(stats.pipeline_value_total || 0).toLocaleString()}` : "—", icon: DollarSign, to: "/dashboard/pipeline" },
    { label: "Total Leads", value: stats?.total_leads ?? "—", icon: Users, to: "/dashboard/crm" },
    { label: "Active Projects", value: stats?.project_count ?? "—", icon: FolderKanban, to: "/dashboard/projects" },
    { label: "Open Tasks", value: stats?.task_count ?? "—", icon: CheckSquare, to: "/dashboard/tasks" },
  ];

  const revenueCards = [
    { label: "Total Invoiced", value: stats ? `$${(stats.invoice_total || 0).toLocaleString()}` : "—" },
    { label: "Paid", value: stats ? `$${(stats.invoice_paid || 0).toLocaleString()}` : "—" },
    { label: "Outstanding", value: stats ? `$${(stats.invoice_outstanding || 0).toLocaleString()}` : "—" },
    { label: "Overdue", value: stats ? `$${(stats.invoice_overdue || 0).toLocaleString()}` : "—" },
  ];

  const quickActions = [
    { label: "New Project", to: "/dashboard/projects", icon: FolderKanban },
    { label: "Create Invoice", to: "/dashboard/invoices", icon: Receipt },
    { label: "Add Task", to: "/dashboard/tasks", icon: CheckSquare },
    { label: "Write Note", to: "/dashboard/notes", icon: FileText },
    { label: "AI Generate", to: "/dashboard/ai-generator", icon: Sparkles },
    { label: "Schedule Content", to: "/dashboard/calendar", icon: CalendarDays },
  ];

  const trendData = Array.from({ length: 14 }).map((_, i) => ({ d: i, v: 10 + Math.sin(i / 2) * 8 + i * 1.4 }));

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="dash-card p-6 lg:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Welcome back</p>
          <h2 className="font-display mt-1" style={{ fontSize: "clamp(32px, 4vw, 56px)", fontVariationSettings: "'opsz' 144, 'SOFT' 30", color: "var(--ink)" }}>
            Let's ship something <em style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>great</em> today.
          </h2>
          <p className="text-[var(--muted)] mt-2 max-w-xl text-[15px]">Your creative agency operating system at a glance. Manage leads, projects, invoices, tasks — everything in one place.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/crm" className="dash-btn">Add a Lead <ArrowUpRight className="w-3.5 h-3.5 inline -mt-0.5" /></Link>
          <Link to="/dashboard/ai-generator" className="dash-btn-ghost flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Generate</Link>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topCards.map((c) => (
          <Link key={c.label} to={c.to} className="dash-card p-5 group hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{c.label}</p>
                <p className="font-display mt-2" style={{ fontSize: 36, fontVariationSettings: "'opsz' 144, 'SOFT' 30", color: "var(--ink)" }}>{loading ? "…" : c.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg border border-[var(--line-2)] bg-[var(--paper-2)] flex items-center justify-center group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors">
                <c.icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="dash-card p-5">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)] mb-3">Quick actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 rounded-lg border border-[var(--line)] p-3 hover:bg-[var(--paper-2)] transition text-center">
              <a.icon className="w-5 h-5 text-[var(--ink)]" strokeWidth={1.5} />
              <span className="text-xs text-[var(--ink-2)]">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Lead momentum chart */}
        <div className="dash-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Lead momentum</p>
            <span className="text-[var(--ink-2)] text-xs font-mono"><TrendingUp className="w-3 h-3 inline" /> live</span>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gAreaInk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14130f" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#14130f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#14130f" strokeWidth={1.5} fill="url(#gAreaInk)" />
                <XAxis dataKey="d" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e2da", borderRadius: 8, color: "#14130f" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline by stage */}
        <div className="dash-card p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Pipeline by stage</p>
          <div className="mt-4 space-y-3">
            {["discovery","proposal","negotiation","won","lost"].map((s) => {
              const v = stats?.pipeline_value_by_stage?.[s] || 0;
              const max = Math.max(1, ...Object.values(stats?.pipeline_value_by_stage || { x: 1 }));
              const pct = Math.min(100, (v / max) * 100);
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs text-[var(--ink-2)] mb-1">
                    <span className="capitalize">{s}</span>
                    <span className="font-mono">${v.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--paper-2)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--ink)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue snapshot */}
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Revenue snapshot</p>
            <Link to="/dashboard/invoices" className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)]">All invoices →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {revenueCards.map((c) => (
              <div key={c.label} className="border border-[var(--line)] rounded-lg p-3">
                <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">{c.label}</p>
                <p className="font-display mt-1" style={{ fontSize: 24, fontVariationSettings: "'opsz' 144, 'SOFT' 30", color: "var(--ink)" }}>{loading ? "…" : c.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="dash-card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Recent activity</p>
            <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted)]"><Clock className="w-3 h-3" /> Live feed</span>
          </div>
          <div className="space-y-0 divide-y divide-[var(--line)]">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="py-2.5 flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--ink-2)] leading-snug">{a.text}</p>
                  <p className="font-mono text-[10px] text-[var(--muted)] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Recent Leads</p>
          <Link to="/dashboard/crm" className="text-xs text-[var(--ink-2)] hover:text-[var(--ink)]">View all →</Link>
        </div>
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display" style={{ fontSize: 32, fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>No leads yet.</p>
            <p className="text-[var(--muted)] text-sm mt-1">Your leads will appear here. Add one to get started.</p>
            <Link to="/dashboard/crm" className="dash-btn inline-block mt-5">+ Add your first lead</Link>
          </div>
        ) : (
          <table className="tbl">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Status</th><th className="text-right">Value</th></tr></thead>
            <tbody>
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id}>
                  <td className="font-medium">{l.name}</td>
                  <td className="text-[var(--ink-2)]">{l.email}</td>
                  <td className="text-[var(--ink-2)]">{l.company || "—"}</td>
                  <td><span className={`badge ${badgeStyle(l.status)}`}>{l.status}</span></td>
                  <td className="text-right font-mono">${(l.value || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function badgeStyle(s) {
  switch (s) {
    case "new":        return "bg-[var(--paper-2)] text-[var(--ink-2)] border border-[var(--line)]";
    case "contacted":  return "bg-[#e9e3d8] text-[#5b4d2e]";
    case "qualified":  return "bg-[#e6dec6] text-[#6b5a1e]";
    case "won":        return "bg-[var(--ink)] text-[var(--paper)]";
    case "lost":       return "bg-[#f0d9d0] text-[#7a3a23]";
    default:           return "bg-[var(--paper-2)] text-[var(--ink-2)]";
  }
}

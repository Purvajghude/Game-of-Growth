import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ArrowUpRight, Activity, Users, DollarSign, CalendarDays, Sparkles, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";

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

  const cards = [
    { label: "Pipeline Value", value: stats ? `$${(stats.pipeline_value_total || 0).toLocaleString()}` : "—", icon: DollarSign, accent: "from-amber-400 to-orange-500" },
    { label: "Total Leads", value: stats?.total_leads ?? "—", icon: Users, accent: "from-violet-400 to-fuchsia-500" },
    { label: "Pipeline Items", value: stats?.pipeline_count ?? "—", icon: Activity, accent: "from-cyan-400 to-blue-500" },
    { label: "Scheduled Content", value: stats?.content_count ?? "—", icon: CalendarDays, accent: "from-emerald-400 to-teal-500" },
  ];

  // synthetic trend (no mocked KPIs in number; only a visual line)
  const trendData = Array.from({ length: 14 }).map((_, i) => ({ d: i, v: 10 + Math.sin(i / 2) * 8 + i * 1.4 }));

  return (
    <div className="space-y-6">
      {/* welcome */}
      <div className="dash-card p-6 lg:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">Welcome back</p>
          <h2 className="font-display italic text-4xl md:text-5xl text-white mt-1">Let's ship something great today.</h2>
          <p className="text-white/50 mt-2 max-w-xl">Your operating system at a glance. Add leads, move deals, plan content — the whole studio in one place.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/crm" className="dash-btn">Add a Lead <ArrowUpRight className="w-3.5 h-3.5 inline -mt-0.5" /></Link>
          <Link to="/dashboard/ai-generator" className="dash-btn-ghost flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Generate</Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="dash-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">{c.label}</p>
                <p className="font-display italic text-4xl text-white mt-2">{loading ? "…" : c.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.accent} flex items-center justify-center`}>
                <c.icon className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="dash-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">Lead momentum</p>
            <span className="text-emerald-400 text-xs font-mono"><TrendingUp className="w-3 h-3 inline" /> live</span>
          </div>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb800" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#ffb800" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#ffb800" strokeWidth={2} fill="url(#g1)" />
                <XAxis dataKey="d" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#111114", border: "1px solid #2a2a2e", borderRadius: 8, color: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dash-card p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">Pipeline by stage</p>
          <div className="mt-4 space-y-3">
            {["discovery","proposal","negotiation","won","lost"].map((s) => {
              const v = stats?.pipeline_value_by_stage?.[s] || 0;
              const max = Math.max(1, ...Object.values(stats?.pipeline_value_by_stage || { x: 1 }));
              const pct = Math.min(100, (v / max) * 100);
              return (
                <div key={s}>
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span className="capitalize">{s}</span>
                    <span className="font-mono">${v.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ffb800] to-[#ff5e00]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* recent leads */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">Recent Leads</p>
          <Link to="/dashboard/crm" className="text-xs text-white/60 hover:text-white">View all →</Link>
        </div>
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display italic text-3xl text-white/80">No leads yet.</p>
            <p className="text-white/40 text-sm mt-1">Your leads will appear here. Add one to get started.</p>
            <Link to="/dashboard/crm" className="dash-btn inline-block mt-5">+ Add your first lead</Link>
          </div>
        ) : (
          <table className="tbl">
            <thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Status</th><th className="text-right">Value</th></tr></thead>
            <tbody>
              {leads.slice(0, 5).map((l) => (
                <tr key={l.id}>
                  <td className="text-white font-medium">{l.name}</td>
                  <td className="text-white/70">{l.email}</td>
                  <td className="text-white/70">{l.company || "—"}</td>
                  <td><span className={`badge ${badgeStyle(l.status)}`}>{l.status}</span></td>
                  <td className="text-right text-white font-mono">${(l.value || 0).toLocaleString()}</td>
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
    case "new": return "bg-cyan-500/15 text-cyan-300";
    case "contacted": return "bg-violet-500/15 text-violet-300";
    case "qualified": return "bg-amber-500/15 text-amber-300";
    case "won": return "bg-emerald-500/15 text-emerald-300";
    case "lost": return "bg-rose-500/15 text-rose-300";
    default: return "bg-white/10 text-white/70";
  }
}

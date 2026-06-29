import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, CalendarDays, Sparkles, Settings as SettingsIcon, ArrowLeft, Bell, Search } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { useEffect } from "react";

const NAV = [
  { to: "/dashboard",              label: "Overview",      icon: LayoutDashboard, end: true, testId: DASH.navOverview },
  { to: "/dashboard/crm",          label: "Lead CRM",      icon: Users,           testId: DASH.navCrm },
  { to: "/dashboard/pipeline",     label: "Pipeline",      icon: Kanban,          testId: DASH.navPipeline },
  { to: "/dashboard/calendar",     label: "Content",       icon: CalendarDays,    testId: DASH.navCalendar },
  { to: "/dashboard/ai-generator", label: "AI Generator",  icon: Sparkles,        testId: DASH.navAi },
  { to: "/dashboard/settings",     label: "Settings",      icon: SettingsIcon,    testId: DASH.navSettings },
];

export default function DashboardLayout() {
  const loc = useLocation();
  useEffect(() => {
    document.body.classList.add('dashboard-root');
    document.documentElement.classList.add('dashboard-root');
    return () => {
      document.body.classList.remove('dashboard-root');
      document.documentElement.classList.remove('dashboard-root');
    };
  }, []);

  const titleMap = {
    "/dashboard": "Overview",
    "/dashboard/crm": "Lead CRM",
    "/dashboard/pipeline": "Pipeline",
    "/dashboard/calendar": "Content Calendar",
    "/dashboard/ai-generator": "AI Content Generator",
    "/dashboard/settings": "Settings",
  };
  const title = titleMap[loc.pathname] || "Dashboard";

  return (
    <div data-testid={DASH.layout} className="dashboard-root dash-root min-h-screen flex" style={{ cursor: 'auto' }}>
      <aside data-testid={DASH.sideNav} className="dash-side w-[240px] shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[var(--ink)] flex items-center justify-center">
              <span className="font-display italic text-[var(--paper)] text-[12px] leading-none mt-[1px]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>g</span>
            </div>
            <span className="font-sans font-medium text-[13.5px] text-[var(--ink)]">GoG · OS</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={n.testId}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                  isActive ? "bg-white text-[var(--ink)] border border-[var(--line)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]" : "text-[var(--ink-2)] hover:bg-white/60"
                }`
              }
            >
              <n.icon className="w-4 h-4" strokeWidth={1.5} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--line)]">
          <Link to="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)] text-[12px] px-3 py-2 transition">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--paper)]/85 border-b border-[var(--line)]">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Dashboard</p>
              <h1 className="font-display text-2xl text-[var(--ink)] -mt-0.5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white border border-[var(--line)] rounded-lg px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
                <input className="bg-transparent outline-none text-sm text-[var(--ink)] placeholder:text-[var(--muted)] w-48" placeholder="Search anything" />
                <span className="font-mono text-[10px] text-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--line)]">⌘K</span>
              </div>
              <button className="w-9 h-9 rounded-lg border border-[var(--line)] bg-white flex items-center justify-center hover:bg-[var(--paper-2)] transition">
                <Bell className="w-4 h-4 text-[var(--ink-2)]" strokeWidth={1.5} />
              </button>
              <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] font-medium text-sm">F</div>
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

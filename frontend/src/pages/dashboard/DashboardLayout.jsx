import { NavLink, Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, CalendarDays, Sparkles, Settings as SettingsIcon, ArrowLeft, Bell, Search, FolderKanban, Receipt, CheckSquare, FileText, FileSignature, CalendarClock, LogOut, Radar } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { useEffect } from "react";
import { auth } from "@/lib/auth";

const NAV_SELL = [
  { to: "/dashboard/prospector", label: "AI Auditor", icon: Radar,         testId: "dash-nav-prospector" },
  { to: "/dashboard/crm",       label: "Lead CRM",   icon: Users,         testId: DASH.navCrm },
  { to: "/dashboard/followups", label: "Follow-ups", icon: CalendarClock, testId: "dash-nav-followups" },
  { to: "/dashboard/proposals", label: "Proposals",  icon: FileSignature, testId: "dash-nav-proposals" },
  { to: "/dashboard/pipeline",  label: "Pipeline",   icon: Kanban,        testId: DASH.navPipeline },
];

const NAV_WORK = [
  { to: "/dashboard",          label: "Overview",      icon: LayoutDashboard, end: true, testId: DASH.navOverview },
  { to: "/dashboard/projects", label: "Projects",      icon: FolderKanban,    testId: DASH.navProjects },
  { to: "/dashboard/tasks",    label: "Team Tasks",    icon: CheckSquare,     testId: DASH.navTasks },
];

const NAV_OPS = [
  { to: "/dashboard/calendar",     label: "Content",       icon: CalendarDays,    testId: DASH.navCalendar },
  { to: "/dashboard/notes",        label: "Notes",         icon: FileText,        testId: DASH.navNotes },
  { to: "/dashboard/ai-generator", label: "AI Generator",  icon: Sparkles,        testId: DASH.navAi },
  { to: "/dashboard/invoices",     label: "Invoices",      icon: Receipt,         testId: DASH.navInvoices },
];

export default function DashboardLayout() {
  const loc = useLocation();
  const navigate = useNavigate();
  const user = auth.getUser();
  const signOut = () => {
    auth.clear();
    navigate("/login", { replace: true });
  };
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
    "/dashboard/projects": "Projects",
    "/dashboard/pipeline": "Pipeline",
    "/dashboard/prospector": "AI Business Auditor",
    "/dashboard/followups": "Follow-ups",
    "/dashboard/proposals": "Proposals",
    "/dashboard/crm": "Lead CRM",
    "/dashboard/tasks": "Team Tasks",
    "/dashboard/calendar": "Content Calendar",
    "/dashboard/notes": "Notes",
    "/dashboard/ai-generator": "AI Content Generator",
    "/dashboard/invoices": "Invoices",
    "/dashboard/settings": "Settings",
  };
  const title = titleMap[loc.pathname] || "Dashboard";

  return (
    <div data-testid={DASH.layout} className="dashboard-root dash-root min-h-screen flex" style={{ cursor: 'auto' }}>
      <aside data-testid={DASH.sideNav} className="dash-side w-[240px] shrink-0 hidden md:flex flex-col h-[100dvh] sticky top-0 overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[var(--ink)] flex items-center justify-center">
              <span className="font-display italic text-[var(--paper)] text-[12px] leading-none mt-[1px]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>g</span>
            </div>
            <span className="font-sans font-medium text-[13.5px] text-[var(--ink)]">GoG · OS</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 space-y-6 pb-6">
          {/* Work Section */}
          <div>
            <p className="px-3 mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Work</p>
            <div className="space-y-0.5">
              {NAV_WORK.map((n) => (
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
            </div>
          </div>

          {/* Sell Section */}
          <div>
            <p className="px-3 mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Sell</p>
            <div className="space-y-0.5">
              {NAV_SELL.map((n) => (
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
            </div>
          </div>

          {/* Operations Section */}
          <div>
            <p className="px-3 mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Operations</p>
            <div className="space-y-0.5">
              {NAV_OPS.map((n) => (
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
            </div>
          </div>
        </nav>

        <div className="p-3 border-t border-[var(--line)] space-y-1">
          <NavLink
            to="/dashboard/settings"
            data-testid={DASH.navSettings}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                isActive ? "bg-white text-[var(--ink)] border border-[var(--line)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]" : "text-[var(--ink-2)] hover:bg-white/60"
              }`
            }
          >
            <SettingsIcon className="w-4 h-4" strokeWidth={1.5} />
            Settings
          </NavLink>
          <Link to="/" className="flex items-center gap-3 text-[var(--muted)] hover:text-[var(--ink)] text-[13px] px-3 py-2 transition">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
          <button
            onClick={signOut}
            data-testid="dash-sign-out"
            className="w-full flex items-center gap-3 text-[var(--muted)] hover:text-[var(--ink)] text-[13px] px-3 py-2 transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
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
              <div
                className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-[var(--paper)] font-medium text-sm uppercase"
                title={user?.username || "Team"}
              >
                {(user?.username || "G").slice(0, 1)}
              </div>
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

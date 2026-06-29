import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Users, Kanban, CalendarDays, Sparkles, Settings as SettingsIcon, ArrowLeft, Bell, Search } from "lucide-react";
import { DASH } from "@/constants/testIds";
import { useEffect } from "react";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true, testId: DASH.navOverview },
  { to: "/dashboard/crm", label: "Lead CRM", icon: Users, testId: DASH.navCrm },
  { to: "/dashboard/pipeline", label: "Pipeline", icon: Kanban, testId: DASH.navPipeline },
  { to: "/dashboard/calendar", label: "Content", icon: CalendarDays, testId: DASH.navCalendar },
  { to: "/dashboard/ai-generator", label: "AI Generator", icon: Sparkles, testId: DASH.navAi },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon, testId: DASH.navSettings },
];

export default function DashboardLayout() {
  const loc = useLocation();
  // ensure body class for cursor reset and no overflow lock
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
    <div data-testid={DASH.layout} className="dashboard-root min-h-screen dash-bg flex" style={{ cursor: 'auto' }}>
      {/* sidebar */}
      <aside data-testid={DASH.sideNav} className="dash-side w-[240px] shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffb800] to-[#ff5e00] flex items-center justify-center">
              <span className="font-display italic text-black text-sm leading-none mt-0.5">g</span>
            </div>
            <span className="font-sans font-medium text-[14px] text-white">GoG · OS</span>
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition ${
                  isActive ? "bg-white/[0.06] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                }`
              }
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white text-[12px] px-3 py-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* topbar */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0a0a0b]/80 border-b border-white/5">
          <div className="flex items-center justify-between px-6 lg:px-8 h-16">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">Dashboard</p>
              <h1 className="font-display italic text-2xl text-white -mt-0.5">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-white/40" />
                <input className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-48" placeholder="Search anything" />
                <span className="font-mono text-[10px] text-white/40 px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
              </div>
              <button className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5">
                <Bell className="w-4 h-4 text-white/70" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffb800] to-[#ff5e00] flex items-center justify-center text-black font-semibold text-sm">F</div>
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

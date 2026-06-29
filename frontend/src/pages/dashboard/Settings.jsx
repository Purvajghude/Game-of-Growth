import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Founder", email: "founder@gameofgrowth.studio", org: "Game of Growth Studio" });
  const [prefs, setPrefs] = useState({ notifications: true, weeklyReview: true, beta: false });

  const save = (e) => { e.preventDefault(); toast.success("Settings saved"); };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="dash-card p-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Profile</p>
        <h2 className="font-display text-3xl text-[var(--ink)] mt-1">Your account</h2>
        <form onSubmit={save} className="mt-5 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Name</label><input className="dash-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Email</label><input className="dash-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          </div>
          <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Organization</label><input className="dash-input" value={profile.org} onChange={(e) => setProfile({ ...profile, org: e.target.value })} /></div>
          <button type="submit" className="dash-btn justify-self-start">Save changes</button>
        </form>
      </div>

      <div className="dash-card p-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Preferences</p>
        <h2 className="font-display text-3xl text-[var(--ink)] mt-1">How the OS behaves</h2>
        <div className="mt-5 divide-y divide-white/5">
          {[
            { k: "notifications", t: "Lead notifications", d: "Get notified when a new lead lands." },
            { k: "weeklyReview", t: "Weekly review digest", d: "A Monday morning report on pipeline, content and ops." },
            { k: "beta", t: "Beta features", d: "Try new modules before they ship to everyone." },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between py-4">
              <div>
                <p className="text-[var(--ink)] text-sm">{row.t}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{row.d}</p>
              </div>
              <button onClick={() => setPrefs({ ...prefs, [row.k]: !prefs[row.k] })} className={`w-11 h-6 rounded-full transition relative ${prefs[row.k] ? "bg-[var(--ink)]" : "bg-[var(--paper-3)]"}`}>
                <span className={`absolute top-0.5 ${prefs[row.k] ? "left-6" : "left-0.5"} w-5 h-5 rounded-full bg-white transition-all`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-card p-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Future modules</p>
        <h2 className="font-display text-3xl text-[var(--ink)] mt-1">Coming next</h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-[var(--ink-2)]">
          {["Client Portals","Proposal Generator","Appointment Scheduler","Revenue Analytics","Expense Tracker","Team Tasks","SOP Library","Asset Library","Notes","Meeting Summaries","Digital Products Mgmt","Google OAuth"].map((m) => (
            <li key={m} className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" /> {m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

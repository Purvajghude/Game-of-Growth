import { useState } from "react";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Plus, X } from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Founder", email: "founder@gameofgrowth.studio", org: "Game of Growth Studio" });
  const [billing, setBilling] = useState({ address: "123 Creative Ave, NY", taxId: "TAX-12345", defaultTaxRate: 10 });
  const [prefs, setPrefs] = useState({ notifications: true, weeklyReview: true, beta: false });
  
  const [team, setTeam] = useState(["Alice (Strategy)", "Bob (Design)", "Charlie (Dev)"]);
  const [newTeamMember, setNewTeamMember] = useState("");
  
  const [projectTypes, setProjectTypes] = useState(["Brand", "Web", "Motion", "Strategy", "Content"]);
  const [newProjectType, setNewProjectType] = useState("");

  const save = (e) => { e.preventDefault(); toast.success("Settings saved"); };

  const addTeamMember = () => {
    if (newTeamMember.trim()) {
      setTeam([...team, newTeamMember.trim()]);
      setNewTeamMember("");
    }
  };

  const addProjectType = () => {
    if (newProjectType.trim()) {
      setProjectTypes([...projectTypes, newProjectType.trim()]);
      setNewProjectType("");
    }
  };

  const removeTeamMember = (index) => setTeam(team.filter((_, i) => i !== index));
  const removeProjectType = (index) => setProjectTypes(projectTypes.filter((_, i) => i !== index));

  const handleExport = () => {
    toast.success("Export started. Check your email shortly.");
  };

  const handleReset = () => {
    if (window.confirm("Are you absolutely sure? This will delete ALL data (leads, projects, tasks) and cannot be undone.")) {
      if (window.prompt("Type 'DELETE' to confirm") === "DELETE") {
        toast.error("Data wipe initiated. This is irreversible.");
        // In reality, this would call api.wipeAllData()
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Workspace Settings</p>
          <h2 className="font-display text-4xl text-[var(--ink)] mt-1">Configure your OS</h2>
        </div>
        <button onClick={save} className="dash-btn">Save all changes</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="dash-card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Profile & Agency</p>
          <form className="mt-5 grid gap-4">
            <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Agency Name</label><input className="dash-input" value={profile.org} onChange={(e) => setProfile({ ...profile, org: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Your Name</label><input className="dash-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Email</label><input className="dash-input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            </div>
          </form>
        </div>

        {/* Billing */}
        <div className="dash-card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Billing defaults</p>
          <form className="mt-5 grid gap-4">
            <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Billing Address</label><textarea rows={2} className="dash-input" value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Tax ID / VAT</label><input className="dash-input" value={billing.taxId} onChange={(e) => setBilling({ ...billing, taxId: e.target.value })} /></div>
              <div className="grid gap-1"><label className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">Default Tax Rate (%)</label><input type="number" className="dash-input" value={billing.defaultTaxRate} onChange={(e) => setBilling({ ...billing, defaultTaxRate: e.target.value })} /></div>
            </div>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Team Management */}
        <div className="dash-card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Team Management</p>
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              <input className="dash-input flex-1" placeholder="Add team member (e.g. Sarah - Dev)" value={newTeamMember} onChange={(e) => setNewTeamMember(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTeamMember()} />
              <button onClick={addTeamMember} className="dash-btn-ghost px-3"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {team.map((member, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-[var(--paper-2)] border border-[var(--line)] rounded-full pl-3 pr-1 py-1 text-sm text-[var(--ink)]">
                  {member}
                  <button onClick={() => removeTeamMember(idx)} className="w-5 h-5 rounded-full hover:bg-[var(--line)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {team.length === 0 && <span className="text-sm text-[var(--muted)]">No team members added.</span>}
            </div>
          </div>
        </div>

        {/* Project Types */}
        <div className="dash-card p-6">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Project Types</p>
          <div className="mt-5 space-y-4">
            <div className="flex gap-2">
              <input className="dash-input flex-1" placeholder="Add project type (e.g. SEO Audit)" value={newProjectType} onChange={(e) => setNewProjectType(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProjectType()} />
              <button onClick={addProjectType} className="dash-btn-ghost px-3"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {projectTypes.map((type, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-[var(--paper-2)] border border-[var(--line)] rounded-full pl-3 pr-1 py-1 text-sm text-[var(--ink)]">
                  {type}
                  <button onClick={() => removeProjectType(idx)} className="w-5 h-5 rounded-full hover:bg-[var(--line)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card p-6">
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--muted)]">Preferences</p>
        <div className="mt-5 divide-y divide-[var(--line)]">
          {[
            { k: "notifications", t: "Lead notifications", d: "Get notified when a new lead lands." },
            { k: "weeklyReview", t: "Weekly review digest", d: "A Monday morning report on pipeline, content and ops." },
            { k: "beta", t: "Beta features", d: "Try new modules before they ship to everyone." },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between py-4">
              <div>
                <p className="text-[var(--ink)] text-sm font-medium">{row.t}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{row.d}</p>
              </div>
              <button onClick={() => setPrefs({ ...prefs, [row.k]: !prefs[row.k] })} className={`w-11 h-6 rounded-full transition relative ${prefs[row.k] ? "bg-[var(--ink)]" : "bg-[var(--line)]"}`}>
                <span className={`absolute top-0.5 ${prefs[row.k] ? "left-6" : "left-0.5"} w-5 h-5 rounded-full bg-white transition-all shadow-sm`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-card p-6 border-red-100 bg-red-50/30">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <p className="font-mono text-[10px] tracking-widest uppercase text-red-500 font-bold">Danger Zone</p>
        </div>
        <p className="text-sm text-[var(--ink-2)] mb-5">Destructive actions and data portability.</p>
        
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExport} className="dash-btn-ghost bg-white border-red-200 text-red-700 hover:bg-red-50">Export all data (JSON)</button>
          <button onClick={handleReset} className="dash-btn bg-red-600 hover:bg-red-700 text-white border-transparent">Factory Reset Workspace</button>
        </div>
      </div>
    </div>
  );
}

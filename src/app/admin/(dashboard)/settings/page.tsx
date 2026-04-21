"use client";

import { User, Lock, Bell, Palette, Globe, Save, Upload, Shield, Key, Monitor, Mail, Smartphone, MessageSquare, Zap, Link2, CreditCard, RefreshCw, Users, Terminal, Activity, ChevronRight, Check, AlertTriangle, Clock, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [accentColor, setAccentColor] = useState("purple");
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, logsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/settings?t=${Date.now()}`),
          fetch(`http://localhost:5000/api/logs?t=${Date.now()}`)
        ]);
        
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSiteSettings(settingsData.settings);
        }
        
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setLogs(logsData.logs || []);
        }
      } catch (err) {
        console.error("Failed to fetch system data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const colors: Record<string, string> = {
      purple: "#8C4199",
      blue: "#3b82f6",
      emerald: "#10b981",
      rose: "#f43f5e",
      amber: "#f59e0b",
      monochrome: "#a3a3a3"
    };

    if (colors[accentColor]) {
      root.style.setProperty("--color-brand-accent", colors[accentColor]);
    }
  }, [accentColor]);

  const navItems = [
    { id: "profile", label: "Identity Matrix", icon: User },
    { id: "security", label: "Encrypted Core", icon: Lock },
    { id: "team", label: "Tactical Team", icon: Users },
    { id: "api", label: "Data Pipeline", icon: Terminal },
    { id: "billing", label: "Credit & Compute", icon: CreditCard },
    { id: "database", label: "Storage Engine", icon: RefreshCw },
    { id: "site", label: "Domain Map", icon: Globe },
    { id: "logs", label: "Audit Flux", icon: Activity },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">System Architecture</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
             <Shield size={12} className="text-emerald-500" /> Admin Controller v9.42 / Secure Node
          </p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Online</span>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[700px] animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* Deep Nav Sidebar */}
        <div className="w-full lg:w-80 bg-slate-50/50 dark:bg-white/5 border-r border-slate-200 dark:border-white/10 p-8 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 pl-2">Controller Modules</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
               <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between group px-5 py-4 rounded-[20px] transition-all duration-300 ${activeTab === item.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-[1.02]' : 'text-slate-500 hover:bg-white dark:hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-4">
                   <item.icon size={20} className={activeTab === item.id ? '' : 'group-hover:rotate-12 transition-transform'} />
                   <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>

          <div className="mt-20 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[30px] text-white overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={40} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Compute Plan</p>
             <h4 className="text-2xl font-black italic tracking-tighter mt-1">ULTRA NODE</h4>
             <button className="mt-4 w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all">Optimize Flow</button>
          </div>
        </div>

        {/* Dynamic Content Core */}
        <div className="flex-1 p-8 lg:p-14 overflow-y-auto">
          
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
              <div className="mb-12 flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[40px] bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-5xl font-black italic overflow-hidden shadow-2xl group-hover:border-brand-accent transition-colors">
                    {siteSettings.admin_avatar_url ? (
                      <img src={siteSettings.admin_avatar_url} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <span className="bg-gradient-to-br from-slate-400 to-slate-600 bg-clip-text text-transparent">AD</span>
                    )}
                  </div>
                  <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-white dark:bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-black shadow-lg hover:scale-110 active:scale-95 transition-all">
                     <Upload size={16} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">{siteSettings.admin_first_name || "Nexus"} {siteSettings.admin_last_name || "Admin"}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Authorized Controller / Level 4 Security</p>
                  <div className="flex gap-2 mt-4">
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Verified Identity</span>
                  </div>
                </div>
              </div>

              <form className="space-y-8" onSubmit={async (e) => {
                e.preventDefault();
                setIsSaving(true);
                const formData = new FormData(e.currentTarget);
                const settings = {
                  admin_first_name: formData.get("admin_first_name"),
                  admin_last_name: formData.get("admin_last_name"),
                  admin_display_email: formData.get("admin_display_email"),
                  admin_avatar_url: formData.get("admin_avatar_url"),
                };
                try {
                  const res = await fetch("http://localhost:5000/api/settings", {
                    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
                  });
                  if (res.ok) {
                    setSiteSettings({...siteSettings, ...settings});
                    alert("Identity Matrix Synchronized");
                  }
                } catch (err) { console.error(err); }
                setIsSaving(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</label>
                     <input name="admin_first_name" type="text" defaultValue={siteSettings.admin_first_name} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</label>
                     <input name="admin_last_name" type="text" defaultValue={siteSettings.admin_last_name} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Access Email</label>
                   <input name="admin_display_email" type="email" defaultValue={siteSettings.admin_display_email} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Asset Signature (URL)</label>
                   <input name="admin_avatar_url" type="url" defaultValue={siteSettings.admin_avatar_url} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div className="pt-10 flex justify-end">
                   <button disabled={isSaving} className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                      {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} 
                      {isSaving ? "Syncing..." : "Sync Identity"}
                   </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "team" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Tactical Team</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage sub-administrators and field agents.</p>
                  </div>
                  <button className="px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                     <Plus size={16} /> Deploy New Agent
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "John Doe", role: "Design Lead", icon: "J" },
                    { name: "Sarah Smith", role: "SEO Auditor", icon: "S" },
                    { name: "Mike Rivas", role: "DevOps", icon: "M" },
                  ].map((agent, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[32px] flex items-center justify-between group hover:border-blue-500 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black text-xl italic">{agent.icon}</div>
                          <div>
                            <h4 className="font-black text-lg uppercase leading-none">{agent.name}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{agent.role}</p>
                          </div>
                       </div>
                       <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Data Pipelines</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage external API integrations and secure tokens.</p>
               </div>

               <div className="space-y-6">
                  {[
                    { name: "Google Search Console", key: "GSC_AUTH_PROX_8429...", expiry: "Never" },
                    { name: "Facebook Pixel API", key: "FB_PIXEL_SECURE_TOKEN...", expiry: "Sep 2026" },
                    { name: "Neon Cloud SQL", key: "DATABASE_URL_SSL_REQUIRED...", expiry: "Indefinite" },
                  ].map((api, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm relative overflow-hidden group">
                       <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-black uppercase italic italic">{api.name}</h4>
                          <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
                       </div>
                       <div className="p-4 bg-slate-50 dark:bg-black rounded-2xl font-mono text-xs text-slate-400 border border-slate-100 dark:border-white/5 break-all">
                          {api.key}
                       </div>
                       <div className="flex justify-between items-center mt-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Expires: {api.expiry}</span>
                          <div className="flex gap-4">
                             <button className="text-[10px] font-black uppercase text-indigo-500 hover:underline">Rotate Token</button>
                             <button className="text-[10px] font-black uppercase text-red-500 hover:underline">Revoke</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none mb-10">Audit Flux</h2>
               <div className="space-y-4">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl group hover:border-indigo-500/50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`p-3 rounded-xl ${log.severity === 'Warning' ? 'bg-amber-500/10 text-amber-500' : log.severity === 'Error' ? 'bg-red-500/10 text-red-500' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                             {log.severity === 'Warning' ? <AlertTriangle size={18}/> : <Terminal size={18}/>}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight italic">{log.event_type.replace('_', ' ')}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              ACTOR: {log.actor} // DETAILS: {log.details}
                            </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                          <p className="text-[9px] font-bold text-slate-500/50 uppercase tracing-[0.2em]">{new Date(log.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl opacity-50 italic text-sm">
                      Awaiting system heartbeat... No telemetry detected in current buffer.
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">Encrypted Core</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Manage node security and access protocols.</p>

               <div className="space-y-8">
                  <div className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm">
                     <h3 className="font-black italic uppercase tracking-tighter text-xl mb-6">Access Override (Password)</h3>
                     <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        alert("Security Key Rotation Initiated. Changes will be enforced on next login.");
                     }}>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Key</label>
                           <input type="password" required placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Key Matrix</label>
                              <input type="password" required placeholder="Define new password" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Matrix</label>
                              <input type="password" required placeholder="Repeat new password" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" />
                           </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                           <button type="submit" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Update Security Key</button>
                        </div>
                     </form>
                  </div>

                  <div className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm flex items-center justify-between group">
                     <div>
                        <h3 className="font-black italic uppercase tracking-tighter text-xl flex items-center gap-2"><Key size={20} className="text-emerald-500" /> Multi-Factor Auth</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Require secondary device token for access.</p>
                     </div>
                     <button className="px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm">Enable MFA</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">Credit & Compute</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Network billing, license tiers, and resource allocation.</p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-20"><Zap size={80}/></div>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Current Allocation</p>
                     <h3 className="font-black italic uppercase tracking-tighter text-5xl">ULTRA</h3>
                     <ul className="mt-6 space-y-3">
                        <li className="text-xs font-bold uppercase flex items-center gap-2"><Check size={14} className="text-indigo-200"/> Unlimited Data Pipelines</li>
                        <li className="text-xs font-bold uppercase flex items-center gap-2"><Check size={14} className="text-indigo-200"/> 500GB Vault Storage</li>
                        <li className="text-xs font-bold uppercase flex items-center gap-2"><Check size={14} className="text-indigo-200"/> Priority Core Node</li>
                     </ul>
                  </div>
                  <div className="p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm flex flex-col justify-between group hover:border-blue-500 transition-colors">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Network Credits</p>
                        <h3 className="font-black italic uppercase tracking-tighter text-6xl text-blue-500">$4,250<span className="text-2xl">.00</span></h3>
                     </div>
                     <button className="w-full py-4 mt-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm">Add Server Credits</button>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 dark:border-white/5">
                     <h3 className="font-black italic uppercase tracking-tighter text-xl">Transaction Matrix</h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                           <tr>
                              <th className="px-6 py-5">Descriptor</th>
                              <th className="px-6 py-5">Date Epoch</th>
                              <th className="px-6 py-5">Resource Cost</th>
                              <th className="px-6 py-5 text-right">Receipt</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm font-bold">
                           <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-6 py-5 uppercase text-black dark:text-white">Ultra Node Renewal</td>
                              <td className="px-6 py-5 text-slate-400">Oct 01, 2026</td>
                              <td className="px-6 py-5 text-emerald-500">$499.00</td>
                              <td className="px-6 py-5 text-right"><button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-600">Download</button></td>
                           </tr>
                           <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-6 py-5 uppercase text-black dark:text-white">Ad Credit Injection</td>
                              <td className="px-6 py-5 text-slate-400">Sep 15, 2026</td>
                              <td className="px-6 py-5 text-emerald-500">$1,500.00</td>
                              <td className="px-6 py-5 text-right"><button className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-600">Download</button></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">Storage Engine</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Data synchronization and Neon DB cluster management.</p>

               <div className="p-10 border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] bg-slate-50 dark:bg-white/5 text-center relative overflow-hidden group hover:border-blue-500 transition-colors">
                 <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                   <RefreshCw size={40} className="text-blue-500 group-hover:animate-spin" />
                 </div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 relative z-10 text-black dark:text-white">Sync Main Cluster</h3>
                 <p className="text-slate-500 text-xs font-bold font-mono max-w-sm mx-auto mb-10 relative z-10">
                   Establish handshake with Neon PostgreSQL. Ensures all entity tables (Leads, Campaigns, Intel) are correctly populated and mapped.
                 </p>
                 <button 
                   onClick={async () => {
                     if (confirm("Initiate global cluster sync? This will inject missing core schemas.")) {
                       try {
                         const res = await fetch("http://localhost:5000/api/sync", { method: 'POST' });
                         if (res.ok) alert("SYNCHRONIZATION COMPLETE / SCHEMA VALIDATED");
                         else alert("SYNC FAILED. CHECK NODE OUTPUT.");
                       } catch (err) { console.error(err); alert("NETWORK INTERFERENCE DETECTED."); }
                     }
                   }}
                   className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center gap-3 mx-auto"
                 >
                   <Terminal size={18}/> Establish Connection
                 </button>
               </div>

               <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 border border-slate-200 dark:border-white/10 rounded-[24px] flex items-center gap-4 bg-white dark:bg-[#0f0f0f] shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Uplink</div>
                        <div className="text-sm font-black uppercase italic text-black dark:text-white">Neon TCP Active</div>
                    </div>
                  </div>
                  <div className="p-6 border border-slate-200 dark:border-white/10 rounded-[24px] flex items-center gap-4 bg-white dark:bg-[#0f0f0f] shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                       <Shield size={20} className="text-blue-500" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encryption Layer</div>
                        <div className="text-sm font-black uppercase italic text-black dark:text-white">SSL Enforced</div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "site" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
               <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none mb-2">Domain Map</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Configure brand URLs and global routing presence.</p>

               <form className="space-y-8" onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const settings = {
                   site_url: formData.get("site_url"),
                   social_facebook: formData.get("social_facebook"),
                   social_instagram: formData.get("social_instagram"),
                   social_twitter: formData.get("social_twitter"),
                   social_linkedin: formData.get("social_linkedin"),
                 };
                 try {
                   const res = await fetch("http://localhost:5000/api/settings", {
                     method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
                   });
                   if (res.ok) alert("Global nodes updated.");
                 } catch (err) { console.error(err); }
               }}>
                  <div className="space-y-4">
                     <h3 className="font-black italic uppercase tracking-tighter text-xl mb-6">External Routing Vectors</h3>
                     <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Primary Node URL (Domain)</label>
                           <input name="site_url" type="url" defaultValue={siteSettings.site_url} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="https://zyroz.agency" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Meta / Facebook Matrix</label>
                           <input name="social_facebook" type="url" defaultValue={siteSettings.social_facebook} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="https://facebook.com/your-page" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Instagram Vector</label>
                           <input name="social_instagram" type="url" defaultValue={siteSettings.social_instagram} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="https://instagram.com/your-handle" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">X (Twitter) Feed</label>
                           <input name="social_twitter" type="url" defaultValue={siteSettings.social_twitter} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="https://twitter.com/your-handle" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">LinkedIn Corporate</label>
                           <input name="social_linkedin" type="url" defaultValue={siteSettings.social_linkedin} className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[20px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="https://linkedin.com/company/your-company" />
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-8 flex justify-end">
                     <button type="submit" className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                        <Save size={16}/> Push Configuration
                     </button>
                  </div>
               </form>
            </div>
          )}

          {["notifications"].includes(activeTab) && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center h-[500px] opacity-20 italic">
                <Shield size={80} className="mb-4" />
                <p className="text-xl font-black uppercase tracking-[0.4em] text-center">Sub-Module Decrypting...</p>
                <p className="text-[10px] mt-2 font-mono uppercase tracking-widest text-center">Awaiting Command Authorization 0x429</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}

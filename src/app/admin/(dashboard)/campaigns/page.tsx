"use client";

import { Plus, Search, Megaphone, TrendingUp, Filter, Play, Pause, Trash2, Edit, Users, Camera, Briefcase, Hash, Target, Calendar, BarChart3, ChevronRight, Globe, MousePointer2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("http://localhost:5000/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const handleLaunch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      platform: formData.get("platform"),
      budget: `$${formData.get("budget")}`,
      status: formData.get("status") || "Active",
      spent: `$${formData.get("spent") || "0"}`,
      clicks: parseInt(formData.get("clicks") as string) || 0,
      conversions: parseInt(formData.get("conversions") as string) || 0,
      roi: `${formData.get("roi") || "0"}%`,
      start_date: formData.get("startDate"),
      end_date: formData.get("endDate"),
      audience: formData.get("audience")
    };

    try {
      if (editingCampaign) {
        const res = await fetch(`http://localhost:5000/api/campaigns/${editingCampaign.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const result = await res.json();
          setCampaigns(campaigns.map(c => c.id === editingCampaign.id ? result.campaign : c));
          setIsModalOpen(false);
          setEditingCampaign(null);
        }
      } else {
        const res = await fetch("http://localhost:5000/api/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const newCamp = await res.json();
          setCampaigns([newCamp, ...campaigns]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Paused" : "Active";
    try {
      const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCampaigns(campaigns.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCampaigns = campaigns.filter(camp => {
    const nameStr = camp.name || "";
    const platStr = camp.platform || "";
    const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          platStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || camp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPlatformIcon = (platform: string) => {
    switch(platform?.toLowerCase()) {
      case "google ads": return <Globe size={14} className="text-blue-500" />;
      case "meta ads": case "facebook": return <Users size={14} className="text-blue-600" />;
      case "instagram": return <Camera size={14} className="text-pink-500" />;
      case "linkedin": return <Briefcase size={14} className="text-blue-700" />;
      case "twitter": return <Hash size={14} className="text-black dark:text-white" />;
      default: return <Megaphone size={14} className="text-slate-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Active": return "bg-emerald-500/10 text-emerald-500";
      case "Paused": return "bg-amber-500/10 text-amber-500";
      case "Draft": return "bg-slate-500/10 text-slate-500";
      default: return "bg-slate-500/10 text-slate-500";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Campaign Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Orchestrate and optimize your multi-channel marketing engine.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95">
          <Plus size={20} />
          Launch New Campaign
        </button>
      </div>

      {/* KPI Stats Upgrade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-blue-500 transition-colors">
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Spend</p>
            <p className="text-3xl font-bold mt-1 tracking-tighter">${campaigns.reduce((acc, c) => acc + parseInt(c.spent?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}</p>
            <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1"><TrendingUp size={10}/> Efficiency +3%</p>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><BarChart3 size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-emerald-500 transition-colors">
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Active Runs</p>
            <p className="text-3xl font-bold mt-1 tracking-tighter text-emerald-500">{campaigns.filter(c => c.status === "Active").length}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Ready for scale</p>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Play size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-indigo-500 transition-colors">
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Total Clicks</p>
            <p className="text-3xl font-bold mt-1 tracking-tighter text-indigo-500">{campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0).toLocaleString()}</p>
            <p className="text-[10px] text-indigo-500 font-bold mt-1">CTR Avg. 4.2%</p>
          </div>
          <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><MousePointer2 size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm group hover:border-purple-500 transition-colors">
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Conversions</p>
            <p className="text-3xl font-bold mt-1 tracking-tighter text-purple-500">{campaigns.reduce((acc, c) => acc + (c.conversions || 0), 0).toLocaleString()}</p>
            <p className="text-[10px] text-purple-500 font-bold mt-1">CPA: $12.40</p>
          </div>
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl"><Target size={24} /></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#0f0f0f] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by name or platform..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none cursor-pointer focus:ring-2 focus:ring-black dark:focus:ring-white shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Runs</option>
            <option value="Paused">Paused Hub</option>
            <option value="Draft">Drafting</option>
          </select>
        </div>
      </div>

      <div className="rounded-[32px] bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-400">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Campaign Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Lifecycle</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Budget Execution</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Intelligence Gap</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Admin Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredCampaigns.length > 0 ? filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-black text-lg italic tracking-tight text-black dark:text-white uppercase leading-none">{camp.name}</div>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full">
                          {getPlatformIcon(camp.platform)}
                          {camp.platform}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 space-y-1.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-max shadow-sm ${getStatusStyle(camp.status)}`}>
                      {camp.status === "Active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {camp.status}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                       <Calendar size={10} /> {camp.start_date || 'No Start'} ➔ {camp.end_date || 'Ongoing'}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-between items-end mb-1.5">
                       <span className="text-lg font-black tracking-tighter">{camp.budget}</span>
                       <span className="text-[10px] font-bold text-slate-400">{camp.spent || '$0'} utilized</span>
                    </div>
                    <div className="w-40 bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, (parseInt(camp.spent?.replace(/[^0-9]/g, '') || '0') / (parseInt(camp.budget?.replace(/[^0-9]/g, '') || '1') || 1))*100)}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engage</span>
                        <span className="font-black text-sm">{camp.clicks?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intent</span>
                        <span className="font-black text-sm text-purple-500">{camp.conversions || 0}</span>
                      </div>
                      <div className="col-span-2 mt-1">
                        <span className={`text-[10px] font-black italic ${camp.roi?.startsWith('+') ? 'text-emerald-500' : camp.roi?.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                           ROI IMPACT: {camp.roi || '0%'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleToggleStatus(camp.id, camp.status)}
                        className={`p-2.5 rounded-2xl transition-all shadow-md active:scale-90 ${camp.status === "Active" ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                        title={camp.status === "Active" ? "Pause Runtime" : "Re-Launch"}
                      >
                        {camp.status === "Active" ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCampaign(camp);
                          setIsModalOpen(true);
                        }}
                        className="p-2.5 text-slate-400 hover:text-black dark:hover:text-white bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-200 transition-all shadow-inner"
                        title="Modify Campaign"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-md active:scale-90"
                        title="Terminate Campaign"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center flex flex-col items-center justify-center opacity-50 space-y-4">
                     <Megaphone size={60} className="text-slate-300" />
                     <p className="text-sm font-black uppercase tracking-widest">No Active Campaigns Identified.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase">{editingCampaign ? 'UPDATE CAMPAIGN' : 'ORCHESTRATE RUNTIME'}</h2>
                 <p className="text-[10px] text-slate-400 font-mono mt-1">{editingCampaign ? `Editing Entity ID: ${editingCampaign.id}` : 'Multi-Domain Broadcast v7.2'}</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingCampaign(null); }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 shadow-sm">&times;</button>
            </div>
            <form onSubmit={handleLaunch}>
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Identity</label>
                  <input name="name" required type="text" defaultValue={editingCampaign?.name || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="e.g. Q3 Global Brand Expansion" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Broadcast Platform</label>
                    <select name="platform" defaultValue={editingCampaign?.platform || "Google Ads"} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer">
                      <option>Google Ads</option>
                      <option>Meta Ads</option>
                      <option>LinkedIn</option>
                      <option>TikTok</option>
                      <option>Twitter / X</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial State</label>
                    <select name="status" defaultValue={editingCampaign?.status || "Active"} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer">
                      <option value="Active">Hot Run (Active)</option>
                      <option value="Draft">Drafting / Prep</option>
                      <option value="Paused">Cold Storage (Paused)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Launch Date</label>
                    <input name="startDate" type="date" defaultValue={editingCampaign?.start_date || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Projection</label>
                    <input name="endDate" type="date" defaultValue={editingCampaign?.end_date || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold" />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Audience Matrix</label>
                   <textarea name="audience" defaultValue={editingCampaign?.audience || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-xs font-bold h-24 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Males 25-45, Interested in Tech, Silicon Valley Locale..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Budget ($)</label>
                    <input name="budget" required type="number" defaultValue={editingCampaign?.budget?.replace(/[^0-9]/g, '') || ""} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold" placeholder="2500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Starting Spend ($)</label>
                    <input name="spent" type="number" defaultValue={editingCampaign?.spent?.replace(/[^0-9]/g, '') || "0"} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold" placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="p-10 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4 bg-slate-50 dark:bg-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Abort Mission</button>
                <button type="submit" className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
                   🚀 {editingCampaign ? 'Update Campaign' : 'Ignite Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

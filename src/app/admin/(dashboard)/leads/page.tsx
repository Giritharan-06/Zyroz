"use client";

import { Search, Filter, Plus, ExternalLink, Bell, Trash2, Edit, Target, TrendingUp, Users, MousePointer2, Globe, ArrowUpRight, CheckCircle2, Clock, Mail, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ""});
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("http://localhost:5000/api/leads");
        if (res.ok) {
          const data = await res.json();
          const formattedLeads = (data.leads || []).map((l: any) => ({
            id: l.id,
            name: l.name,
            company: l.company || "Direct Individual",
            email: l.email,
            phone: l.phone || "No Phone",
            status: l.status || "New",
            source: l.source || "Organic",
            score: l.score || 85,
            service: l.service || "General",
            budget: l.budget || "Not specified",
            message: l.message || "",
            date: new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            lastActivity: "2h ago"
          }));
          setLeads(formattedLeads);
        }
      } catch (err) {
        console.error("Failed to fetch real leads:", err);
      }
    }
    fetchLeads();

    const socket = io("http://localhost:5000");
    socket.on("new_lead", (newLead) => {
      const formattedLead = {
        id: newLead.id,
        name: newLead.name,
        company: newLead.company || "Direct Individual",
        email: newLead.email,
        phone: newLead.phone || "No Phone",
        status: newLead.status || "New",
        source: newLead.source || "Organic",
        score: newLead.score || 85,
        service: newLead.service || "General",
        budget: newLead.budget || "Not specified",
        message: newLead.message || "",
        date: new Date(newLead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastActivity: "Just now"
      };
      setLeads((prev) => [formattedLead, ...prev]);
      setToast({ show: true, message: `🔥 High-Intent Lead Captured: ${formattedLead.name}` });
      setTimeout(() => setToast({ show: false, message: "" }), 5000);
    });
    return () => { socket.disconnect(); };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Contacted": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Converted": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const updateLeadStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        setToast({ show: true, message: "🚀 Pipeline status synchronized" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entity? This action is irreversible.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        setToast({ show: true, message: "🗑️ Lead entity purged from main cluster" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const [newLeadForm, setNewLeadForm] = useState({ 
    name: "", email: "", phone: "", company: "", status: "New", service: "General", budget: "Not specified", message: "", score: 80 
  });
  const [editingLead, setEditingLead] = useState<any>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Premium Toast */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-10 duration-500">
           <div className="bg-black text-white px-8 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/10">
              <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-black">
                 <Zap size={20} className="fill-current" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-50">System Broadcast</p>
                 <p className="text-sm font-bold tracking-tight">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Lead Ingestion Hub</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">Conversion Stream Control Center / Live Tracking</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
          <Plus size={20} /> Deploy Manual Entry
        </button>
      </div>

      {/* Analytics Snapshot Upgrade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-6 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={60}/></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pipeline Volume</p>
            <p className="text-4xl font-black tracking-tighter mt-1 italic uppercase">{leads.length}</p>
            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-2">
               <TrendingUp size={12}/> +14.2% THIS MONTH
            </div>
         </div>
         <div className="p-6 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={60}/></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Contacts</p>
            <p className="text-4xl font-black tracking-tighter mt-1 italic uppercase text-blue-500">{leads.filter(l=>l.status === 'Contacted').length}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic uppercase">42 In Active Dialogue</p>
         </div>
         <div className="p-6 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-sm relative overflow-hidden group border-emerald-500/20">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle2 size={60}/></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversions</p>
            <p className="text-4xl font-black tracking-tighter mt-1 italic uppercase text-emerald-500">{leads.filter(l=>l.status === 'Converted').length}</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-2 italic uppercase tracking-widest">Efficiency 24%</p>
         </div>
         <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] shadow-xl text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Avg. Lead Score</p>
            <p className="text-4xl font-black tracking-tighter mt-1 italic uppercase">82.4<span className="text-lg opacity-50">/100</span></p>
            <p className="text-[10px] font-bold mt-2 opacity-70 uppercase tracking-widest">High Quality Stream</p>
         </div>
      </div>

      <div className="bg-white dark:bg-[#0f0f0f] p-4 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
            <input 
               type="text" 
               placeholder="DECRYPT LEAD IDENTITY (NAME, EMAIL, COMPANY)..." 
               className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-black dark:focus:border-white rounded-[24px] text-xs font-black uppercase tracking-widest outline-none transition-all shadow-inner"
            />
         </div>
         <div className="flex gap-2">
            {['All', 'New', 'Contacted', 'Converted'].map(t => (
               <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-6 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-[1.05]' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                  {t}
               </button>
            ))}
         </div>
      </div>

      <div className="rounded-[40px] bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-400">
                  <tr>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Entity / Origin</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Communication Channel</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Pipeline Matrix</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Quality Score</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-right">Tactical Control</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {leads.filter(l => filter === 'All' || l.status === filter).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="font-black text-lg italic tracking-tighter text-black dark:text-white uppercase leading-none">{lead.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.company}</span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1"><Globe size={10}/> {lead.source}</span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{lead.service}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1">
                             <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Mail size={12} className="text-slate-400"/> {lead.email}</span>
                             <span className="text-xs font-bold text-slate-500 flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {lead.phone}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="relative inline-block group/select">
                             <select 
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 outline-none cursor-pointer appearance-none ${getStatusStyle(lead.status)} shadow-sm transition-all hover:scale-105`}
                                value={lead.status}
                             >
                                <option value="New">NEW INQUIRY</option>
                                <option value="Contacted">IN DIALOGUE</option>
                                <option value="Converted">CONVERTED</option>
                             </select>
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover/select:translate-y-0.5 transition-transform">
                                <ArrowUpRight size={12} className="rotate-90" />
                             </div>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-1.5"><Clock size={10}/> Ingested {lead.date}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="flex-1 w-24 bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-white/10">
                                <div className={`h-full shadow-[0_0_10px_rgba(34,197,94,0.4)] ${lead.score > 85 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${lead.score}%` }}></div>
                             </div>
                             <span className="text-xs font-black italic">{lead.score}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"><MessageSquare size={18} /></button>
                             <button 
                                onClick={() => {
                                  setEditingLead(lead);
                                  setNewLeadForm({ 
                                    name: lead.name, 
                                    email: lead.email, 
                                    phone: lead.phone,
                                    company: lead.company,
                                    status: lead.status,
                                    service: lead.service || "General",
                                    budget: lead.budget || "Not specified",
                                    message: lead.message || "",
                                    score: lead.score || 80
                                  });
                                  setIsModalOpen(true);
                                }}
                                className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                             >
                                <Edit size={18} />
                             </button>
                             <button onClick={() => handleDeleteLead(lead.id)} className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-8 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mapping Entity {leads.length > 0 ? 1 : 0} - {leads.length} // Total Volume: {leads.length}</div>
            <div className="flex gap-2">
               <button className="px-6 py-2 border-2 border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Previous Block</button>
               <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">1</button>
               <button className="px-6 py-2 border-2 border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Next Block</button>
            </div>
         </div>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
              <div className="p-10 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                <div>
                   <h2 className="text-3xl font-black italic tracking-tighter uppercase">{editingLead ? 'Update Lead Entity' : 'Ingest New Lead'}</h2>
                   <p className="text-[10px] text-slate-400 font-mono mt-1">Direct manual override / Authorization required</p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 shadow-sm">&times;</button>
              </div>

              <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Identity</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                      placeholder="e.g. Alexander Pierce"
                      value={newLeadForm.name}
                      onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                      placeholder="pierce@corp.com" 
                      value={newLeadForm.email}
                      onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Signal</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                      placeholder="+1 (555) 000-0000"
                      value={newLeadForm.phone}
                      onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Org / Company</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                      placeholder="e.g. OmniCorp Global" 
                      value={newLeadForm.company}
                      onChange={e => setNewLeadForm({...newLeadForm, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Status</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer"
                      value={newLeadForm.status}
                      onChange={e => setNewLeadForm({...newLeadForm, status: e.target.value})}
                    >
                      <option value="New">NEW INQUIRY</option>
                      <option value="Contacted">IN DIALOGUE</option>
                      <option value="Converted">CONVERTED</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Score (0-100)</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                      placeholder="85"
                      value={newLeadForm.score}
                      onChange={e => setNewLeadForm({...newLeadForm, score: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Notes</label>
                   <textarea 
                     rows={3} 
                     className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" 
                     placeholder="Additional context about this lead..."
                     value={newLeadForm.message}
                     onChange={e => setNewLeadForm({...newLeadForm, message: e.target.value})}
                   />
                </div>
              </div>

              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex gap-4">
                 <button onClick={() => { setIsModalOpen(false); setEditingLead(null); }} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Abort</button>
                 <button 
                  onClick={async () => {
                    if (!newLeadForm.name || !newLeadForm.email) return alert("Identity and Email are requirements.");
                    try {
                      const url = editingLead ? `http://localhost:5000/api/leads/${editingLead.id}` : "http://localhost:5000/api/leads";
                      const method = editingLead ? "PATCH" : "POST";
                      const res = await fetch(url, {
                        method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          ...newLeadForm, 
                          source: editingLead ? editingLead.source : "Manual Entry" 
                        })
                      });
                      if (res.ok) {
                        const data = await res.json();
                        if (editingLead) {
                          setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...newLeadForm } : l));
                        } else {
                          setLeads([{ 
                            id: data.lead.id, 
                            ...newLeadForm, 
                            source: "Manual Entry", 
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            lastActivity: "Just now"
                          }, ...leads]);
                        }
                        setIsModalOpen(false);
                        setEditingLead(null);
                        setNewLeadForm({ name: "", email: "", phone: "", company: "", status: "New", service: "General", budget: "Not specified", message: "", score: 80 });
                        setToast({ show: true, message: editingLead ? "🔄 Lead updated successfully" : "🎯 New lead ingested and synchronized" });
                        setTimeout(() => setToast({ show: false, message: "" }), 3000);
                      }
                    } catch (err) { console.error(err); }
                  }}
                  className="flex-1 py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-xs shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                 >
                    <Plus size={18} /> {editingLead ? 'Update Lead Matrix' : 'Commit New Lead'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { FileBarChart, Download, Calendar, Mail, Plus, CheckCircle2, MoreHorizontal, Clock, Settings2, FileText, ChevronRight, Zap, Bell, Trash2, Edit, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function ReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [recentExports, setRecentExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("http://localhost:5000/api/logs");
        if (res.ok) {
          const data = await res.json();
          // Filter for reporting events or just show latest system activity as exports
          const formatted = data.logs.filter((l: any) => l.event_type.includes('SYNC') || l.event_type.includes('REPORT')).map((l: any) => ({
            name: `${l.event_type}_${l.id}.pdf`,
            size: "1.2 MB",
            date: new Date(l.created_at).toLocaleTimeString() + ", " + new Date(l.created_at).toLocaleDateString(),
            status: "Ready"
          }));
          setRecentExports(formatted.length > 0 ? formatted : [
            { name: "Global_Sync_Log.pdf", size: "12 KB", date: "Just now", status: "Ready" },
            { name: "System_Health_Audit.csv", size: "45 KB", date: "1 hour ago", status: "Ready" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const handleAction = (id: string, message: string) => {
    setActiveAction(id);
    setTimeout(() => {
      setActiveAction(null);
      alert(message);
    }, 1500);
  };

  const reports = [
    { id: "r1", title: "Executive Summary", type: "Weekly", desc: "High-level metrics including total spend, CAC, and pipeline value. Sent to management team.", color: "blue" },
    { id: "r2", title: "Channel Performance Detail", type: "Monthly", desc: "Granular metrics for Ads, SEO, and Social channels. Broken down by platform.", color: "emerald" },
    { id: "r3", title: "Lead Conversion Audit", type: "On-demand", desc: "Detailed trace of lead sources and conversion rates for the current quarter.", color: "amber" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Reporting Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Automated PDF and CSV generation for stakeholders and clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Create Custom Report
        </button>
      </div>

      {/* KPI Row / Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="p-6 rounded-[32px] bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col hover:border-black dark:hover:border-white transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 bg-${report.color}-50 dark:bg-${report.color}-500/10 text-${report.color}-600 dark:text-${report.color}-400 rounded-2xl flex items-center justify-center shadow-sm`}>
                {report.id === 'r1' ? <Calendar size={28} /> : <FileBarChart size={28} />}
              </div>
              <div className="flex flex-col items-end gap-2">
                 <span className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 uppercase tracking-widest">{report.type}</span>
                 {activeAction === `${report.id}-send` && <span className="text-[10px] font-bold text-emerald-500 animate-pulse">Sending...</span>}
              </div>
            </div>
            <h3 className="font-black text-xl mb-2 italic tracking-tight">{report.title}</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{report.desc}</p>
            
            <div className="mt-auto border-t border-slate-100 dark:border-white/5 pt-6 flex justify-between items-center">
              <div className="flex gap-4">
                 <button 
                   onClick={() => handleAction(`${report.id}-dl`, "Generating your high-fidelity report... Check your downloads folder.")}
                   className="text-slate-400 hover:text-black dark:hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors"
                 >
                   <Download size={16}/> PDF
                 </button>
                 <button 
                   onClick={() => handleAction(`${report.id}-send`, "Broadcast complete! Stakeholders have been notified by email.")}
                   className="text-slate-400 hover:text-black dark:hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors"
                 >
                   <Mail size={16}/> Send Now
                 </button>
              </div>
              <button className="p-2 text-slate-300 hover:text-black transition-colors"><MoreHorizontal size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Exports */}
         <div className="lg:col-span-2 bg-white dark:bg-[#0f0f0f] rounded-[32px] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
               <h2 className="font-bold text-lg flex items-center gap-2">
                  <Clock size={20} className="text-slate-400" />
                  Recent Generates
               </h2>
               <button className="text-xs font-bold text-blue-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                     {recentExports.map((exp, i) => (
                       <tr key={i} className="hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 transition-colors group">
                          <td className="px-6 py-5 flex items-center gap-3 font-bold cursor-pointer">
                             <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center">
                                <FileText size={16} />
                             </div>
                             {exp.name}
                          </td>
                          <td className="px-6 py-5 text-slate-500 text-xs">{exp.size}</td>
                          <td className="px-6 py-5 text-slate-400 text-xs">{exp.date}</td>
                          <td className="px-6 py-5 text-right">
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${exp.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {exp.status}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Configuration Sidebar */}
         <div className="space-y-6">
            <div className="p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={100} strokeWidth={4} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Auto-Reporting</p>
               <h3 className="text-2xl font-black italic mb-4 leading-tight">SCHEDULED BROADCASTS</h3>
               <p className="text-sm text-slate-400 leading-relaxed mb-6 italic">Next automated run: Monday at 09:00 AM EST targeting Management Group.</p>
               <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
               >
                  <Settings2 size={16} /> Configure Schedule
               </button>
            </div>

            <div className="p-6 border border-slate-200 dark:border-white/10 rounded-[32px] bg-white dark:bg-[#0f0f0f]">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" /> Notifications
               </h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     <p className="text-xs text-slate-500">Success: Q1 Report Emailed</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                     <p className="text-xs text-slate-500">Warning: 1 recipient failed bounce</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Custom Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <div>
                    <h2 className="text-3xl font-black italic tracking-tighter">CRAFT CUSTOM REPORT</h2>
                    <p className="text-xs text-slate-400 font-mono mt-1">Multi-Domain Evidence Aggregator v9.0</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm bg-white dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/10">&times;</button>
              </div>

              <div className="p-10 space-y-8 h-[500px] overflow-y-auto custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Report Identity</label>
                    <input type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Q2 Performance Deep Dive" />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Inclusion Modules</label>
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { id: "ads", label: "Paid Campaigns (Ads)", icon: <Zap size={16} /> },
                         { id: "seo", label: "Organic Reach (SEO)", icon: <Search size={16} /> },
                         { id: "leads", label: "Lead Pipeline (CRM)", icon: <Plus size={16} /> },
                         { id: "social", label: "Social Interactions", icon: <Mail size={16} /> },
                       ].map((mod) => (
                         <div key={mod.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-white/5">
                            <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-wide">
                               <div className="text-indigo-500">{mod.icon}</div>
                               {mod.label}
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-indigo-600 cursor-pointer" defaultChecked />
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Range</label>
                       <select className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer">
                          <option>Last 30 Days (Standard)</option>
                          <option>Last Quarter (Q1 2024)</option>
                          <option>Current Fiscal Year</option>
                          <option>Custom Range Selection</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Output Format</label>
                       <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-red-500/10 text-red-500 border-2 border-red-500 rounded-xl font-black text-[10px] uppercase">PDF</button>
                          <button className="flex-1 py-3 border-2 border-slate-100 dark:border-white/10 text-slate-400 rounded-xl font-black text-[10px] uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all">CSV</button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stakeholder Delivery</label>
                    <div className="p-6 rounded-[28px] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-indigo-600">Email Report Automatically</p>
                          <div className="w-10 h-5 bg-indigo-600 rounded-full relative"><div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1"></div></div>
                       </div>
                       <input type="email" className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-xs outline-none" placeholder="recipients@management.com" />
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Discard Draft</button>
                 <button 
                  onClick={() => {
                    handleAction("create", "High-fidelity report generation started! It will be emailed shortly.");
                    setIsModalOpen(false);
                  }}
                  className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                 >
                    <Zap size={18} /> Orchestrate Report
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Schedule Automation Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-slate-900 text-white w-full max-w-xl rounded-[40px] shadow-2xl flex flex-col border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-10 border-b border-white/5 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white/10 text-brand-accent rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                    <Clock size={32} />
                 </div>
                 <h2 className="text-2xl font-black italic tracking-tighter">AUTOMATION ENGINE</h2>
                 <p className="text-[10px] text-slate-400 font-mono">Recurrence Logic v1.4.2</p>
              </div>

              <div className="p-10 space-y-6">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scheduled Trigger</p>
                    <div className="grid grid-cols-2 gap-3">
                       {['Weekly', 'Monthly', 'Daily', 'Bi-Weekly'].map((freq) => (
                         <button key={freq} className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${freq === 'Weekly' ? 'border-brand-accent text-brand-accent bg-brand-accent/5' : 'border-white/5 text-slate-500 hover:border-white/20'}`}>
                            {freq}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Day of Run</p>
                       <select className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer text-white">
                          <option className="bg-slate-800">Monday</option>
                          <option className="bg-slate-800">Friday</option>
                          <option className="bg-slate-800">Sunday night</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dispatch Time</p>
                       <input type="time" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold outline-none text-white" defaultValue="09:00" />
                    </div>
                 </div>

                 <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recipient Matrix</p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="flex items-center justify-between text-xs font-bold">
                          <span>management-group@agency.com</span>
                          <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded">Active</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-white/5 flex gap-4 bg-white/5">
                 <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Abort</button>
                 <button 
                  onClick={() => {
                    alert("Automation sequence initialized! Reports will be dispatched as per the schedule.");
                    setIsScheduleModalOpen(false);
                  }}
                  className="flex-[2] py-4 bg-white text-black rounded-2xl text-xs font-black shadow-xl uppercase tracking-widest flex items-center justify-center gap-3"
                 >
                    <Zap size={16} /> Deploy Sequence
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

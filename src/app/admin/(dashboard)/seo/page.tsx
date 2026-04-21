"use client";

import { FileText, Search, TrendingUp, AlertTriangle, Globe, BarChart2, CheckCircle2, ChevronRight, Zap, Shield, Smartphone, ArrowUpRight, ArrowDownRight, MoreHorizontal, Link2, Ghost } from "lucide-react";
import { useState, useEffect } from "react";

export default function SEOPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [auditReports, setAuditReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSEOReports() {
      try {
        const res = await fetch("http://localhost:5000/api/seo/reports");
        if (res.ok) {
          const data = await res.json();
          setAuditReports(data.reports);
        }
      } catch (err) {
        console.error("Failed to fetch SEO reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSEOReports();
  }, []);

  const handleAuthenticate = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 1500);
  };

  const keywords = [
    { name: "digital marketing agency", position: 3, change: "+2", volume: "12K" },
    { name: "best seo services", position: 5, change: "-1", volume: "8.5K" },
    { name: "content marketing strategy", position: 1, change: "0", volume: "5.2K" },
    { name: "social media growth", position: 12, change: "+5", volume: "15K" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">SEO & Content Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track organic rankings, keyword performance, and site health indicators.</p>
        </div>
        <button 
          onClick={() => setIsAuditModalOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <Zap size={18} />
          Deep Audit Now
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organic Traffic</p>
            <p className="text-3xl font-bold mt-1 text-emerald-500">6,412</p>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">+18.4% vs last mo</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><TrendingUp size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracked Keywords</p>
            <p className="text-3xl font-bold mt-1">105</p>
            <p className="text-[10px] text-blue-500 font-medium mt-1">12 in Top #3</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Search size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Site Health Score</p>
            <p className="text-3xl font-bold mt-1 text-amber-500">{auditReports.length > 0 ? auditReports[0].seo_score : 82}/100</p>
            <p className="text-[10px] text-red-500 font-medium mt-1">{auditReports.length > 0 ? auditReports[0].issues_found.critical : 12} Critical Errors</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><AlertTriangle size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authority Score</p>
            <p className="text-3xl font-bold mt-1 text-purple-500">45</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Competitor avg: 38</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Link2 size={24} /></div>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="rounded-[40px] bg-slate-900 text-white border border-white/10 shadow-2xl overflow-hidden p-12 text-center relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <FileText size={40} className="text-brand-accent/80" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter mb-4">CONNECT GOOGLE SEARCH CONSOLE</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">Unlock real-time keyword rankings, impression data, and indexation status directly in your dashboard with one-click Google authentication.</p>
              <button 
                onClick={handleAuthenticate}
                disabled={isAuthenticating}
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isAuthenticating ? "Connecting Safe Stream..." : "Authenticate with Google"}
              </button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 duration-500">
           {/* Keyword table */}
           <div className="lg:col-span-2 bg-white dark:bg-[#0f0f0f] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                 <h2 className="font-bold text-lg uppercase tracking-tight">Keyword Ranking Pulse</h2>
                 <button className="text-xs font-bold text-blue-500">Full Export</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <th className="px-6 py-4">Keyword</th>
                          <th className="px-6 py-4">Position</th>
                          <th className="px-6 py-4">Change</th>
                          <th className="px-6 py-4 text-right">Avg. Volume</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                       {keywords.map((kw, i) => (
                         <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-bold">{kw.name}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded font-black">#{kw.position}</span></td>
                            <td className="px-6 py-4">
                               <div className={`flex items-center gap-1 font-bold ${kw.change.includes('+') ? 'text-emerald-500' : kw.change === '0' ? 'text-slate-400' : 'text-red-500'}`}>
                                  {kw.change.includes('+') ? <ArrowUpRight size={14} /> : kw.change === '0' ? '-' : <ArrowDownRight size={14} />}
                                  {kw.change !== '0' && kw.change}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-500">{kw.volume}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Content Score */}
           <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-[#0f0f0f] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                 <h2 className="font-bold text-lg mb-6">Device Share</h2>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2 text-sm font-bold">
                          <Smartphone size={16} className="text-slate-400" /> Mobile
                       </div>
                       <span className="text-sm font-black">72%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <Globe size={16} /> Desktop
                       </div>
                       <span className="text-sm font-black text-slate-500">28%</span>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">PRO INSIGHT</p>
                 <h3 className="text-xl font-black italic mb-3 leading-tight">MOBILE INDEXING HUB</h3>
                 <p className="text-xs text-white/70 leading-relaxed mb-6">Your site has been moved to "Mobile-First Indexing". SEO performance depends heavily on your mobile speed scores.</p>
                 <button className="w-full py-3 bg-white text-indigo-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors">Improve Mobile Score</button>
              </div>
           </div>
        </div>
      )}

      {/* Audit Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-xl rounded-[32px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col items-center text-center bg-slate-50/50 dark:bg-white/5">
                 <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Zap size={32} />
                 </div>
                 <h2 className="text-2xl font-black italic">SITE AUDIT ENGINE</h2>
                 <p className="text-xs text-slate-400 font-mono">Running Version Analysis v4.2.0</p>
              </div>

              <div className="p-8 space-y-6 text-sm">
                 <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Audit Scope</p>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { id: "full", label: "Full Crawler", icon: <Globe size={14} /> },
                         { id: "perf", label: "Performance", icon: <Zap size={14} /> },
                         { id: "sec", label: "Security/SSL", icon: <Shield size={14} /> },
                         { id: "mobile", label: "Mobile First", icon: <Smartphone size={14} /> },
                       ].map((opt) => (
                         <button key={opt.id} className="flex items-center gap-2 p-3 rounded-xl border-2 border-slate-100 dark:border-white/5 hover:border-emerald-500 transition-colors bg-white dark:bg-white/5 font-bold">
                            {opt.icon} {opt.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target Root URL</p>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" defaultValue="https://yourwebsite.com" />
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Frequency</p>
                       <select className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold outline-none cursor-pointer">
                          <option>One-Time Deep Audit</option>
                          <option>Weekly Scan (Recurring)</option>
                          <option>Daily Health Check</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex gap-3">
                 <button onClick={() => setIsAuditModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Cancel</button>
                 <button 
                  onClick={() => {
                    alert("Audit scheduled! The engine is now crawling your site.");
                    setIsAuditModalOpen(false);
                  }}
                  className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-xl uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                    <Zap size={16} /> Start Crawl
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

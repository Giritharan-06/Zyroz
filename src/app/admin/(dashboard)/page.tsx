import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { Users, Megaphone, Activity, BarChart3, ArrowUpRight, DollarSign, MousePointerClick, TrendingUp, Zap, Target, Mail, Shield, Globe, Terminal, ChevronRight, Clock, Plus, BarChart, Server, Cpu, HardDrive } from "lucide-react";
import { LeadsWidget, CampaignChart } from "../components/DashboardCharts";
import { LaunchOpButton } from "../components/LaunchOpButton";
import Link from "next/link";

export const metadata = {
  title: "Mission Control | Zyroz Agency CRM"
};

export default async function AdminDashboard() {
  let leads = [];
  let totalLeads = 0;
  let newRequestsThisWeek = 0;
  let totalCampaigns = 0;
  let activeCampaigns = 0;
  let totalSpend = 0;
  let dbVolumeGB = 0;
  let avgHealth = 0;
  
  try {
    const res = await query("SELECT * FROM leads ORDER BY created_at DESC");
    leads = res.rows || [];
    totalLeads = leads.length;

    const campaignRes = await query("SELECT * FROM campaigns");
    const campaigns = campaignRes.rows || [];
    totalCampaigns = campaigns.length;
    activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
    
    totalSpend = campaigns.reduce((acc, current) => {
      const numericSpend = parseInt((current.spent || "0").replace(/[^0-9.-]+/g,""), 10) || 0;
      return acc + numericSpend;
    }, 0);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    newRequestsThisWeek = leads.filter(l => new Date(l.created_at) > oneWeekAgo).length;

    // Fetch Analytics for Health Score and DB Volume
    const analyticsRes = await query("SELECT * FROM analytic_metrics ORDER BY date DESC LIMIT 1");
    const seoRes = await query("SELECT AVG(seo_score) as avg_score FROM seo_audits");
    avgHealth = Math.round(Number(seoRes.rows[0]?.avg_score || 82));
    
    // Simulate DB volume from media + logs
    const mediaRes = await query("SELECT COUNT(*) FROM media");
    dbVolumeGB = Number((Number(mediaRes.rows[0].count) * 0.15 + totalLeads * 0.01).toFixed(2));
  } catch (err) {
    console.error("Database connection missing/failed in admin overview.");
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-1000">
      
      {/* Prime Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2 p-1.5 px-3 bg-emerald-500/10 text-emerald-500 rounded-full w-max border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">All Systems Nominal</span>
           </div>
           <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Mission Control</h1>
           <p className="text-slate-500 font-mono text-xs mt-3 uppercase tracking-widest">Global Marketing Hub / Operator: Root Admin</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/reports" className="px-6 py-4 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-3">
              <BarChart size={16}/> Extract Intel
           </Link>
           <LaunchOpButton />
        </div>
      </div>

      {/* Hero KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Ad Velocity", value: `$${totalSpend.toLocaleString()}`, trend: "PACE NOMINAL", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Entity Capture", value: totalLeads.toLocaleString(), trend: "+12.4% IMPACT", icon: Target, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Efficiency Index", value: "4.82%", trend: "+0.45 DELTA", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Deployments", value: activeCampaigns, trend: "READY FOR SCALE", icon: Megaphone, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((kpi, i) => (
          <div key={i} className="p-8 rounded-[40px] bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm relative group overflow-hidden hover:border-black dark:hover:border-white transition-colors">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${kpi.color}`}><kpi.icon size={80}/></div>
            <div className="relative z-10">
               <p className="text-[10px] font-black font-mono uppercase tracking-[0.3em] text-slate-400 mb-2">{kpi.label}</p>
               <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-2">{kpi.value}</h3>
               <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${kpi.color}`}>
                  <Activity size={12}/> {kpi.trend}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Performance Core */}
        <div className="lg:col-span-8 space-y-8">
           <LeadsWidget leads={leads} />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Inquiries List */}
              <div className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[48px] overflow-hidden shadow-sm">
                 <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-black italic uppercase italic">Recent Inquiries</h3>
                    <Link href="/admin/leads" className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full"><ChevronRight size={20}/></Link>
                 </div>
                 <div className="p-2">
                    {leads.slice(0, 4).map((lead: any, i) => (
                      <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[32px] transition-all group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center font-black italic text-lg uppercase tracking-tighter">{(lead.name || "A")[0]}</div>
                            <div>
                               <p className="font-black text-sm uppercase tracking-tight">{lead.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.service || "Growth Plan"}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">Active</div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* System Infrastructure Monitoring */}
              <div className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[48px] p-8 shadow-sm">
                 <h3 className="text-xl font-black italic uppercase italic mb-8">Node Telemetry</h3>
                 <div className="space-y-8">
                    {[
                      { label: "Core Compute (CPU)", val: "24%", icon: Cpu, color: "bg-blue-500" },
                      { label: "Memory Saturation", val: "42%", icon: Activity, color: "bg-purple-500" },
                      { label: "Database Volume", val: `${dbVolumeGB} GB`, icon: HardDrive, color: "bg-emerald-500" },
                      { label: "Site Health (SEO)", val: `${avgHealth}%`, icon: Shield, color: "bg-amber-500" },
                    ].map((m, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <m.icon size={16} className="text-slate-400"/>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.label}</span>
                            </div>
                            <span className="text-xs font-black italic">{m.val}</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                            <div className={`h-full ${m.color}`} style={{ width: m.val.includes('%') ? m.val : '65%' }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right Intel Column */}
        <div className="lg:col-span-4 space-y-8">
           {/* Quick Action Matrix */}
           <div className="bg-black dark:bg-white text-white dark:text-black p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:rotate-12 transition-transform duration-700"><Terminal size={100}/></div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter italic leading-none mb-4">Command Action</h3>
              <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-10">Select tactical entry point</p>
              
              <div className="space-y-3">
                 {[
                   { label: "Deploy Ad Campaign", route: "/admin/campaigns", icon: Zap },
                   { label: "Orchestrate Leads", route: "/admin/leads", icon: Target },
                   { label: "Broadcast Social", route: "/admin/social", icon: Globe },
                   { label: "Run SEO Audit", route: "/admin/seo", icon: Shield },
                   { label: "Identity Sync", route: "/admin/settings", icon: Users },
                 ].map((act, i) => (
                   <Link key={i} href={act.route} className="flex items-center justify-between w-full p-5 bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 rounded-[28px] border border-white/10 dark:border-black/5 transition-all group/item">
                      <div className="flex items-center gap-4">
                         <act.icon size={20} className="group-hover/item:text-brand-accent transition-colors" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{act.label}</span>
                      </div>
                      <ChevronRight size={16} />
                   </Link>
                 ))}
              </div>
           </div>

           {/* Performance Snapshot Widget */}
           <div className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[48px] p-10 shadow-sm relative group">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Campaign Yield</p>
              <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-8 italic">94.2% <small className="text-xs opacity-50 not-italic">AVG</small></h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span>Target Saturation</span>
                    <span className="text-emerald-500">Peak Reach</span>
                 </div>
                 <CampaignChart />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

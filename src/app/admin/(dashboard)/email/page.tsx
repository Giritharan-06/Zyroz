"use client";

import { Mail, Plus, Send, BarChart2, MousePointerClick, Users, Clock, AlertTriangle, CheckCircle2, ChevronRight, Layout, Filter, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function EmailMarketingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmailCampaigns() {
      try {
        const res = await fetch("http://localhost:5000/api/email/campaigns");
        if (res.ok) {
          const data = await res.json();
          const formatted = data.campaigns.map((c: any) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            recipients: c.sent_count > 0 ? c.sent_count.toLocaleString() : "TBD",
            openRate: c.open_rate > 0 ? `${c.open_rate}%` : "-",
            clickRate: c.click_rate > 0 ? `${c.click_rate}%` : "-",
            date: c.status === 'Sent' ? new Date(c.created_at).toISOString().split('T')[0] : (c.scheduled_at ? new Date(c.scheduled_at).toISOString().split('T')[0] : 'Draft')
          }));
          setCampaigns(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch email campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEmailCampaigns();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Email Marketing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage newsletters, automated sequences, and subscriber lists.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</p>
            <p className="text-3xl font-bold mt-1">8,405</p>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">+12% from last month</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Users size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Open Rate</p>
            <p className="text-3xl font-bold mt-1 text-emerald-500">22.4%</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Industry avg: 18.2%</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Mail size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Click Rate</p>
            <p className="text-3xl font-bold mt-1">4.1%</p>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Top performant: Promotional</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><MousePointerClick size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unsubscribe Rate</p>
            <p className="text-3xl font-bold mt-1 text-red-500">0.42%</p>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">Healthy: &lt; 1%</p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><AlertTriangle size={24} /></div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h2 className="text-xl font-bold">Recent Campaigns</h2>
              <p className="text-sm text-slate-500">Track and optimize your email performance.</p>
           </div>
           <div className="flex gap-2">
             <div className="bg-slate-50 dark:bg-white/5 p-1 rounded-lg flex">
                <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#1a1a1a] rounded-md shadow-sm">All</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-500">Sent</button>
                <button className="px-3 py-1.5 text-xs font-bold text-slate-500">Drafts</button>
             </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Recipients</th>
                <th className="px-6 py-4">Open Rate</th>
                <th className="px-6 py-4">Click Rate</th>
                <th className="px-6 py-4">Sent/Scheduled</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold flex items-center gap-2">
                      <Layout size={14} className="text-slate-400" />
                      {camp.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      camp.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-500' :
                      camp.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{camp.recipients}</td>
                  <td className="px-6 py-4 font-bold text-emerald-500">{camp.openRate}</td>
                  <td className="px-6 py-4 font-bold text-blue-500">{camp.clickRate}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{camp.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                      <ChevronRight size={18} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Templates Quick Start */}
      <div>
        <h2 className="text-xl font-bold mb-4">Start from a Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {[
             { title: "Monthly Newsletter", desc: "Clean & professional layout for company updates.", color: "bg-blue-500" },
             { title: "Promotional Flash", desc: "High-conversion layout for sales and offers.", color: "bg-purple-500" },
             { title: "Personal Outreach", desc: "Text-focused layout for personal client follow-up.", color: "bg-slate-700" }
           ].map((temp, i) => (
             <div key={i} className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 p-5 rounded-2xl group hover:border-black dark:hover:border-white transition-all cursor-pointer shadow-sm">
                <div className={`w-10 h-10 ${temp.color} rounded-xl mb-4 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                   <Layout size={20} />
                </div>
                <h3 className="font-bold mb-2">{temp.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{temp.desc}</p>
                <span className="text-xs font-bold flex items-center gap-1 group-hover:text-indigo-500 transition-colors">Use Template <ChevronRight size={14} /></span>
             </div>
           ))}
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                <h2 className="font-bold text-xl">Create Email Campaign</h2>
                <p className="text-xs text-slate-500">Configure your broadcast and delivery settings.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">&times;</button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Campaign Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. June Monthly Newsletter" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Subject Line</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Exclusive Early Access Inside! 🚀" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Audience Segment</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    <select className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                      <option>All Subscribers (8,405)</option>
                      <option>Converted Leads (520)</option>
                      <option>New / Cold Inquiries (1,240)</option>
                      <option>VIP Clients (85)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Campaign Type</label>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-indigo-600 bg-indigo-50/10 text-indigo-600 font-bold text-[10px] gap-1">
                        <Mail size={18} /> Broadcast
                     </button>
                     <button className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 dark:border-white/5 hover:border-indigo-600 transition-colors text-slate-500 font-bold text-[10px] gap-1">
                        <Clock size={18} /> Automation
                     </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Schedule Delivery</label>
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                     <Calendar size={18} className="text-slate-400" />
                     <input type="datetime-local" className="bg-transparent border-none outline-none text-sm w-full cursor-pointer" />
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                   <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">PRO TIP</p>
                   <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">Emails sent on Tuesday mornings have an average 4% higher open rate.</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/10 flex justify-end gap-3 bg-slate-50/50 dark:bg-white/5">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                Save as Draft
              </button>
              <button 
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Launch Campaign 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

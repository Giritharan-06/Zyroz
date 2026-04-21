"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useState, useMemo } from 'react';

const mockLeadsData = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 7 },
  { name: 'Wed', leads: 5 },
  { name: 'Thu', leads: 10 },
  { name: 'Fri', leads: 15 },
  { name: 'Sat', leads: 8 },
  { name: 'Sun', leads: 12 },
];

const campaignData = [
  { name: 'Google Ads', clicks: 4000, conversions: 240 },
  { name: 'Meta Ads', clicks: 3000, conversions: 139 },
  { name: 'LinkedIn', clicks: 2000, conversions: 980 },
  { name: 'TikTok', clicks: 2780, conversions: 190 },
];

export function LeadsWidget({ leads = [] }: { leads?: any[] }) {
  const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');

  const chartData = useMemo(() => {
    if (!leads || leads.length === 0) return mockLeadsData;
    
    const days = timeRange === '7D' ? 7 : 30;
    const now = new Date();
    
    const counts: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      counts[key] = 0;
    }

    leads.forEach(lead => {
      const d = new Date(lead.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    return Object.keys(counts).map(key => ({
      name: key,
      leads: counts[key]
    }));
  }, [leads, timeRange]);

  return (
    <div className="p-10 rounded-[48px] bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
         <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Leads Over Time</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Growth Metrics V2.4 / Real-time Feed</p>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={() => setTimeRange('7D')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === '7D' ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeRange('30D')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === '30D' ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}`}
            >
              30D
            </button>
         </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={10} stroke="currentColor" opacity={0.5} />
            <YAxis axisLine={false} tickLine={false} dx={-10} fontSize={10} stroke="currentColor" opacity={0.5} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
              cursor={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="currentColor" 
              strokeWidth={3} 
              dot={{ r: 4, fill: 'currentColor' }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
              className="text-black dark:text-white"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CampaignChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={campaignData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={12} stroke="currentColor" opacity={0.5} />
          <YAxis axisLine={false} tickLine={false} dx={-10} fontSize={12} stroke="currentColor" opacity={0.5} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: 'none', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            cursor={{ fill: 'currentColor', opacity: 0.05 }}
          />
          <Bar dataKey="clicks" fill="currentColor" radius={[4, 4, 0, 0]} className="text-slate-300 dark:text-slate-300 dark:text-white/20" />
          <Bar dataKey="conversions" fill="currentColor" radius={[4, 4, 0, 0]} className="text-black dark:text-white" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

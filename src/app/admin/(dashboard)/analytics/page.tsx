"use client";

import { BarChart as BarChartIcon, TrendingUp, Users, MousePointerClick, Calendar, ArrowUpRight, Download, Globe, Smartphone, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("http://localhost:5000/api/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const visitorsData = analytics.map(a => ({
    name: new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' }),
    visitors: a.visitors,
    bounce: Math.floor(a.visitors * (parseFloat(a.bounce_rate) / 100))
  })).reverse().slice(-7);

  const totalVisitors = analytics.reduce((acc, curr) => acc + curr.visitors, 0);
  const avgBounce = analytics.length > 0 ? (analytics.reduce((acc, curr) => acc + parseFloat(curr.bounce_rate), 0) / analytics.length).toFixed(1) : 0;
  
  const sourceData = [
    { name: 'Google Ads', value: 45 },
    { name: 'Organic Search', value: 25 },
    { name: 'Social Media', value: 20 },
    { name: 'Direct', value: 10 },
  ];

  const deviceData = analytics.length > 0 ? [
    { name: 'Desktop', value: Math.round((analytics[0].device_desktop / analytics[0].visitors) * 100) },
    { name: 'Mobile', value: Math.round((analytics[0].device_mobile / analytics[0].visitors) * 100) },
    { name: 'Tablet', value: Math.round((analytics[0].device_tablet / analytics[0].visitors) * 100) },
  ] : [
    { name: 'Desktop', value: 65 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 5 },
  ];

  const geoData = [
    { name: 'USA', value: 4200 },
    { name: 'India', value: 3800 },
    { name: 'UK', value: 2100 },
    { name: 'Canada', value: 1500 },
    { name: 'Germany', value: 900 },
  ];

  const COLORS = ['#0f172a', '#3b82f6', '#06b6d4', '#e2e8f0'];

  const handleExportCSV = () => {
    const headers = ["Day", "Visitors", "Bounce"];
    const csvContent = [
      headers.join(","),
      ...visitorsData.map(d => `${d.name},${d.visitors},${d.bounce}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Traffic & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your landing page performance and audience data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white dark:bg-[#0f0f0f] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 pl-10 pr-10 py-2.5 rounded-xl font-medium text-sm outline-none cursor-pointer focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <ArrowUpRight size={14} className="rotate-90" />
            </div>
          </div>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl font-medium hover:scale-105 transition-transform shadow-md"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unique Visitors</p>
            <p className="text-3xl font-bold mt-1">{totalVisitors.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 flex items-center font-medium mt-1">
              +18.4% <ArrowUpRight size={12} className="ml-0.5" /> <span className="text-slate-400 ml-1 font-normal">REAL TIME FEED</span>
            </p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <MousePointerClick size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Click Rate</p>
            <p className="text-3xl font-bold mt-1">12.5%</p>
            <p className="text-xs text-emerald-500 flex items-center font-medium mt-1">
              +2.1% <ArrowUpRight size={12} className="ml-0.5" /> <span className="text-slate-400 ml-1 font-normal">vs last month</span>
            </p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Bounce Rate</p>
            <p className="text-3xl font-bold mt-1">{avgBounce}%</p>
            <p className="text-xs text-red-500 flex items-center font-medium mt-1">
              +4.5% <ArrowUpRight size={12} className="ml-0.5" /> <span className="text-slate-400 ml-1 font-normal">AVG ACROSS NETWORK</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-[400px]">
          <h2 className="font-semibold text-lg mb-6">Traffic Overview (7 Days)</h2>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={12} stroke="currentColor" opacity={0.5} />
                <YAxis axisLine={false} tickLine={false} dx={-10} fontSize={12} stroke="currentColor" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-[400px]">
          <h2 className="font-semibold text-lg mb-2">Traffic Sources</h2>
          <div className="flex-1 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sourceData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2"><Globe size={20}/> Traffic by Region</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} stroke="currentColor" opacity={0.7} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
          <h2 className="font-semibold text-lg mb-6">Device Distribution</h2>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {deviceData.map((device, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{device.name}</span>
                  <span>{device.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${device.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

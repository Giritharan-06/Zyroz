"use client";

import { Share2, Plus, MessageSquare, Heart, RefreshCw, MessageCircle, Camera, Briefcase, Send, Image as ImageIcon, Calendar, Clock, BarChart3, MoreHorizontal, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function SocialMediaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("http://localhost:5000/api/social/posts");
        if (res.ok) {
          const data = await res.json();
          const formatted = data.posts.map((p: any) => ({
            id: p.id,
            content: p.content,
            channels: [p.platform.substring(0, 2).toUpperCase()],
            status: p.status,
            time: new Date(p.scheduled_for).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
          }));
          setScheduledPosts(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8 pt-2 sm:pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold font-sans">Social Command Center</h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">Orchestrate and monitor your multi-channel social strategy.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1a91da] text-white px-5 py-3.5 sm:py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} />
          Craft New Post
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Followers</p>
            <p className="text-3xl font-bold font-sans tracking-tight">12,450</p>
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
               <RefreshCw size={10} className="animate-spin-slow" /> +420 this week
            </p>
          </div>
          <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] text-slate-100 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-500">
             <Share2 size={100} strokeWidth={1} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Engagement</p>
            <p className="text-3xl font-bold font-sans tracking-tight text-pink-500">4.8%</p>
            <div className="w-full h-1 bg-slate-100 dark:bg-white/10 rounded-full mt-3">
               <div className="w-[48%] h-full bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
            </div>
          </div>
          <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] text-pink-500/5 group-hover:text-pink-500/10 transition-colors duration-500">
             <Heart size={100} strokeWidth={1} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mentions</p>
            <p className="text-3xl font-bold font-sans tracking-tight text-blue-500">142</p>
            <p className="text-[10px] text-blue-400 font-bold mt-2">Active now: 4</p>
          </div>
          <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] text-blue-500/5 group-hover:text-blue-500/10 transition-colors duration-500">
             <MessageSquare size={100} strokeWidth={1} />
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audience Reach</p>
            <p className="text-3xl font-bold font-sans tracking-tight text-amber-500">85K</p>
            <p className="text-[10px] text-amber-500 font-bold mt-2">Top Region: USA</p>
          </div>
          <div className="absolute top-1/2 right-[-10%] translate-y-[-50%] text-amber-500/5 group-hover:text-amber-500/10 transition-colors duration-500">
             <BarChart3 size={100} strokeWidth={1} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Channels */}
        <div className="bg-white dark:bg-[#0f0f0f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm h-fit">
           <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-500">
                 <RefreshCw size={14} className="text-blue-500" />
                 Connected Channels
              </h2>
              <button className="text-[10px] font-bold text-blue-500 hover:underline">Manage</button>
           </div>
           <div className="p-2 divide-y divide-slate-100 dark:divide-white/5">
              {[
                { name: "Facebook", icon: <MessageCircle size={16} />, status: "Connected", color: "bg-blue-600", handle: "@zyroz_agency" },
                { name: "Instagram", icon: <Camera size={16} />, status: "Connected", color: "bg-pink-600", handle: "@zyroz_daily" },
                { name: "LinkedIn", icon: <Briefcase size={16} />, status: "Disconnected", color: "bg-slate-300 dark:bg-white/10", handle: "-" },
                { name: "X (Twitter)", icon: <Send size={16} />, status: "Connected", color: "bg-black dark:bg-white", handle: "@ZyrozHQ" },
              ].map((channel, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${channel.color} ${channel.name === 'X (Twitter)' && 'dark:text-black text-white'} rounded-xl flex items-center justify-center text-white shadow-md`}>
                        {channel.icon}
                      </div>
                      <div>
                         <p className="text-sm font-bold">{channel.name}</p>
                         <p className="text-[10px] text-slate-500">{channel.handle}</p>
                      </div>
                   </div>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${channel.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {channel.status}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* Scheduled Posts */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4 mb-4">
              <h2 className="font-bold text-xl">Queue / Calendar</h2>
              <div className="flex p-1 gap-1 bg-slate-100 dark:bg-white/5 rounded-xl self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-white dark:bg-[#1a1a1a] shadow-sm rounded-lg text-black dark:text-white transition-all whitespace-nowrap">List View</button>
                 <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white transition-all rounded-lg whitespace-nowrap">Month</button>
                 <button className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white transition-all rounded-lg whitespace-nowrap">Week</button>
              </div>
           </div>

           {scheduledPosts.length > 0 ? scheduledPosts.map((post) => (
             <div key={post.id} className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-blue-500 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex flex-wrap gap-2">
                      {post.channels.map((ch: string) => (
                        <div key={ch} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                           {ch}
                        </div>
                      ))}
                   </div>
                   <button className="text-slate-400 hover:text-black dark:hover:text-white p-1"><MoreHorizontal size={18} /></button>
                </div>
                <p className="text-sm leading-relaxed mb-6 text-slate-700 dark:text-slate-300">"{post.content}"</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                         <Calendar size={14} className="text-blue-500" />
                         {post.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                         <ImageIcon size={14} className="text-pink-500" />
                         2 Assets
                      </div>
                   </div>
                   <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-bold ${
                     post.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                   }`}>
                     {post.status}
                   </span>
                </div>
             </div>
           )) : (
             <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
               <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
               <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No scheduled posts found.</p>
               <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Check back later or schedule a new post.</p>
             </div>
           )}

           <div className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 text-center flex flex-col items-center justify-center bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => setIsModalOpen(true)}>
               <div className="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3 border border-slate-200 dark:border-white/10">
                 <Plus size={24} className="text-blue-500" />
               </div>
               <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Schedule another post</p>
               <p className="text-xs text-slate-400 mt-1">Keep your audience engaged across all networks</p>
           </div>
        </div>
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col border border-slate-200 dark:border-white/10 animate-in zoom-in-95 fill-mode-both duration-300">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-md">
               <div>
                  <h2 className="text-xl sm:text-2xl font-black italic tracking-tight">CRAFT NEW POST</h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-1 truncate max-w-[200px] sm:max-w-none">Multi-Channel Broadcast System</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 text-slate-400 shadow-sm">&times;</button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
               {/* Platform Picker */}
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Target Channels</p>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                     {[
                       { name: "Facebook", icon: <MessageCircle size={18} />, color: "border-blue-600 bg-blue-600 text-white" },
                       { name: "Instagram", icon: <Camera size={18} />, color: "border-pink-600 bg-pink-600 text-white" },
                       { name: "LinkedIn", icon: <Briefcase size={18} />, color: "border-slate-300 bg-slate-300 text-slate-500 opacity-60" },
                       { name: "Twitter", icon: <Send size={18} />, color: "border-black bg-black dark:bg-white text-white dark:text-black" },
                     ].map((plat, i) => (
                       <button key={i} className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl border-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${plat.color}`}>
                          {plat.icon}
                          <span>{plat.name}</span>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Editor */}
               <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-sm min-h-[120px] sm:min-h-[160px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Write something engaging..."
                    ></textarea>
                    <div className="absolute bottom-4 right-5 sm:right-6 text-[10px] font-black text-slate-400">0 / 280</div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                     <button className="flex items-center justify-center gap-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
                        <ImageIcon size={18} className="text-slate-400 group-hover:text-blue-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Add Media Assets</span>
                     </button>
                     <button className="flex items-center justify-center gap-2 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-pink-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
                        <UserCheck size={18} className="text-slate-400 group-hover:text-pink-500" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400">Tag Influencers</span>
                     </button>
                  </div>
               </div>

               {/* Scheduling */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Post Date</p>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium outline-none cursor-text sm:cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
                     </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time (EST)</p>
                     <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="time" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium outline-none cursor-text sm:cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-auto">
               <button onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3.5 sm:py-3 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors uppercase tracking-widest text-center">Discard</button>
               <button className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl text-xs font-bold shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                  <Send size={16} /> Schedule Post
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

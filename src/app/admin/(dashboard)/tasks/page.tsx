"use client";

import { CheckSquare, Clock, Calendar, Plus, PlusCircle, Search, Edit, Trash2, User, AlertCircle, BarChart3, Target, Zap, ChevronRight, Filter, MoreVertical, Archive } from "lucide-react";
import { useState, useEffect } from "react";

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Remove this operational objective?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      due: formData.get("due"),
      priority: formData.get("priority"),
      category: formData.get("category"),
      description: formData.get("description"),
      assigned_to: formData.get("assigned_to"),
      estimated_hours: formData.get("estimated_hours"),
      client: formData.get("client") || "Internal",
      status: "Pending"
    };

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tasksDoneToday = tasks.filter(t => t.status === "Done").length; // Mock logic
  const totalEstHours = tasks.reduce((acc, t) => acc + (parseFloat(t.estimated_hours) || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Project & Task Board</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Orchestrate your agency's workload with precision.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl active:scale-95">
          <Plus size={20} />
          New Master Task
        </button>
      </div>

      {/* Workload KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Backlog</p>
              <p className="text-3xl font-bold mt-1 tracking-tighter">{tasks.length}</p>
           </div>
           <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Archive size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completed Today</p>
              <p className="text-3xl font-bold mt-1 tracking-tighter text-emerald-500">{tasksDoneToday}</p>
           </div>
           <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CheckSquare size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimated Effort</p>
              <p className="text-3xl font-bold mt-1 tracking-tighter text-indigo-500">{totalEstHours}h</p>
           </div>
           <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Clock size={24} /></div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20">
           <div className="flex justify-between items-start">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Efficiency Index</p>
             <Zap size={14} className="text-yellow-400" />
           </div>
           <p className="text-3xl font-bold mt-1 tracking-tighter">94%</p>
           <div className="w-full h-1 bg-white/20 rounded-full mt-3">
              <div className="w-[94%] h-full bg-white rounded-full"></div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-[#0f0f0f] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search task vault..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="SEO">SEO Mastery</option>
            <option value="Content Writing">Content Hub</option>
            <option value="Web Dev">Engineering</option>
            <option value="Client Meeting">Stakeholder Call</option>
            <option value="Social Media">Social Buzz</option>
          </select>
        </div>
        <button 
          onClick={async () => {
             if(confirm("Are you sure you want to clear all 'Done' tasks?")) {
               setTasks(prev => prev.filter(t => t.status !== "Done"));
             }
          }}
          className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          Archive Done
        </button>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-black dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["Pending", "In Progress", "Done"]).map((columnStatus) => (
          <div key={columnStatus} className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-6 flex flex-col h-[calc(100vh-280px)] border border-slate-200 dark:border-white/10 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-sm uppercase tracking-[0.2em] italic text-slate-500 flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${columnStatus === 'Pending' ? 'bg-amber-500' : columnStatus === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                {columnStatus}
                <span className="text-[10px] bg-white dark:bg-white/10 px-2 py-0.5 rounded-full border border-slate-100 dark:border-white/5">
                  {tasks.filter(t => t.status === columnStatus || (columnStatus === "Pending" && !["In Progress", "Done"].includes(t.status))).length}
                </span>
              </h3>
              <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl shadow-sm text-slate-400"><MoreVertical size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {tasks.filter(t => {
                const matchesSearch = (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
                const matchesStatus = t.status === columnStatus || (columnStatus === "Pending" && !["In Progress", "Done"].includes(t.status));
                return matchesSearch && matchesCategory && matchesStatus;
              }).map((task) => (
                <div key={task.id} className="bg-white dark:bg-[#0f0f0f] border-2 border-transparent hover:border-black dark:hover:border-white p-5 rounded-[28px] shadow-sm cursor-grab active:cursor-grabbing transition-all group relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none -mr-4 -mt-4 rotate-12`}>
                      <BarChart3 size={60} />
                   </div>
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm ${task.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                      {task.priority || 'Normal'}
                    </span>
                    <div className="flex gap-2">
                       <button onClick={() => {
                         const nextStatusMap: any = { 'Pending': 'In Progress', 'In Progress': 'Done', 'Done': 'Pending' };
                         handleUpdateStatus(task.id, nextStatusMap[task.status] || 'Pending');
                       }} className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-300 hover:text-indigo-500 transition-colors"><ChevronRight size={14}/></button>
                       <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <h4 className="font-black text-lg tracking-tight mb-2 uppercase italic leading-none group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mb-4 line-clamp-2 leading-tight uppercase tracking-wide">Client: {task.client || 'Internal'}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-[10px] font-black bg-slate-50 dark:bg-white/10 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5 uppercase tracking-widest text-slate-500">{task.category || "General"}</span>
                    {task.estimated_hours && <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-lg border border-indigo-500/10 uppercase tracking-widest">{task.estimated_hours}h cap</span>}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Clock size={14} className="text-amber-500" />
                      {task.due || 'ASAP'}
                    </div>
                    <div className="flex items-center gap-2 pl-3 py-1 pr-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.assigned_to || "Admin"}</span>
                      <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-[10px] font-black flex items-center justify-center text-white dark:text-black border-2 border-white dark:border-black">
                        {(task.assigned_to || "[")[0].toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === columnStatus || (columnStatus === "Pending" && !["In Progress", "Done"].includes(t.status))).length === 0 && (
                <div className="h-40 border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center text-center opacity-30 grayscale p-6">
                  <Archive size={40} className="mb-2" />
                  <p className="text-xs font-black uppercase tracking-widest leading-none">Safe Stream Clear.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <div>
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">ORCHESTRATE TASK</h2>
                 <p className="text-[10px] text-slate-400 font-mono mt-1">Agency Workload Matrix v2.2</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 shadow-sm">&times;</button>
            </div>
            <form onSubmit={handleSaveTask}>
              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Essence</label>
                  <input name="title" required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white shadow-inner" placeholder="e.g. Lead Follow-up for Summer Launch" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client / Context</label>
                     <input name="client" type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Asset</label>
                    <select name="assigned_to" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold outline-none cursor-pointer">
                      <option>Admin Principal</option>
                      <option>John (Design)</option>
                      <option>Sarah (SEO)</option>
                      <option>Mike (Dev Ops)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Domain Cluster</label>
                    <select name="category" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold cursor-pointer">
                      <option>SEO Mastery</option>
                      <option>Content Hub</option>
                      <option>Engineering</option>
                      <option>Stakeholder Call</option>
                      <option>Lead Follow-up</option>
                      <option>Social Buzz</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority Vector</label>
                    <select name="priority" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold cursor-pointer text-red-500">
                      <option>High (CRITICAL)</option>
                      <option>Medium (NORMAL)</option>
                      <option>Low (BUFFER)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline Sync</label>
                    <input name="due" required type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold shadow-sm" placeholder="Today, 5 PM" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hours Cap (Est.)</label>
                    <input name="estimated_hours" type="number" step="0.5" className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold" placeholder="2.5" />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Intel</label>
                   <textarea name="description" rows={3} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl text-xs font-bold resize-none outline-none focus:ring-2 focus:ring-black" placeholder="Define tactical objectives..."></textarea>
                </div>
              </div>
              <div className="p-10 border-t border-slate-200 dark:border-white/10 flex justify-end gap-4 bg-slate-50 dark:bg-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Abort</button>
                <button type="submit" className="flex-1 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl text-sm font-black shadow-2xl hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
                   🚀 Deploy Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Plus, Zap, Target, Shield, Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function LaunchOpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
      >
        <Plus size={20}/> Launch Op
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col border border-white/20 overflow-hidden animate-in zoom-in-95 fill-mode-both duration-300">
             <div className="p-8 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">TACTICAL LAUNCH</h2>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Select operation module to initialize</p>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 shadow-sm">&times;</button>
             </div>
             
             <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { label: "Deploy Fast Ad", desc: "Push new creative to Ad Networks", route: "/admin/campaigns", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                 { label: "Ingest Lead", desc: "Manually insert contact entity", route: "/admin/leads", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
                 { label: "Email Broadcast", desc: "Queue a new newsletter drop", route: "/admin/email", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                 { label: "SEO Deep Audit", desc: "Trigger site-wide crawl", route: "/admin/seo", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
               ].map((op, i) => (
                 <Link key={i} href={op.route} onClick={() => setIsOpen(false)} className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-black dark:hover:border-white transition-all group">
                    <div className={`p-4 rounded-2xl ${op.bg} ${op.color} group-hover:scale-110 transition-transform`}>
                       <op.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-sm mb-1">{op.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{op.desc}</p>
                    </div>
                 </Link>
               ))}
             </div>
             
             <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">All actions are logged in Audit Flux</p>
             </div>
          </div>
        </div>
      )}
    </>
  );
}

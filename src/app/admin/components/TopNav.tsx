"use client";

import { Search, Bell } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { useState, useEffect } from "react";

export default function TopNav() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`http://localhost:5000/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data.settings || {});
        }
      } catch (err) {
        console.error("Failed to fetch settings in TopNav:", err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <header className="h-20 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-200 dark:border-white/10 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex-1 max-w-xl hidden md:flex items-center group">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search leads, campaigns..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-brand/5 dark:bg-white/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">

        <div className="relative">
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-brand/10 dark:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f0f0f]"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-gray-200 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 border-b border-slate-200 dark:border-gray-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-brand/5 dark:bg-white/5">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-4 border-b border-slate-200 dark:border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 cursor-pointer">
                  <p className="text-sm font-medium mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-brand-accent"></span>New Lead Received!</p>
                  <p className="text-xs text-slate-500">John Doe just requested a website quote.</p>
                  <p className="text-[10px] text-slate-400 mt-2">Just now</p>
                </div>
                <div className="p-4 border-b border-slate-200 dark:border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 cursor-pointer">
                  <p className="text-sm font-medium mb-1">Campaign Alert</p>
                  <p className="text-xs text-slate-500">Q3 Meta Ads reached 50% budget limit.</p>
                  <p className="text-[10px] text-slate-400 mt-2">2 hours ago</p>
                </div>
              </div>
              <div className="p-3 text-center border-t border-slate-200 dark:border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-brand/5 dark:bg-white/5 disabled">
                <button className="text-xs font-semibold text-brand-accent hover:underline">Mark all as read</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-brand/10 dark:bg-white/10 mx-2 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-brand/5 dark:bg-white/5 p-1.5 rounded-full transition-colors pr-4">
          <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm shadow-sm overflow-hidden">
            {siteSettings.admin_avatar_url ? (
               <img src={siteSettings.admin_avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <>{siteSettings.admin_first_name ? siteSettings.admin_first_name[0] : "A"}{siteSettings.admin_last_name ? siteSettings.admin_last_name[0] : "D"}</>
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none">{siteSettings.admin_first_name || "Admin"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Platform Manager</p>
          </div>
        </div>
        
        <LogoutButton />
      </div>
    </header>
  );
}

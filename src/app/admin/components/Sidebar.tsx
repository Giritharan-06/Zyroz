"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Megaphone, Image as ImageIcon, CheckSquare, BarChart, Settings, Menu, X, Zap, Mail, Share2, FileText, FileBarChart } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Email Marketing", href: "/admin/email", icon: Mail },
    { name: "Social Media", href: "/admin/social", icon: Share2 },
    { name: "SEO & Content", href: "/admin/seo", icon: FileText },
    { name: "Reports", href: "/admin/reports", icon: FileBarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-black text-white rounded-full shadow-2xl"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        fixed md:static inset-y-0 left-0 z-40 bg-white/60 dark:bg-black/40 backdrop-blur-md border-r border-slate-200 dark:border-gray-200 dark:border-white/10
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-64"}
        flex flex-col
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-gray-200 dark:border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <img 
              src="/DigiPulse_logo.jpeg" 
              alt="Zyroz Agency Logo" 
              className="h-10 w-auto rounded-lg object-contain"
            />
            {!isCollapsed && <span className="font-heading font-bold text-xl tracking-tight">Zyroz Agency</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 relative">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md shadow-black/10" 
                    : "text-slate-500 hover:text-black hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-brand/5 dark:bg-white/5"}
                `}
              >
                <Icon size={20} className={`shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{link.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50">
                    {link.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-gray-200 dark:border-white/10 shrink-0 hidden md:block">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-brand/5 dark:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-transparent text-slate-900 dark:text-white font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth will-change-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}

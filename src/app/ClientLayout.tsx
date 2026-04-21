"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CursorGlow from "@/components/animations/CursorGlow";
import ScrollProgress from "@/components/animations/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow z-10 w-full">{children}</main>;
  }

  return (
    <>
      {/* Animated Background Gradients restricted to marketing pages */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 dark:bg-white/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/5 dark:bg-white/5 rounded-full blur-[128px]" />
      </div>
      
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow z-10">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/DigiPulse_logo.jpeg" 
              alt="Zyroz Agency Logo" 
              className="h-10 w-auto rounded-lg object-contain"
            />
            <span className="text-2xl font-heading font-bold tracking-tighter hidden sm:block text-slate-900 dark:text-white">
              ZYROZ <span className="text-slate-500 dark:text-slate-600 dark:text-white/60">AGENCY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors hover:text-black dark:hover:text-white ${
                  pathname === link.href ? "text-slate-900 dark:text-white font-medium" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {link.label}
              </Link>
            ))}



            <Link
              href="/contact"
              className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black text-sm font-medium rounded-full hover:bg-slate-800 dark:hover:bg-white/90 transition-transform active:scale-95 shadow-md"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">

            <button
              className="text-slate-900 dark:text-white reset-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white/98 dark:bg-[#0f0f0f]/98 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 p-6 md:hidden flex flex-col gap-4 shadow-2xl z-50"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium transition-colors ${
                pathname === link.href ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black text-center font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            Get Started
          </Link>
        </motion.div>
      )}
    </header>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function CaseStudies() {
  const cases = [
    { client: "Aura E-Commerce", service: "Ads & Website Reset", result: "+340% ROAS in 90 Days" },
    { client: "Nexus B2B Tech", service: "AI Automations & Outbound", result: "1,200 New Leads / Mo" },
    { client: "Luxe Real Estate", service: "Video & Meta Ads", result: "Sold $12M Inventory" },
    { client: "FinTech Pro", service: "SEO & Content Marketing", result: "+200k Organic Traffic" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">Case <span className="text-gradient">Studies</span></h1>
          <p className="text-xl text-slate-600 dark:text-white/60">Data-backed results from brands that decided to evolve.</p>
        </div>

        <div className="space-y-6">
          {cases.map((c, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-brand/10 dark:bg-white/10 transition-colors group cursor-pointer"
            >
              <div>
                <h3 className="text-3xl font-bold font-heading mb-2">{c.client}</h3>
                <p className="text-brand-accent font-medium mb-4">{c.service}</p>
                <div className="px-4 py-2 bg-brand/10 dark:bg-white/10 rounded-full inline-block text-sm">
                  Result: <span className="text-white font-bold">{c.result}</span>
                </div>
              </div>
              <Link href="/contact" className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ArrowUpRight size={24} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

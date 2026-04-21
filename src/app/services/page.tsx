"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

export default function Services() {
  const services = [
    { title: "Website Development", desc: "Next.js & Framer Motion tailored premium web applications." },
    { title: "SEO Optimization", desc: "Technical & On-page optimization ensuring top rankings on Google." },
    { title: "AI Automations", desc: "Custom AI agents & automations replacing repetitive tasks." },
    { title: "Lead Generation", desc: "End-to-end setups to capture B2B and B2C clients effectively." },
    { title: "Meta Ads & Google Ads", desc: "Multi-platform ad management prioritizing scale & ROAS." },
    { title: "Social Media Marketing", desc: "Full-stack organic growth strategies for Instagram & LinkedIn." },
    { title: "Video Production", desc: "High-end commercial shoots and quick-form TikTok/Reel edits." },
    { title: "Email Marketing", desc: "Automated drip sequences to nurture and convert cold leads." },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">Premium <span className="text-gradient">Services</span></h1>
          <p className="text-xl text-slate-600 dark:text-white/60">An elite stack of digital solutions designed to position your brand at the absolute pinnacle of your industry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl group"
            >
              <Zap size={32} className="text-brand-accent mb-6" />
              <h3 className="text-2xl font-bold font-heading mb-4">{svc.title}</h3>
              <p className="text-slate-600 dark:text-white/60 mb-6">{svc.desc}</p>
              <ul className="space-y-3">
                {[1, 2, 3].map((_, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-800 dark:text-white/80">
                    <CheckCircle2 size={16} className="text-brand-accent" />
                    Premium Delivery Guarantee
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

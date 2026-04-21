"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">Redefining <span className="text-gradient">Digital</span> Excellence</h1>
            <p className="text-xl text-slate-600 dark:text-white/60 mb-8 leading-relaxed">
              At Zyroz Agency, we don&apos;t just run ads or build basic sites. We architect fully integrated digital ecosystems powered by AI, premium design, and ruthless data analytics. We partner exclusively with brands that want to dominate.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-4xl font-bold mb-2">150+</p>
                <p className="text-slate-600 dark:text-white/60 text-sm">Brands Scaled</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">$50M+</p>
                <p className="text-slate-600 dark:text-white/60 text-sm">Client Revenue</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square glass rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black to-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-slate-300 dark:text-white/20 font-bold font-heading text-9xl">
              ZA.
            </div>
          </motion.div>
        </div>

        <div className="glass p-12 md:p-20 rounded-3xl text-center">
          <h2 className="text-4xl font-heading font-bold mb-8">Ready to Partner with the Best?</h2>
          <p className="text-xl text-slate-600 dark:text-white/60 mb-10 max-w-2xl mx-auto">
            Stop losing market share to competitors with better digital presence.
          </p>
          <a href="/contact" className="inline-block px-10 py-5 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
            Let&apos;s Build
          </a>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, BarChart, ChevronRight, Monitor, Rocket, Target, Zap } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/BGV.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-brand-accent/20 mb-8"
            >
              <Zap size={16} className="text-brand-accent" />
              <span className="text-sm font-medium tracking-wide">The New Standard of Digital Agencies</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-bold tracking-tighter leading-tight mb-6"
            >
              Powering Brands with <br className="hidden md:block"/>
              <span className="text-gradient">Digital Intelligence</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-600 dark:text-white/60 mb-10 max-w-2xl mx-auto font-sans"
            >
              AI-Driven Marketing. Premium Website Building. Lead Generation That Converts. We craft digital experiences that scale top-tier brands.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-brand text-white font-medium rounded-full hover:bg-emerald-600 border border-transparent transition-all flex items-center justify-center gap-2 group duration-300 shadow-md">
                Get Free Strategy Call
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/services" className="w-full sm:w-auto px-8 py-4 bg-black text-white border border-gray-200 dark:border-gray-300 dark:border-white/20 font-medium rounded-full hover:bg-gray-800 transition-all flex items-center justify-center gap-2 duration-300">
                View Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Premium <span className="text-brand-accent text-gradient">Services</span></h2>
            <p className="text-slate-600 dark:text-slate-600 dark:text-white/60 text-lg max-w-2xl">Engineered for luxury brands outcompeting the market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Monitor className="mb-4 text-brand-accent" size={32} />, title: "Website Development", desc: "Ultra-fast, animated, premium digital platforms." },
              { icon: <Target className="mb-4 text-brand-accent" size={32} />, title: "SEO Optimization", desc: "Dominate search results with AI-backed SEO." },
              { icon: <Rocket className="mb-4 text-brand-accent" size={32} />, title: "Lead Generation", desc: "High-converting funnels that fill your pipeline." },
              { icon: <BarChart className="mb-4 text-brand-accent" size={32} />, title: "Ads Management", desc: "Meta & Google campaigns tuned for high ROAS." },
              { icon: <Zap className="mb-4 text-brand-accent" size={32} />, title: "AI Automations", desc: "Streamline workflows and save 100+ hours monthly." },
              { icon: <ChevronRight className="mb-4 text-brand-accent" size={32} />, title: "Content & Video", desc: "High-end video production and social management." }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl group cursor-pointer"
              >
                <div className="transform group-hover:-translate-y-2 transition-transform duration-300">
                  {service.icon}
                  <h3 className="text-xl font-heading font-semibold mb-3">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-600 dark:text-white/60 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Zyroz Agency & Process */}
      <section className="py-32 bg-slate-50 dark:bg-black/50 border-y border-gray-200 dark:border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Process & <span className="text-gradient">Strategy</span></h2>
              <ul className="space-y-8">
                {[
                  { step: "01", title: "Strategy", desc: "Deep dive audit into your brand architecture and competitive landscape." },
                  { step: "02", title: "Build", desc: "Execution of premium assets, scalable websites, and tailored ad funnels." },
                  { step: "03", title: "Launch", desc: "Deploying high-impact campaigns with targeted data pipelines." },
                  { step: "04", title: "Scale", desc: "AI-driven optimization to lower CPA and maximize your LTV." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 group">
                    <span className="text-2xl font-heading font-bold text-slate-300 dark:text-slate-300 dark:text-white/20 group-hover:text-brand dark:group-hover:text-white transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-600 dark:text-white/60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 dark:bg-brand/5 dark:bg-white/5 rounded-full blur-[64px]" />
              <h3 className="text-3xl font-heading font-bold mb-6 relative z-10">Why Zyroz Agency?</h3>
              <ul className="space-y-4 relative z-10">
                {["AI Driven Marketing", "Conversion Focused Strategy", "Premium Creative Design", "Data Driven Decisions", "Automated Workflows"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand/40 dark:bg-white/40" />
                    <span className="text-lg font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] bg-brand/5 dark:bg-brand/5 dark:bg-white/5 rounded-full blur-[128px]" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8">Ready to outclass your competition?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-600 dark:text-white/60 mb-10">Book a free strategy call to see how our luxury digital framework can multiply your revenue.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-brand text-white font-medium rounded-full text-lg hover:scale-105 hover:bg-emerald-600 transition-all duration-300 group shadow-lg">
            Get Free Marketing Plan
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

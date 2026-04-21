"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
    const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "Contact Page",
          score: 85
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">Let&apos;s talk about <br /><span className="text-gradient">Scaling Your Brand</span></h1>
          <p className="text-xl text-slate-600 dark:text-white/60">Fill out the brief form below and our strategy team will be in touch within 24 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-8 rounded-3xl">
              <h3 className="text-2xl font-heading font-bold mb-8">Contact Info</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white/80">Email Us</h4>
                    <p className="text-slate-600 dark:text-white/60 mt-1">
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=zyrozagency@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-accent transition-colors"
                      >
                        zyrozagency@gmail.com
                      </a>
                    </p>
                  </div>
                </li>
                {/* <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-brand-accent"/>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white/80">Call Us</h4>
                    <p className="text-slate-600 dark:text-white/60 mt-1">+1 (555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-brand-accent"/>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white/80">Headquarters</h4>
                    <p className="text-slate-600 dark:text-white/60 mt-1">100 Innovation Drive,<br/>Tech District, NY 10001</p>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Premium Form */}
          <div className="lg:col-span-8 glass p-8 md:p-12 rounded-3xl">
            {submitted ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 size={80} className="text-brand-accent mb-6" />
                </motion.div>
                <h2 className="text-3xl font-heading font-bold mb-4">Request Received!</h2>
                <p className="text-slate-600 dark:text-white/60 text-lg">Thank you. We will arrange your free marketing plan shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Name</label>
                    <input required name="name" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Company Name</label>
                    <input required name="company" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="Acme Corp" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Email</label>
                    <input required type="email" name="email" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Phone</label>
                    <input required name="phone" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Service Interested</label>
                    <select required name="service" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none">
                      <option value="Website Development">Website Development</option>
                      <option value="SEO Optimization">SEO Optimization</option>
                      <option value="Lead Generation">Lead Generation</option>
                      <option value="Meta & Google Ads">Meta & Google Ads</option>
                      <option value="AI Automations">AI Automations</option>
                      <option value="Video Production">Video Production</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Budget Range</label>
                    <select required name="budget" className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none">
                      <option value="$1k - $5k">$1,000 - $5,000</option>
                      <option value="$5k - $10k">$5,000 - $10,000</option>
                      <option value="$10k+">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Message Details</label>
                  <textarea name="message" rows={4} className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" placeholder="Tell us about your project goals..." />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group text-lg mt-8"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Get Free Marketing Plan"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

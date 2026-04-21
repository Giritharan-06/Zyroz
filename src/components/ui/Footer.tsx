"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<any>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`http://localhost:5000/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSocialLinks(data.settings || {});
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    }
    fetchSettings();
  }, []);

  const getSocialTag = (url: string, defaultTag: string) => {
    if (!url) return "";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("facebook.com") || lowerUrl.includes("fb.me")) return "FB";
    if (lowerUrl.includes("instagram.com") || lowerUrl.includes("ig.me")) return "IG";
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com") || lowerUrl.includes("t.co")) return "X";
    if (lowerUrl.includes("linkedin.com")) return "IN";
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "YT";
    if (lowerUrl.includes("tiktok.com")) return "TK";
    if (lowerUrl.includes("pinterest.com")) return "PT";
    if (lowerUrl.includes("github.com")) return "GH";
    if (lowerUrl.includes("vimeo.com")) return "VM";
    return defaultTag;
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-black/50 backdrop-blur-xl pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 border-r border-gray-200 dark:border-white/10 pr-6">
            <Link href="/" className="text-3xl font-heading font-bold tracking-tighter mb-6 block">
              ZYROZ <br /><span className="text-slate-600 dark:text-white/60">AGENCY</span>
            </Link>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed mb-6">
              AI-driven digital marketing agency building premium experiences and generating scalable leads.
            </p>
            <div className="flex gap-4">
              {socialLinks.social_twitter && (
                <a href={ensureAbsoluteUrl(socialLinks.social_twitter)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-white/60 hover:text-white hover:border-brand-accent transition-all">
                  {getSocialTag(socialLinks.social_twitter, "X")}
                </a>
              )}
              {socialLinks.social_linkedin && (
                <a href={ensureAbsoluteUrl(socialLinks.social_linkedin)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-white/60 hover:text-white hover:border-brand-accent transition-all">
                  {getSocialTag(socialLinks.social_linkedin, "IN")}
                </a>
              )}
              {socialLinks.social_instagram && (
                <a href={ensureAbsoluteUrl(socialLinks.social_instagram)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-white/60 hover:text-white hover:border-brand-accent transition-all">
                  {getSocialTag(socialLinks.social_instagram, "IG")}
                </a>
              )}
              {socialLinks.social_facebook && (
                <a href={ensureAbsoluteUrl(socialLinks.social_facebook)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-white/60 hover:text-white hover:border-brand-accent transition-all">
                  {getSocialTag(socialLinks.social_facebook, "FB")}
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-6">Services</h4>
            <ul className="space-y-3 flex flex-col">
              <Link href="/services" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Website Development</Link>
              <Link href="/services" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">SEO Optimization</Link>
              <Link href="/services" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">AI Automations</Link>
              <Link href="/services" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Meta & Google Ads</Link>
              <Link href="/services" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Video Production</Link>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-6">Company</h4>
            <ul className="space-y-3 flex flex-col">
              <Link href="/about" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">About Us</Link>
              <Link href="/case-studies" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Case Studies</Link>
              <Link href="/contact" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Contact</Link>
              <Link href="/admin" className="text-slate-600 dark:text-white/60 hover:text-white transition-colors text-sm">Admin Access</Link>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 flex flex-col text-sm text-slate-600 dark:text-white/60">
              <li>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=zyrozagency@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-accent transition-colors"
                >
                  zyrozagency@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 dark:text-white/40 text-sm">© {new Date().getFullYear()} Zyroz Agency. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 dark:text-white/40 hover:text-slate-800 dark:text-white/80 text-sm">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 dark:text-white/40 hover:text-slate-800 dark:text-white/80 text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

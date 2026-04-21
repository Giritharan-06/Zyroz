"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Shield, Mail, Key, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid admin credentials");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  async function onForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsForgotLoading(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    if (forgotStep === 1) {
      setForgotStep(2);
    } else if (forgotStep === 2) {
      setForgotStep(3);
    } else {
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotSuccess(false);
      }, 3000);
    }
    setIsForgotLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-md w-full relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/20 rounded-full blur-[100px] -z-10" />
        
        <div className="text-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-4 mb-8">
            <img 
              src="/DigiPulse_logo.jpeg" 
              alt="Zyroz Agency Logo" 
              className="h-16 w-auto rounded-2xl shadow-2xl"
            />
            <div className="text-2xl font-heading font-bold">
              ZYROZ <span className="text-slate-600 dark:text-white/60">AGENCY</span>
            </div>
          </Link>
          <h1 className="text-3xl font-heading font-bold mb-2">Admin Portal</h1>
          <p className="text-slate-600 dark:text-white/60">Secure access for agency partners</p>
        </div>

        <form onSubmit={onSubmit} className="glass p-8 rounded-3xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Username</label>
            <input 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors" 
              placeholder="admin" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-600 dark:text-white/60 uppercase tracking-wide">Password</label>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-brand-accent hover:underline font-bold"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input 
                required 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors pr-12" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Access Dashboard"}
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 dark:text-white/40 mt-8">
          Protected route. Unauthorized access is strictly prohibited.
        </p>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-[#0f0f0f] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
              >
                <div className="p-8 pb-4 flex justify-between items-center text-black dark:text-white border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                   <h2 className="text-xl font-black italic uppercase tracking-tighter">Identity Reset</h2>
                   <button onClick={() => setShowForgotModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors bg-white dark:bg-white/5 text-slate-400">×</button>
                </div>

                <div className="p-8">
                  {forgotSuccess ? (
                    <div className="text-center py-8">
                       <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" />
                       <h3 className="text-2xl font-bold mb-2">Access Restored</h3>
                       <p className="text-slate-500 dark:text-white/60 text-sm">Your password has been updated. Redirecting to login...</p>
                    </div>
                  ) : (
                    <form onSubmit={onForgotSubmit} className="space-y-6">
                      {forgotStep === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                           <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-6">
                              <Mail size={24} />
                           </div>
                           <h3 className="text-xl font-bold">Lost your way?</h3>
                           <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">Enter your registered email and we&apos;ll broadcast a recovery code to your inbox.</p>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Email</label>
                             <input required type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-inner" placeholder="admin@zyroz.agency" />
                           </div>
                        </div>
                      )}

                      {forgotStep === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                              <Shield size={24} />
                           </div>
                           <h3 className="text-xl font-bold">Verification Phase</h3>
                           <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">A 6-digit synchronization code was sent to <b>{forgotEmail}</b>. Enter it below to proceed.</p>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Code (OTP)</label>
                             <div className="grid grid-cols-1 gap-4">
                                <input required maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="w-full text-center tracking-[1em] font-black text-2xl px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner" placeholder="000000" />
                             </div>
                           </div>
                        </div>
                      )}

                      {forgotStep === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                              <Key size={24} />
                           </div>
                           <h3 className="text-xl font-bold">New Matrix Definition</h3>
                           <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">Establish a new high-security password for your admin account.</p>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                             <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" placeholder="••••••••" />
                           </div>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={isForgotLoading}
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        {isForgotLoading ? <Loader2 className="animate-spin" size={18} /> : (
                          <>
                            {forgotStep === 1 && "Send Reset Link"}
                            {forgotStep === 2 && "Verify Code"}
                            {forgotStep === 3 && "Restore Access"}
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                      
                      {forgotStep > 1 && (
                        <button type="button" onClick={() => setForgotStep(forgotStep - 1)} className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black dark:hover:text-white transition-colors">Go Back</button>
                      )}
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

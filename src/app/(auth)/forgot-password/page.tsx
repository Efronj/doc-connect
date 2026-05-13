"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Mail, ArrowLeft, Send, ShieldCheck, MailCheck } from "lucide-react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!auth) {
      toast.error("Institutional auth service unavailable");
      setLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Security reset link dispatched.");
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate recovery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-stretch">
      
      {/* Left Side: Professional Backdrop */}
      <div className="hidden lg:flex w-[45%] relative bg-slate-900 overflow-hidden p-16 flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-64 -mt-64" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-900 group-hover:scale-110 transition-transform">
              <Stethoscope size={24} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">DoctorNet</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-8 text-balance">
              Secure <br />
              <span className="text-blue-500 italic">Credential</span> <br />
              Recovery.
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed mb-12">
              Our automated institutional security protocols will help you regain access to your clinical workspace.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Verified</span>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            All password reset requests are subject to institutional security audits to ensure HIPAA compliance.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[460px]"
        >
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Recover Access</h2>
            <p className="text-slate-500 font-medium text-lg">Regain control of your professional identity.</p>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="space-y-8"
              >
                <Input 
                  label="Registered Medical Email" 
                  type="email" 
                  placeholder="doctor@hospital.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-transparent focus:bg-white focus:border-blue-600"
                />
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-6 text-xl font-black rounded-2xl bg-blue-600 shadow-2xl shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {loading ? "Dispatching..." : "Initiate Recovery"}
                  {!loading && <Send size={20} className="ml-3" />}
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 bg-blue-50/50 rounded-[3rem] border-2 border-blue-100 text-center"
              >
                <div className="w-20 h-20 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-100">
                  <MailCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Check your Inbox</h3>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  We've dispatched a secure recovery link to <br />
                  <span className="text-blue-600 font-bold">{email}</span>
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSent(false)} 
                  className="w-full py-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest hover:bg-white"
                >
                  Try Different Email
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-10 border-t border-slate-100 flex justify-center">
            <Link href="/login" className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all font-black text-sm uppercase tracking-widest">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Return to Clinical Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

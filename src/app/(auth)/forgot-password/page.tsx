"use client";

import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { Stethoscope, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100"
      >
        {!sent ? (
          <>
            <div className="flex flex-col items-center mb-10">
              <div className="bg-blue-100 p-4 rounded-2xl mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
              <p className="text-slate-500 mt-2 text-center">Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
              <Input label="Email Address" type="email" placeholder="doctor@hospital.com" required />
              <Button type="submit" className="w-full py-4 text-lg">
                Send Reset Link
              </Button>
            </form>

            <Link href="/login" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-blue-600 font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Check your email</h2>
            <p className="text-slate-500 mb-8">We've sent a password reset link to your email address.</p>
            <Button variant="outline" className="w-full py-4" onClick={() => setSent(false)}>
              Resend Email
            </Button>
            <Link href="/login" className="block mt-8 text-blue-600 font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Mail, ArrowLeft, Send } from "lucide-react";
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
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      toast.success("Reset link sent to your professional email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ backgroundColor: "#0f172a" }}>
      <div className="auth-form-container" style={{ backgroundColor: "var(--bg-alt)", flex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-card"
        >
          <div className="flex justify-center mb-8">
            <div className="avatar-soft" style={{ width: "4rem", height: "4rem" }}>
              <Stethoscope size={32} />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Reset Password</h2>
            <p className="text-slate-500 font-medium">
              {sent 
                ? "Check your inbox for the recovery link" 
                : "Enter your professional email to receive a recovery link"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@hospital.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Button type="submit" disabled={loading} className="w-full py-5 text-lg">
                <Send size={20} className="mr-2" />
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-blue-700 font-bold mb-4">Email sent to {email}</p>
              <Button variant="outline" onClick={() => setSent(false)} className="w-full">
                Try different email
              </Button>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <Link href="/login" className="flex items-center justify-center gap-2 text-blue-600 font-black hover:underline">
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

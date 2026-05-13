"use client";

import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { Stethoscope, ArrowRight, BookOpen, Heart, Activity, UserPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signIn, getSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    if (!auth) {
      toast.error("Firebase keys missing. Please configure .env");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const syncResult = await signIn("credentials", {
        email: user.email,
        password: "google-auth-bypass-key",
        redirect: false
      });
      
      if (syncResult?.ok) {
        const session = await getSession();
        if (session?.user && session.user.department) {
          router.push("/home");
        } else {
          router.push("/onboarding");
        }
        toast.success("Welcome, Doctor!");
      } else {
        toast.error(syncResult?.error || "Session sync failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);

    if (!auth) {
      toast.error("Account creation requires Firebase");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      try {
        await axios.post("/api/register", {
          ...formData,
          firebaseUid: userCredential.user.uid
        });
      } catch (dbError) {
        console.warn("Database sync failed", dbError);
      }

      toast.success("Account created successfully!");
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/onboarding"
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-stretch">
      
      {/* Left Side: Visuals */}
      <div className="hidden lg:flex w-[45%] relative bg-slate-900 overflow-hidden p-16 flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] opacity-10 -ml-64 -mb-64" />
        
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
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-8 text-balance">
              The professional <br />
              <span className="text-blue-500 italic">standard</span> for <br />
              modern doctors.
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed mb-12">
              Collaborate on complex clinical cases with a global network of verified healthcare professionals.
            </p>
            
            <div className="space-y-6">
              <SignupBenefit Icon={ShieldCheck} title="Verified Practitioners" desc="Strict verification process for all members." />
              <SignupBenefit Icon={Activity} title="Real-time Collaboration" desc="Instantly discuss clinical doubts and insights." />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-10 border-t border-white/10">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center font-black text-xs text-white">D{i}</div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-blue-600 flex items-center justify-center font-black text-[10px] text-white">+5k</div>
          </div>
          <p className="text-slate-500 font-bold text-sm tracking-tight text-right">
            Trusted by medical <br /> professionals worldwide.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px]"
        >
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Create Clinical Account</h2>
            <p className="text-slate-500 font-medium text-lg">Your professional journey begins here.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <Input 
              label="Full Name" 
              placeholder="Dr. Sarah Johnson" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Medical Email" 
                type="email" 
                placeholder="sarah@hospital.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input 
                label="Username" 
                placeholder="sarah_md" 
                required 
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Input 
                label="Confirm Security" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full py-6 text-xl font-black rounded-2xl bg-blue-600 shadow-2xl shadow-blue-100 hover:scale-[1.02] transition-transform">
              {loading ? "Establishing Identity..." : "Join the Network"}
            </Button>
          </form>

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Auth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <SocialBtn icon={<GoogleIcon size={18} />} label="Google" onClick={handleGoogleSignUp} />
            <SocialBtn icon={<LinkedInIcon size={18} />} label="LinkedIn" />
          </div>

          <p className="text-center text-slate-500 font-bold">
            Already registered?{" "}
            <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">
              Access your account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function SignupBenefit({ Icon, title, desc }: any) {
  return (
    <div className="flex gap-4 group">
      <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-white text-lg">{title}</h4>
        <p className="text-slate-500 font-medium text-sm">{desc}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all font-black text-slate-600"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LinkedInIcon(props: any) {
  return (
    <svg viewBox="0 0 448 512" width={props.size || 24} height={props.size || 24} fill="#0077B5">
      <path d="M100.28 448H7.4V148.9h92.88v299.1zm-46.44-340.77c-29.7 0-53.84-24.14-53.84-53.84s24.14-53.84 53.84-53.84 53.84 24.14 53.84 53.84-24.14 53.84-53.84 53.84zm394.16 340.77h-92.88v-145.73c0-34.74-.66-79.48-48.42-79.48-48.47 0-55.89 37.87-55.89 76.98V448h-92.88V148.9h89.13v40.85h1.25c12.4-23.47 42.67-48.22 87.82-48.22 93.96 0 111.27 61.85 111.27 142.27V448z"/>
    </svg>
  );
}

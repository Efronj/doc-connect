"use client";

import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { Stethoscope, ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
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
        if (session?.user && !session.user.department) {
          router.push("/onboarding");
        } else {
          router.push("/home");
        }
        toast.success("Welcome, Doctor!");
      } else {
        toast.error(syncResult?.error || "Session sync failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!auth) {
      toast.error("Authentication requires Firebase");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const callback = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (callback?.ok) {
        const session = await getSession();
        if (session?.user && !session.user.department) {
          router.push("/onboarding");
        } else {
          router.push("/home");
        }
        toast.success("Welcome back, Doctor!");
      } else if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex items-stretch">
      
      {/* Left Side: Sophisticated Visuals */}
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
              Access the <br />
              <span className="text-blue-500 italic">global</span> clinical <br />
              knowledge base.
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed mb-12">
              Securely sign in to collaborate with specialists and stay updated with peer-reviewed medical breakthroughs.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <LoginFeature Icon={ShieldCheck} title="Verified Only" desc="Access restricted to healthcare professionals." />
              <LoginFeature Icon={Zap} title="Instant Insights" desc="Real-time clinical collaboration." />
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <p className="text-slate-500 font-bold text-sm tracking-tight leading-relaxed">
            HIPAA Compliant Data Handling <br />
            & End-to-End Secure Professional Networking.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-20 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[450px]"
        >
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium text-lg">Continue your clinical journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <Input 
              label="Professional Email" 
              placeholder="name@hospital.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div>
              <div className="flex justify-between px-1 mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-[10px] text-blue-600 font-black hover:underline uppercase tracking-widest">Forgot Password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full py-6 text-xl font-black rounded-2xl bg-blue-600 shadow-2xl shadow-blue-100 hover:scale-[1.02] transition-transform">
              {loading ? "Authenticating..." : "Sign In to Network"}
            </Button>
          </form>

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Auth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <SocialBtn icon={<GoogleIcon size={18} />} label="Google" onClick={handleGoogleSignIn} />
            <SocialBtn icon={<AppleIcon size={18} />} label="Apple ID" />
          </div>

          <p className="text-center text-slate-500 font-bold">
            New to DoctorNet?{" "}
            <Link href="/signup" className="text-blue-600 font-black hover:underline underline-offset-4">
              Register Professional Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function LoginFeature({ Icon, title, desc }: any) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-white text-lg">{title}</h4>
        <p className="text-slate-500 font-medium text-xs leading-relaxed">{desc}</p>
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

function AppleIcon(props: any) {
  return (
    <svg viewBox="0 0 384 512" width={props.size || 24} height={props.size || 24} fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.1-42.9.8-82.7 25.1-104.5 63.3-44.4 77.1-11.4 191 31.5 253.3 21.1 30.5 46.3 64.6 79.2 63.3 31.9-1.3 44.1-20.6 82.6-20.6 38.3 0 49.3 20.6 82.6 20 33.9-.6 56.1-30.7 77.2-61.3 24.3-35.4 34.3-69.7 34.7-71.5-1.1-.4-66.6-25.6-66.8-101.4zM263.2 104.6c21.2-25.8 35.5-61.7 31.6-97.6-30.8 1.3-68.2 20.5-90.3 46.2-19.8 23.1-34.3 58.6-29.6 94.1 34.2 2.6 68.6-17.5 88.3-42.7z"/>
    </svg>
  );
}

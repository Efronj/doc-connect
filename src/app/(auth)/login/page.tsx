"use client";

import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { Stethoscope, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    if (!auth) {
      toast.error("Auth service unavailable");
      setLoading(false);
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with NextAuth
      const syncResult = await signIn("credentials", {
        email: user.email,
        password: "google-auth-bypass-key",
        redirect: false
      });
      
      if (syncResult?.ok) {
        toast.success("Welcome, Doctor!");
        router.push("/home");
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
      toast.error("Auth service unavailable");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Sync with local session
      const callback = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (callback?.ok) {
        toast.success("Welcome back, Doctor!");
        router.push("/home");
      }

      if (callback?.error) {
        toast.error(callback.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ backgroundColor: "#0f172a" }}>
      
      {/* Left Side: Sophisticated Branding & Visuals */}
      <div className="auth-sidebar relative">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
            opacity: 1 
          }}
        />
        
        {/* Animated Shapes */}
        <div 
          className="absolute" 
          style={{ 
            top: "-10rem", 
            left: "-10rem", 
            width: "30rem", 
            height: "30rem", 
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            borderRadius: "50%"
          }} 
        />

        {/* Content */}
        <div className="relative z-10 animate-fade-in" style={{ padding: "2rem" }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="brand-logo-container mb-12"
            style={{ padding: "1.25rem", borderRadius: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
          >
            <Stethoscope size={56} color="white" strokeWidth={2.5} />
          </motion.div>
          
          <h1 className="text-6xl font-black mb-8 tracking-tighter leading-tight text-balance">
            Elevating <br /> 
            <span className="text-blue-200">Medical Connectivity.</span>
          </h1>
          
          <p className="text-xl text-blue-100 font-medium mb-12 leading-relaxed opacity-80">
            A secure, professional environment for verified healthcare practitioners to collaborate and grow.
          </p>

          <div className="grid grid-cols-2 gap-10">
            <FeatureItem Icon={ShieldCheck} title="Strict Verification" desc="Doctors only environment" />
            <FeatureItem Icon={Zap} title="Instant Insights" desc="Real-time clinical doubts" />
            <FeatureItem Icon={Globe} title="Global Network" desc="Connect with specialists" />
            <FeatureItem Icon={ArrowRight} title="Advanced Tools" desc="AI assisted diagnostics" />
          </div>
        </div>
      </div>

      {/* Right Side: Attractive Login Form */}
      <div className="auth-form-container" style={{ backgroundColor: "var(--bg-alt)" }}>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="auth-card"
          style={{ padding: "4rem", borderRadius: "3rem", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.1)" }}
        >
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Continue your professional journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex-col gap-2">
            <Input 
              label="Professional Email" 
              placeholder="name@hospital.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "1.25rem", borderRadius: "1.25rem" }}
            />
            
            <div className="flex-col mb-6">
              <div className="flex justify-between px-1 mb-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-blue-600 font-black hover:underline">Reset Password</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "1.25rem", borderRadius: "1.25rem" }}
              />
            </div>

            <div className="flex items-center gap-3 mb-8 ml-1">
              <input type="checkbox" id="remember" style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }} />
              <label htmlFor="remember" className="text-sm text-slate-600 font-bold select-none cursor-pointer">Keep me logged in</label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-5 text-xl font-black"
              style={{ borderRadius: "1.5rem", boxShadow: "var(--shadow-premium)" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to DoctorNet"}
            </Button>
          </form>

          <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text" style={{ backgroundColor: "white" }}>SECURE ACCESS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="py-4" 
              style={{ borderRadius: "1.25rem" }}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon size={20} style={{ marginRight: "0.75rem" }} />
              Google
            </Button>
            <Button variant="outline" className="py-4" style={{ borderRadius: "1.25rem" }}>
              <AppleIcon size={20} style={{ marginRight: "0.75rem" }} />
              Apple
            </Button>
          </div>

          <p className="text-center mt-12 text-slate-500 font-medium">
            New to the network?{" "}
            <Link href="/signup" className="text-blue-600 font-black hover:underline">
              Register now
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

function FeatureItem({ Icon, title, desc }: any) {
  return (
    <div className="flex flex-col gap-3">
      <div className="icon-box glass" style={{ width: "3.5rem", height: "3.5rem", padding: "0.75rem", borderRadius: "1.25rem" }}>
        <Icon size={28} color="#bfdbfe" />
      </div>
      <div>
        <h4 className="font-bold text-white text-base mb-1">{title}</h4>
        <p className="text-sm" style={{ color: "rgba(191, 219, 254, 0.7)", lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  );
}

function GoogleIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} style={props.style}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon(props: any) {
  return (
    <svg viewBox="0 0 384 512" width={props.size || 24} height={props.size || 24} style={props.style} fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.1-42.9.8-82.7 25.1-104.5 63.3-44.4 77.1-11.4 191 31.5 253.3 21.1 30.5 46.3 64.6 79.2 63.3 31.9-1.3 44.1-20.6 82.6-20.6 38.3 0 49.3 20.6 82.6 20 33.9-.6 56.1-30.7 77.2-61.3 24.3-35.4 34.3-69.7 34.7-71.5-1.1-.4-66.6-25.6-66.8-101.4zM263.2 104.6c21.2-25.8 35.5-61.7 31.6-97.6-30.8 1.3-68.2 20.5-90.3 46.2-19.8 23.1-34.3 58.6-29.6 94.1 34.2 2.6 68.6-17.5 88.3-42.7z"/>
    </svg>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { Stethoscope, ArrowRight, BookOpen, Heart, Activity, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signIn } from "next-auth/react";
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
    setLoading(true);
    if (!auth) {
      toast.error("Auth service unavailable");
      setLoading(false);
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with local session
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
      toast.error("Auth service unavailable");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // 2. Save user data to our MongoDB database (silent)
      try {
        await axios.post("/api/register", {
          ...formData,
          firebaseUid: userCredential.user.uid
        });
      } catch (dbError) {
        console.warn("Database sync failed, but account created in Firebase", dbError);
      }

      toast.success("Account created successfully!");
      
      // 3. Sign in to the local session
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/home"
      });

    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
      {/* Left Side: Attractive Visuals */}
      <div className="auth-sidebar relative">
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900"
        />
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-10 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="relative z-10 animate-fade-in max-w-xl">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl border border-white/20"
          >
            <UserPlus size={40} color="white" />
          </motion.div>
          
          <h1 className="text-6xl font-black mb-8 tracking-tighter leading-tight text-balance">
            Start your <br /> 
            <span className="text-blue-300">Professional Journey.</span>
          </h1>
          
          <p className="text-xl text-blue-100/80 font-medium mb-12 leading-relaxed">
            Build your professional presence, collaborate with specialists, and access exclusive medical resources.
          </p>

          <div className="flex flex-col gap-6">
            <SignupBenefit Icon={BookOpen} text="Access peer-reviewed case studies" />
            <SignupBenefit Icon={Heart} text="Join specialized medical communities" />
            <SignupBenefit Icon={Activity} text="Get real-time medical insights" />
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="auth-form-container">
        
        {/* Mobile Logo */}
        <div className="lg:hidden mb-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">DoctorNet</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-card"
        >
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Join the world's most trusted medical network</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input 
              label="Full Name" 
              placeholder="Dr. Sarah Johnson" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Email Address" 
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Input 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            
            <div className="py-2">
              <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 cursor-pointer accent-blue-600 shrink-0" />
                <label htmlFor="terms" className="text-xs text-slate-500 font-bold leading-relaxed">
                  I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Professional Code of Conduct</span>.
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full py-5 text-xl font-black rounded-2xl shadow-lg shadow-blue-100 mt-2">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text bg-white px-4 text-xs font-black text-slate-400 tracking-widest">OR REGISTER WITH</span>
            <div className="divider-line" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="py-4 rounded-2xl border-slate-200 hover:bg-slate-50"
              onClick={handleGoogleSignUp}
              disabled={loading}
            >
              <GoogleIcon size={20} className="mr-3" />
              Google
            </Button>
            <Button variant="outline" className="py-4 rounded-2xl border-slate-200 hover:bg-slate-50" disabled={loading}>
              <LinkedInIcon size={20} className="mr-3" />
              LinkedIn
            </Button>
          </div>

          <p className="text-center mt-12 text-slate-500 font-medium">
            Already a member?{" "}
            <Link href="/login" className="text-blue-600 font-black hover:underline">
              Log in to your account
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

function SignupBenefit({ Icon, text }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="icon-box glass" style={{ width: "2.5rem", height: "2.5rem", padding: "0.5rem" }}>
        <Icon size={20} color="#bfdbfe" />
      </div>
      <p className="text-lg text-white font-medium">{text}</p>
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

function LinkedInIcon(props: any) {
  return (
    <svg viewBox="0 0 448 512" width={props.size || 24} height={props.size || 24} style={props.style} fill="currentColor">
      <path d="M100.28 448H7.4V148.9h92.88v299.1zm-46.44-340.77c-29.7 0-53.84-24.14-53.84-53.84s24.14-53.84 53.84-53.84 53.84 24.14 53.84 53.84-24.14 53.84-53.84 53.84zm394.16 340.77h-92.88v-145.73c0-34.74-.66-79.48-48.42-79.48-48.47 0-55.89 37.87-55.89 76.98V448h-92.88V148.9h89.13v40.85h1.25c12.4-23.47 42.67-48.22 87.82-48.22 93.96 0 111.27 61.85 111.27 142.27V448z"/>
    </svg>
  );
}

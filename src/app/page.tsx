"use client";

import { motion } from "framer-motion";
import { Stethoscope, Users, MessageSquare, Bell, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  if (!mounted) return null;

  return (
    <main className="overflow-hidden" style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {/* Hero Section */}
      <div className="relative flex-col items-center justify-center" style={{ display: "flex", minHeight: "100vh", padding: "1rem" }}>
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-50/60 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-50/40 rounded-full blur-[80px]" />
      </div>


        {/* Logo and Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative p-1 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-[2rem] shadow-2xl shadow-blue-200"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-[1.8rem] p-5 border border-white/20">
                <Stethoscope size={48} className="text-white drop-shadow-lg" />
              </div>
              <div className="absolute -inset-4 bg-blue-400/20 rounded-full blur-2xl -z-10 animate-pulse" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0em", opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl font-black text-slate-900 mb-2 tracking-tight"
          >
            Doctor<span className="text-blue-600">Net</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-slate-500 mb-10 font-medium"
          >
            Where Doctors Connect. Worldwide.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 inline-block p-2 bg-blue-50/50 backdrop-blur-md rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-100/50"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <Link href="/signup">
                <button className="px-8 py-4 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200 active:scale-95 text-lg">
                  Join Community
                </button>
              </Link>
              <Link href="/login">
                <button className="px-8 py-4 bg-white text-blue-600 font-black rounded-[2rem] hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 text-lg">
                  Login
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "5rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <h2 className="text-3xl font-bold text-center mb-12">Designed for Medical Professionals</h2>
        <div className="grid grid-cols-3 gap-8">
          <FeatureCard 
            title="Professional Networking" 
            desc="Connect with specialists and students from top medical institutions globally."
            icon={<Users size={24} />}
          />
          <FeatureCard 
            title="Real-time Consultation" 
            desc="Discuss complex cases and medical doubts in specialized communities."
            icon={<MessageSquare size={24} />}
          />
          <FeatureCard 
            title="Verified Credentials" 
            desc="A secure environment for verified doctors and medical practitioners."
            icon={<Stethoscope size={24} />}
          />
        </div>
      </div>
      <style jsx>{`
        .flex-col-sm { display: flex; flex-direction: column; }
        @media (min-width: 640px) {
          .flex-col-sm { flex-direction: row; }
        }
        .grid-cols-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: any }) {
  return (
    <div className="panel-card" style={{ padding: "2rem", height: "100%" }}>
      <div className="icon-box-light mb-6" style={{ width: "3rem", height: "3rem", borderRadius: "1rem" }}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500">{desc}</p>
    </div>
  );
}

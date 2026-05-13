"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, TrendingUp, Users, BookOpen, Hash, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`/api/user/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-12 pb-32">
      
      {/* Search Header Section */}
      <div className="mb-16">
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-8 text-balance">
          Discover <br />
          <span className="text-blue-600">Clinical Minds.</span>
        </h1>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <SearchIcon size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Search practitioners, specialties, or clinical topics..." 
            className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-20 py-8 text-xl font-medium placeholder:text-slate-300 focus:border-blue-600 focus:ring-8 focus:ring-blue-50 transition-all outline-none shadow-xl shadow-slate-100/50" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-6 top-1/2 -translate-y-1/2"
              >
                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Practitioners Found</span>
              <div className="flex-1 h-px bg-blue-50" />
            </div>
            
            {results.map((doctor) => (
              <Link 
                key={doctor.id} 
                href={`/profile/${doctor.name.toLowerCase().replace(/\s+/g, '')}`}
                className="bg-white rounded-[2.5rem] p-6 flex items-center justify-between group border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                    {doctor.name?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-slate-900 text-xl tracking-tight">{doctor.name}</h3>
                      <ShieldCheck size={16} className="text-blue-500" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">
                      <span className="text-blue-600/60 uppercase tracking-tighter">{doctor.department || "Medical"}</span>
                      <span className="mx-2 opacity-30">|</span>
                      {doctor.role}
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="discover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <TrendingUp size={28} className="text-blue-600" />
                  Explore Network
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <ExploreCategory Icon={BookOpen} title="Case Studies" count="1.2k new" color="bg-blue-50 text-blue-600" />
                <ExploreCategory Icon={Users} title="Communities" count="450 groups" color="bg-emerald-50 text-emerald-600" />
                <ExploreCategory Icon={Hash} title="Trending Tags" count="12 active" color="bg-violet-50 text-violet-600" />
                <ExploreCategory Icon={Activity} title="Live Insights" count="85 online" color="bg-rose-50 text-rose-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 transition-transform group-hover:scale-150" />
                
                <h3 className="font-black text-xl text-slate-900 mb-8 flex items-center justify-between relative z-10">
                  Global Trends
                  <TrendingUp size={20} className="text-blue-600" />
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <TrendingTag tag="#EchocardiogramTips" posts="2.4k" />
                  <TrendingTag tag="#SurgeryLife" posts="1.5k" />
                  <TrendingTag tag="#PrecisionMedicine" posts="950" />
                  <TrendingTag tag="#MedicalEthics" posts="820" />
                </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mb-32" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight mb-3">Institutional Access</h3>
                  <p className="text-slate-400 font-medium leading-relaxed mb-8">
                    Connect your hospital credentials to access exclusive clinical research and verify your practitioner status.
                  </p>
                </div>
                
                <Button className="w-full py-6 bg-white text-slate-900 hover:bg-blue-50 font-black rounded-2xl relative z-10 transition-transform group-hover:scale-[1.02]">
                  Verify My Credentials
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExploreCategory({ Icon, title, count, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h4 className="font-black text-slate-900 text-sm tracking-tight mb-1">{title}</h4>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count}</p>
    </div>
  );
}

function TrendingTag({ tag, posts }: any) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-600/20 group-hover:bg-blue-600 transition-colors" />
        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{tag}</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{posts} discussing</span>
    </div>
  );
}

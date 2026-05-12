"use client";

import { motion } from "framer-motion";
import { Search as SearchIcon, TrendingUp, Users, BookOpen, Hash, ArrowRight } from "lucide-react";
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
    <div className="max-w-4xl mx-auto p-6 lg:p-8 pb-32">
      {/* Search Header */}
      <div className="relative mb-12">
        <SearchIcon className="absolute" style={{ left: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={24} />
        <input 
          type="text" 
          placeholder="Search doctors, specialties, or medical topics" 
          className="input w-full pl-16 py-6 text-lg shadow-premium border-slate-100" 
          style={{ borderRadius: "2rem" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Search Results</h2>
          {results.map((doctor) => (
            <Link 
              key={doctor.id} 
              href={`/profile/${doctor.name.toLowerCase().replace(/\s+/g, '')}`}
              className="premium-card p-4 lg:p-6 flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="avatar-soft" style={{ width: "4rem", height: "4rem" }}>
                  {doctor.name?.[0]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                  <p className="text-slate-500 font-bold text-sm">
                    {doctor.specialty || doctor.department || "Medical Practitioner"} · {doctor.role}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                <ArrowRight size={20} />
              </Button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3">
            <TrendingUp size={28} className="text-blue-600" />
            Discover Network
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            <ExploreCategory Icon={BookOpen} title="Case Studies" count="1.2k new" color="#3b82f6" />
            <ExploreCategory Icon={Users} title="Communities" count="450 groups" color="#10b981" />
            <ExploreCategory Icon={Hash} title="Trending Tags" count="#MedTwitter" color="#8b5cf6" />
            <ExploreCategory Icon={TrendingUp} title="Job Board" count="85 openings" color="#f59e0b" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="premium-card">
              <h3 className="font-black text-lg mb-6 flex items-center justify-between">
                Trending Tags
                <Hash size={20} className="text-slate-200" />
              </h3>
              <div className="flex flex-col gap-1">
                <TrendingTag tag="#EchocardiogramTips" posts="2.4k" />
                <TrendingTag tag="#MBBSMotivation" posts="1.8k" />
                <TrendingTag tag="#SurgeryLife" posts="1.5k" />
                <TrendingTag tag="#PrecisionMedicine" posts="950" />
              </div>
            </div>

            <div className="premium-card bg-blue-600 text-white border-none shadow-blue-200">
               <h3 className="font-black text-lg mb-2">Verified Network</h3>
               <p className="text-blue-100 text-sm mb-6">Connect with 12,000+ verified medical practitioners globally.</p>
               <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6" style={{ borderRadius: "1.25rem" }}>
                 Verify My Account
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExploreCategory({ Icon, title, count, color }: any) {
  return (
    <div className="panel-card flex items-center gap-4 transition-all" style={{ cursor: "pointer", border: "1px solid var(--border)" }}>
      <div className="icon-box" style={{ backgroundColor: color, padding: "0.75rem", borderRadius: "1rem" }}>
        <Icon size={20} color="white" />
      </div>
      <div>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-slate-400">{count}</p>
      </div>
    </div>
  );
}

function TrendingTag({ tag, posts }: any) {
  return (
    <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
      <span className="font-bold text-blue-600">{tag}</span>
      <span className="text-xs text-slate-400">{posts} posts</span>
    </div>
  );
}

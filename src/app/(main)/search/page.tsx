"use client";

import { motion } from "framer-motion";
import { Search as SearchIcon, TrendingUp, Users, BookOpen, Hash } from "lucide-react";

export default function SearchPage() {
  return (
    <div style={{ padding: "1.5rem", paddingBottom: "5rem" }}>
      {/* Mobile Search Bar */}
      <div className="relative mb-8">
        <SearchIcon className="absolute" style={{ left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={20} />
        <input 
          type="text" 
          placeholder="Search for doctors, cases, or medical topics" 
          className="input" 
          style={{ paddingLeft: "3rem" }}
        />
      </div>

      <h2 className="text-xl font-black mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-blue-600" />
        Explore Medical Trends
      </h2>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ExploreCategory Icon={BookOpen} title="Case Studies" count="1.2k new" color="#3b82f6" />
        <ExploreCategory Icon={Users} title="Communities" count="450 groups" color="#10b981" />
        <ExploreCategory Icon={Hash} title="Trending Tags" count="#MedTwitter" color="#8b5cf6" />
        <ExploreCategory Icon={TrendingUp} title="Job Board" count="85 openings" color="#f59e0b" />
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg mb-4">Trending Tags</h3>
        <div className="flex-col gap-4">
          <TrendingTag tag="#EchocardiogramTips" posts="2.4k" />
          <TrendingTag tag="#MBBSMotivation" posts="1.8k" />
          <TrendingTag tag="#SurgeryLife" posts="1.5k" />
          <TrendingTag tag="#AIGenerativeMedicine" posts="950" />
        </div>
      </div>
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

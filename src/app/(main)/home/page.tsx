"use client";

import { motion } from "framer-motion";
import { 
  Image as ImageIcon, 
  HelpCircle, 
  MessageCircle, 
  Heart, 
  Share, 
  MoreHorizontal,
  Stethoscope,
  Bookmark,
  Users,
  Activity,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function HomePage() {
  return (
    <div style={{ paddingBottom: "5rem" }}>
      <header className="page-header">
        <h1 className="title-xl">Medical Feed</h1>
        <div className="flex gap-2">
           <button className="avatar-soft" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem" }}>
             <Plus size={18} />
           </button>
        </div>
      </header>

      {/* Post Creator */}
      <div className="post-creator-minimal">
        <div className="flex gap-5">
          <div className="avatar-soft">JD</div>
          <div style={{ flex: 1 }}>
            <textarea 
              placeholder="What clinical case or doubt do you have today?" 
              className="textarea-ghost"
              rows={2}
              style={{ fontSize: "1.25rem", fontWeight: 500 }}
            />
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <ImageIcon size={20} />
                  <span className="text-sm font-bold">Clinical Image</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Activity size={20} />
                  <span className="text-sm font-bold">Case Study</span>
                </button>
              </div>
              <Button style={{ borderRadius: "1rem", padding: "0.75rem 2rem", fontWeight: 800 }}>Share</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-col"
      >
        <PostCard 
          author="Dr. James Wilson" 
          specialty="Cardiologist"
          content="Just completed a successful TAVR procedure. It's amazing how much minimally invasive techniques have evolved in the last decade. 🫀\n\nModern cardiology is truly at its peak! #Cardiology #Surgery"
          time="2h ago"
          likes="1.2k"
          comments="45"
          image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
        />
        
        <PostCard 
          author="Dr. Sarah Chen" 
          specialty="Neurologist"
          content="New study out on neuroplasticity in stroke recovery. The findings suggest that early intervention (within 24-48 hours) is even more critical than previously thought. 🧠"
          time="8h ago"
          likes="2.4k"
          comments="92"
        />

        <PostCard 
          author="Sarah Smith" 
          specialty="MBBS Student"
          type="DOUBT"
          content="Can someone help me differentiate between the various types of cardiomyopathy on an echocardiogram? I'm finding the restrictive type a bit confusing. 📚"
          time="1d ago"
          likes="850"
          comments="128"
        />
      </motion.div>
    </div>
  );
}

function PostCard({ author, specialty, content, time, likes, comments, type, image }: any) {
  return (
    <div className="premium-card">
      <div className="flex gap-5">
        <div className="avatar-soft">
          {author.split(" ").map((n: string) => n[0]).join("")}
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-slate-900">{author}</h4>
              <p className="text-blue-600 font-bold" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{specialty} · {time}</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors"><MoreHorizontal size={22} /></button>
          </div>

          {type === "DOUBT" && (
            <div className="mt-3 px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold w-fit border border-emerald-100">
              Medical Doubt
            </div>
          )}

          <p className="text-slate-700 leading-relaxed my-5" style={{ fontSize: "1.1rem", whiteSpace: "pre-wrap", fontWeight: 400 }}>
            {content}
          </p>

          {image && (
            <div style={{ borderRadius: "1.5rem", overflow: "hidden", marginBottom: "1.5rem", height: "20rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              <img src={image} alt="Medical visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div className="flex gap-10 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all">
              <MessageCircle size={22} />
              <span className="text-sm font-bold">{comments}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all">
              <Heart size={22} />
              <span className="text-sm font-bold">{likes}</span>
            </button>
            <button className="text-slate-400 hover:text-blue-600 transition-all ml-auto"><Bookmark size={22} /></button>
            <button className="text-slate-400 hover:text-blue-600 transition-all"><Share size={22} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostAction({ Icon, count }: any) {
  return (
    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all">
      <Icon size={20} />
      {count && <span className="text-xs font-bold">{count}</span>}
    </button>
  );
}

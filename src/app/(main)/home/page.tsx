"use client";

import { motion } from "framer-motion";
import { 
  Image as ImageIcon, 
  HelpCircle, 
  MessageCircle, 
  Heart, 
  Share, 
  MoreHorizontal,
  BadgeCheck,
  Bookmark,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Feed Selection Header */}
      <div className="header-sticky">
        <h1 className="text-xl font-bold tracking-tight">Home Feed</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab("foryou")}
            className={`text-sm font-bold ${activeTab === "foryou" ? "text-blue-600" : "text-slate-400"}`}
          >
            Recommended
          </button>
          <button 
            onClick={() => setActiveTab("following")}
            className={`text-sm font-bold ${activeTab === "following" ? "text-blue-600" : "text-slate-400"}`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Post Creator Card */}
      <div className="post-creator-card">
        <div className="flex gap-4">
          <div className="avatar-clean">JD</div>
          <div style={{ flex: 1 }}>
            <textarea 
              placeholder="Share a medical case or clinical insight..." 
              className="textarea-ghost"
              rows={2}
              style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}
            />
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex gap-3">
                <button className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                  <ImageIcon size={20} />
                  <span className="text-xs font-bold">Image</span>
                </button>
                <button className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors">
                  <HelpCircle size={20} />
                  <span className="text-xs font-bold">Doubt</span>
                </button>
              </div>
              <Button style={{ borderRadius: "var(--radius-md)", padding: "0.5rem 1.5rem", fontWeight: 700 }}>Share Case</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-col"
      >
        <PostCard 
          author="Dr. James Wilson" 
          username="jwilson_cardio"
          specialty="Cardiologist"
          verified={true}
          content="Just completed a successful TAVR procedure. It's amazing how much minimally invasive techniques have evolved in the last decade. 🫀\n\nModern cardiology is truly at its peak! #Cardiology #Surgery #MedTwitter"
          time="2h"
          likes="1.2k"
          comments="45"
          image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
        />
        
        <PostCard 
          author="Sarah Smith" 
          username="sarah_med2026"
          specialty="MBBS Final Year"
          verified={false}
          type="DOUBT"
          content="Can someone help me differentiate between the various types of cardiomyopathy on an echocardiogram? I'm finding the restrictive type a bit confusing. 📚 #MedicalDoubt #Cardiology"
          time="5h"
          likes="850"
          comments="128"
        />

        <PostCard 
          author="Dr. Sarah Chen" 
          username="schen_neuro"
          specialty="Neurologist"
          verified={true}
          content="New study out on neuroplasticity in stroke recovery. The findings suggest that early intervention (within 24-48 hours) is even more critical than previously thought. 🧠"
          time="8h"
          likes="2.4k"
          comments="92"
        />
      </motion.div>
    </div>
  );
}

function PostCard({ author, username, specialty, verified, content, time, likes, comments, type, image }: any) {
  return (
    <div className="post-card-clean">
      <div className="flex gap-4">
        <div className="avatar-clean">
          {author.split(" ").map((n: string) => n[0]).join("")}
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900">{author}</span>
                {verified && <BadgeCheck size={16} color="#3b82f6" fill="#3b82f6" />}
                <span className="text-slate-400 text-sm ml-1">@{username} · {time}</span>
              </div>
              <p className="text-blue-600 font-bold" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{specialty}</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
          </div>

          {type === "DOUBT" && (
            <div className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold w-fit">
              Medical Doubt
            </div>
          )}

          <p className="text-slate-800 leading-relaxed my-4" style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}>
            {content}
          </p>

          {image && (
            <div className="rounded-xl overflow-hidden border border-slate-200 mb-4 h-64">
              <img src={image} alt="Medical visual" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex gap-8 pt-2 border-top border-slate-100">
            <PostAction Icon={MessageCircle} count={comments} />
            <PostAction Icon={Heart} count={likes} />
            <PostAction Icon={Bookmark} />
            <PostAction Icon={Share} />
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

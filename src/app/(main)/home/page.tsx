"use client";

import { motion } from "framer-motion";
import { 
  Image as ImageIcon, 
  Video, 
  HelpCircle, 
  MessageCircle, 
  Heart, 
  Repeat2, 
  Share, 
  MoreHorizontal,
  BadgeCheck,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Stories / Quick Updates */}
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem", overflowX: "auto", backgroundColor: "white" }}>
        <StoryCircle label="You" active plus />
        <StoryCircle label="Dr. Chen" />
        <StoryCircle label="Dr. Rivera" />
        <StoryCircle label="Case Study" />
        <StoryCircle label="MedNews" />
        <StoryCircle label="Cardio" />
      </div>

      {/* Create Post Area */}
      <div className="post-creator" style={{ padding: "1.5rem", borderBottom: "8px solid var(--border)" }}>
        <div className="flex gap-4 w-full">
          <div className="avatar shadow-sm" style={{ fontWeight: 900, color: "var(--primary)", backgroundColor: "var(--primary-light)" }}>JD</div>
          <div style={{ flex: 1 }}>
            <textarea 
              placeholder="What's happening in your clinic?" 
              className="textarea-ghost"
              rows={2}
              style={{ fontSize: "1.1rem" }}
            />
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex gap-2">
                <IconButton Icon={ImageIcon} label="Media" color="#3b82f6" />
                <IconButton Icon={Video} label="Video" color="#a855f7" />
                <IconButton Icon={HelpCircle} label="Doubt" color="#10b981" />
              </div>
              <Button style={{ borderRadius: "var(--radius-full)", padding: "0.5rem 1.5rem", fontWeight: 900, fontSize: "0.9rem" }}>Post</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: "4rem", backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <TabButton label="For You" active={activeTab === "foryou"} onClick={() => setActiveTab("foryou")} />
        <TabButton label="Following" active={activeTab === "following"} onClick={() => setActiveTab("following")} />
        <TabButton label="Live Cases" active={activeTab === "cases"} onClick={() => setActiveTab("cases")} />
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
          reposts="12"
          image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
        />
        <PostCard 
          author="Sarah Smith" 
          username="sarah_med2026"
          specialty="MBBS Final Year"
          verified={false}
          type="DOUBT"
          content="Can someone help me differentiate between the various types of cardiomyopathy on an echocardiogram? I'm finding the restrictive type a bit confusing. 📚\n\nAny mnemonics or tips would be appreciated! #MedicalDoubt #Cardiology #Step1"
          time="5h"
          likes="850"
          comments="128"
          reposts="34"
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
          reposts="156"
        />
      </motion.div>
    </div>
  );
}

function StoryCircle({ label, active, plus }: any) {
  return (
    <div className="flex-col items-center gap-1" style={{ cursor: "pointer", flexShrink: 0 }}>
      <div className="avatar" style={{ 
        width: "4rem", 
        height: "4rem", 
        border: active ? "3px solid var(--primary)" : "2px solid var(--border)",
        padding: "2px",
        background: "white"
      }}>
        <div className="h-full w-full rounded-full flex items-center justify-center bg-slate-100" style={{ position: "relative" }}>
          {plus && <div className="absolute" style={{ bottom: 0, right: 0, background: var(--primary), borderRadius: "50%", padding: "2px", border: "2px solid white" }}><Plus size={12} color="white" /></div>}
          <span className="font-bold text-slate-400">{label[0]}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-500">{label}</span>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        flex: 1, 
        padding: "1rem", 
        fontSize: "0.95rem", 
        fontWeight: 800, 
        color: active ? "var(--text)" : "var(--text-muted)",
        position: "relative",
        transition: "var(--transition)"
      }}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab"
          style={{ position: "absolute", bottom: 0, left: "25%", right: "25%", height: "4px", background: "var(--primary)", borderRadius: "999px" }} 
        />
      )}
    </button>
  );
}

function IconButton({ Icon, label, color }: any) {
  return (
    <button className="flex items-center gap-2 hover-bg-alt" style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--radius-lg)", color: color }}>
      <Icon size={18} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function PostCard({ author, username, specialty, verified, content, time, likes, comments, reposts, type, image }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="post-card"
    >
      <div className="flex gap-4">
        <div className="avatar shadow-sm" style={{ fontWeight: 900, background: "var(--bg-alt)" }}>
          {author.split(" ").map((n: string) => n[0]).join("")}
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div className="flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900" style={{ fontSize: "1rem" }}>{author}</span>
                {verified && <BadgeCheck size={16} color="#3b82f6" fill="#3b82f6" />}
                <span className="text-slate-400 text-sm ml-1">@{username} · {time}</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.1rem" }}>{specialty}</p>
            </div>
            <button className="post-action">
              <MoreHorizontal size={18} color="#94a3b8" />
            </button>
          </div>

          {type === "DOUBT" && (
            <div className="flex items-center gap-2" style={{ marginTop: "0.75rem", padding: "0.4rem 1rem", background: "#ecfdf5", color: "#059669", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 800, width: "fit-content", border: "1px solid #d1fae5" }}>
              <HelpCircle size={14} />
              Medical Doubt
            </div>
          )}

          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text)", margin: "0.875rem 0", whiteSpace: "pre-wrap" }}>
            {content}
          </p>

          {image && (
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "1rem", position: "relative", height: "18rem" }}>
              <img src={image} alt="Medical visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div className="flex justify-between" style={{ maxWidth: "32rem", color: "var(--text-muted)", marginLeft: "-0.5rem" }}>
            <PostAction Icon={MessageSquare} count={comments} />
            <PostAction Icon={Repeat2} count={reposts} />
            <PostAction Icon={Heart} count={likes} color="hover-red" />
            <PostAction Icon={Bookmark} />
            <PostAction Icon={Share} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostAction({ Icon, count, color }: any) {
  return (
    <div className={`post-action ${color}`}>
      <Icon size={19} />
      {count && <span className="text-xs font-bold">{count}</span>}
    </div>
  );
}

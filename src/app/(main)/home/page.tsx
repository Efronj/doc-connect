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
      {/* Create Post Area */}
      <div className="post-creator">
        <div className="avatar" style={{ fontWeight: 900, color: "var(--primary)" }}>JD</div>
        <div style={{ flex: 1 }}>
          <textarea 
            placeholder="What's happening in your clinic today?" 
            className="textarea-ghost"
            rows={2}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              <IconButton Icon={ImageIcon} label="Media" color="#3b82f6" />
              <IconButton Icon={Video} label="Video" color="#a855f7" />
              <IconButton Icon={HelpCircle} label="Doubt" color="#10b981" />
            </div>
            <Button style={{ borderRadius: "2rem", padding: "0.6rem 1.8rem", fontWeight: 900 }}>Post</Button>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: "4rem", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <button 
          className={`tab-button ${activeTab === "foryou" ? "active" : ""}`}
          onClick={() => setActiveTab("foryou")}
        >
          For You
        </button>
        <button 
          className={`tab-button ${activeTab === "following" ? "active" : ""}`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
        <button 
          className={`tab-button ${activeTab === "cases" ? "active" : ""}`}
          onClick={() => setActiveTab("cases")}
        >
          Cases
        </button>
      </div>

      {/* Posts Feed */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-col"
      >
        <PostCard 
          author="Dr. James Wilson" 
          username="jwilson_cardio"
          specialty="Cardiologist"
          verified={true}
          content="Just completed a successful TAVR procedure. It's amazing how much minimally invasive techniques have evolved in the last decade. #Cardiology #Surgery #MedTwitter"
          time="2h"
          likes="1.2k"
          comments="45"
          reposts="12"
        />
        <PostCard 
          author="Sarah Smith" 
          username="sarah_med2026"
          specialty="MBBS Final Year"
          verified={false}
          type="DOUBT"
          content="Can someone help me differentiate between the various types of cardiomyopathy on an echocardiogram? I'm finding the restrictive type a bit confusing. #MedicalDoubt #Cardiology #Step1"
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
          content="New study out on neuroplasticity in stroke recovery. The findings suggest that early intervention (within 24-48 hours) is even more critical than previously thought."
          time="8h"
          likes="2.4k"
          comments="92"
          reposts="156"
        />
      </motion.div>
    </div>
  );
}

function IconButton({ Icon, label, color }: any) {
  return (
    <button className="icon-button-subtle" style={{ color: color }}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function PostCard({ author, username, specialty, verified, content, time, likes, comments, reposts, type }: any) {
  return (
    <div className="post-card">
      <div className="flex gap-4">
        <div className="avatar" style={{ fontSize: "0.875rem", fontWeight: 900 }}>
          {author.split(" ").map((n: string) => n[0]).join("")}
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900" style={{ fontSize: "1rem" }}>{author}</span>
                {verified && <BadgeCheck size={16} color="#3b82f6" fill="#3b82f6" />}
                <span className="text-slate-400 text-sm ml-1">@{username} · {time}</span>
              </div>
              <p style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.1rem" }}>{specialty}</p>
            </div>
            <button className="post-action">
              <MoreHorizontal size={18} color="#94a3b8" />
            </button>
          </div>

          {type === "DOUBT" && (
            <div className="flex items-center gap-2" style={{ marginTop: "0.75rem", padding: "0.3rem 0.8rem", background: "#ecfdf5", color: "#059669", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 800, width: "fit-content", border: "1px solid #d1fae5" }}>
              <HelpCircle size={12} />
              Medical Doubt
            </div>
          )}

          <p style={{ fontSize: "1.05rem", lineHeight: 1.5, color: "var(--text)", margin: "0.75rem 0 1.25rem 0", whiteSpace: "pre-wrap" }}>
            {content}
          </p>

          <div className="flex justify-between" style={{ maxWidth: "30rem", color: "var(--text-muted)", marginLeft: "-0.5rem" }}>
            <div className="post-action"><MessageCircle size={18} /><span className="text-xs font-bold">{comments}</span></div>
            <div className="post-action"><Repeat2 size={18} /><span className="text-xs font-bold">{reposts}</span></div>
            <div className="post-action like"><Heart size={18} /><span className="text-xs font-bold">{likes}</span></div>
            <div className="post-action"><Bookmark size={18} /></div>
            <div className="post-action"><Share size={18} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

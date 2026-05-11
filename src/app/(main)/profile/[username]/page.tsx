"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  BadgeCheck, 
  MoreHorizontal,
  Mail,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui";

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Cover Image */}
      <div style={{ height: "12rem", background: "var(--medical-gradient)", position: "relative" }}>
        <div style={{ position: "absolute", bottom: "-4rem", left: "1.5rem" }}>
          <div className="avatar shadow-xl" style={{ width: "8rem", height: "8rem", border: "4px solid white", fontSize: "2rem", fontWeight: 900 }}>
            JD
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex" style={{ justifyContent: "flex-end", padding: "1.5rem", gap: "0.75rem" }}>
        <Button variant="outline" style={{ borderRadius: "50%", width: "2.5rem", height: "2.5rem", padding: 0 }}>
          <MoreHorizontal size={20} />
        </Button>
        <Button variant="outline" style={{ borderRadius: "50%", width: "2.5rem", height: "2.5rem", padding: 0 }}>
          <Mail size={20} />
        </Button>
        <Button style={{ borderRadius: "2rem", padding: "0.5rem 1.5rem", fontWeight: 900 }}>Follow</Button>
      </div>

      {/* Profile Info */}
      <div style={{ padding: "0 1.5rem", marginTop: "0.5rem" }}>
        <div className="flex items-center gap-1">
          <h1 className="text-3xl font-black text-slate-900">Dr. John Doe</h1>
          <BadgeCheck size={24} color="#3b82f6" fill="#3b82f6" />
        </div>
        <p className="text-slate-500">@{params.username || "johndoe_md"}</p>
        
        <p style={{ marginTop: "1rem", fontSize: "1.125rem", color: "var(--text)", lineHeight: 1.6, maxWidth: "42rem" }}>
          Senior Cardiologist at Johns Hopkins Hospital. Specialized in interventional cardiology and preventive medicine. Passionate about medical education and AI in healthcare. 🩺❤️
        </p>

        <div className="flex" style={{ flexWrap: "wrap", gap: "1.5rem", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          <div className="flex items-center gap-1">
            <Stethoscope size={16} />
            <span>Cardiologist</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>Baltimore, MD</span>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon size={16} />
            <a href="#" className="text-blue-600">johndoe.md</a>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Joined May 2024</span>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-1">
            <span className="font-black text-slate-900">12.4k</span>
            <span className="text-slate-500">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-black text-slate-900">842</span>
            <span className="text-slate-500">Following</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", marginTop: "2rem", position: "sticky", top: "4rem", backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <TabItem label="Posts" active />
        <TabItem label="Replies" />
        <TabItem label="Highlights" />
        <TabItem label="Media" />
      </div>

      {/* User Posts Placeholder */}
      <div className="flex-col items-center justify-center" style={{ padding: "5rem", color: "var(--text-muted)", textAlign: "center" }}>
        <p className="text-lg font-bold">No posts yet</p>
        <p className="text-sm">Posts from @{params.username} will appear here</p>
      </div>
    </div>
  );
}

function TabItem({ label, active }: { label: string, active?: boolean }) {
  return (
    <button style={{ 
      flex: 1, 
      padding: "1rem 0", 
      fontSize: "0.875rem", 
      fontWeight: 700, 
      color: active ? "var(--text)" : "var(--text-muted)",
      position: "relative"
    }}>
      {label}
      {active && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "3rem", height: "4px", backgroundColor: "var(--primary)", borderRadius: "2px" }} />}
    </button>
  );
}

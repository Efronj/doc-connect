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
      <div style={{ height: "14rem", background: "var(--medical-gradient)", position: "relative" }}>
        <div style={{ position: "absolute", bottom: "-5rem", left: "2rem" }}>
          <div className="avatar-soft shadow-2xl" style={{ width: "10rem", height: "10rem", border: "6px solid white", fontSize: "2.5rem", borderRadius: "2rem" }}>
            {params.username?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex" style={{ justifyContent: "flex-end", padding: "1.5rem", gap: "1rem", marginTop: "1rem" }}>
        <Button variant="outline" style={{ borderRadius: "1.25rem", width: "3rem", height: "3rem", padding: 0 }}>
          <MoreHorizontal size={22} />
        </Button>
        <Button variant="outline" style={{ borderRadius: "1.25rem", width: "3rem", height: "3rem", padding: 0 }}>
          <Mail size={22} />
        </Button>
        <Button className="px-8 py-4" style={{ borderRadius: "1.5rem", fontWeight: 900 }}>Follow Professional</Button>
      </div>

      {/* Profile Info */}
      <div style={{ padding: "0 2rem", marginTop: "1rem" }}>
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-black text-slate-900">@{params.username}</h1>
          <BadgeCheck size={28} className="text-blue-600" />
        </div>
        <p className="text-lg text-slate-500 font-medium">Medical Professional</p>
        
        <p className="text-slate-600 leading-relaxed mt-6 text-lg max-w-2xl">
          This professional profile has not yet been fully populated. Follow to stay updated with clinical insights and medical cases shared by this user.
        </p>

        <div className="flex" style={{ flexWrap: "wrap", gap: "2rem", marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          <div className="flex items-center gap-2">
            <Stethoscope size={18} />
            <span className="font-bold">Medical Specialty</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="font-bold">Location</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Joined DoctorNet recently</span>
          </div>
        </div>

        <div className="flex gap-8 mt-8">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl text-slate-900">0</span>
            <span className="text-slate-500 font-bold">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl text-slate-900">0</span>
            <span className="text-slate-500 font-bold">Following</span>
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

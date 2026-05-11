"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Settings, 
  Plus, 
  MoreHorizontal, 
  Send, 
  Image as ImageIcon,
  Smile,
  Phone,
  Video
} from "lucide-react";
import { Button } from "@/components/ui";

export default function MessagesPage() {
  return (
    <div className="chat-container">
      {/* Conversations Sidebar */}
      <aside className="chat-sidebar">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Messages</h2>
            <div className="flex gap-2">
              <Settings size={20} className="text-slate-500" />
              <Plus size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute" style={{ left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={16} />
            <input 
              type="text" 
              placeholder="Search direct messages" 
              className="input" 
              style={{ paddingLeft: "2.5rem", paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <ChatListItem name="Dr. Sarah Chen" message="Thank you for the referral, John." time="2h" active />
          <ChatListItem name="Alex Rivera" message="Can we discuss the case at 5?" time="5h" unread />
          <ChatListItem name="Medical Study Group" message="New research paper attached" time="1d" />
        </div>
      </aside>

      {/* Chat Window Area */}
      <main className="hidden-mobile" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Chat Header */}
        <header style={{ height: "4rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem" }}>
          <div className="flex items-center gap-3">
            <div className="avatar" style={{ width: "2.5rem", height: "2.5rem" }}>SC</div>
            <div>
              <h3 className="font-bold text-sm">Dr. Sarah Chen</h3>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>
          <div className="flex gap-4 text-blue-600">
            <Phone size={20} />
            <Video size={20} />
            <MoreHorizontal size={20} className="text-slate-400" />
          </div>
        </header>

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="chat-bubble chat-bubble-them">
            Hi John, did you see the lab results for patient #402?
          </div>
          <div className="chat-bubble chat-bubble-me">
            Yes, just reviewing them now. The LDL is still a bit high.
          </div>
          <div className="chat-bubble chat-bubble-them">
            Agreed. We might need to adjust the statin dosage.
          </div>
        </div>

        {/* Chat Input */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-border">
            <button className="text-slate-400"><ImageIcon size={20} /></button>
            <button className="text-slate-400"><Smile size={20} /></button>
            <input 
              type="text" 
              placeholder="Start a new message" 
              className="textarea-ghost" 
              style={{ fontSize: "1rem", padding: "0.25rem 0" }}
            />
            <button className="icon-box" style={{ width: "2.5rem", height: "2.5rem", padding: "0.5rem" }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function ChatListItem({ name, message, time, active, unread }: any) {
  return (
    <div className={`flex gap-3 p-4 transition-all`} style={{ cursor: "pointer", backgroundColor: active ? "var(--primary-light)" : "transparent", borderLeft: active ? "4px solid var(--primary)" : "4px solid transparent" }}>
      <div className="avatar" style={{ width: "3rem", height: "3rem" }}>
        {name.split(" ").map((n: string) => n[0]).join("")}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div className="flex justify-between">
          <h4 className="font-bold text-sm truncate">{name}</h4>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-sm truncate" style={{ color: unread ? "var(--text)" : "var(--text-muted)", fontWeight: unread ? 700 : 400 }}>
          {message}
        </p>
      </div>
    </div>
  );
}

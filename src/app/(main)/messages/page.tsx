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
  Video,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
          {loading ? (
             <div className="text-center py-10 text-slate-400">Loading chats...</div>
          ) : conversations.length === 0 ? (
             <div className="text-center py-20 px-6">
                <MessageSquare size={40} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 text-sm">No conversations yet. Start a new chat with a colleague.</p>
             </div>
          ) : (
            conversations.map((chat, idx) => (
              <ChatListItem key={idx} {...chat} />
            ))
          )}
        </div>
      </aside>

      {/* Chat Window Area */}
      <main className="hidden-mobile" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "var(--bg-subtle)" }}>
         <div className="text-center">
            <div className="avatar-soft mx-auto mb-6" style={{ width: "5rem", height: "5rem" }}>
               <MessageSquare size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Your Messages</h2>
            <p className="text-slate-500">Select a conversation to start messaging.</p>
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

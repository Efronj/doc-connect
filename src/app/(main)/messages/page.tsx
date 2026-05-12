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
  MessageSquare,
  User
} from "lucide-react";
import { Button } from "@/components/ui";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && activeChat) {
      socket.emit("join-room", activeChat.id);
      socket.on("receive-message", (message: any) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => socket.off("receive-message");
    }
  }, [socket, activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat || !socket || !session?.user) return;
    const messageData = {
      roomId: activeChat.id,
      sender: session.user.name,
      text: inputText,
      timestamp: new Date().toISOString(),
    };
    socket.emit("send-message", messageData);
    setInputText("");
  };

  return (
    <div className="chat-container">
      {/* Conversations Sidebar */}
      <aside className="chat-sidebar">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">Messages</h2>
            <div className="flex gap-2">
              <Plus size={20} className="text-blue-600 cursor-pointer" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute" style={{ left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={16} />
            <input 
              type="text" 
              placeholder="Search conversations" 
              className="input" 
              style={{ paddingLeft: "2.5rem", paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.length === 0 ? (
             <div className="text-center py-20 px-6">
                <MessageSquare size={40} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-500 text-sm">No conversations yet.</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveChat({ id: "demo-room", name: "Medical General Chat" })}>
                  Join General Chat
                </Button>
             </div>
          ) : (
            conversations.map((chat) => (
              <ChatListItem 
                key={chat.id} 
                {...chat} 
                active={activeChat?.id === chat.id}
                onClick={() => setActiveChat(chat)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Chat Window Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: activeChat ? "white" : "var(--bg-subtle)" }}>
         {activeChat ? (
           <>
             {/* Chat Header */}
             <header className="flex items-center justify-between p-6 border-bottom">
               <div className="flex items-center gap-4">
                 <div className="avatar-soft" style={{ width: "3.5rem", height: "3.5rem" }}>
                   <User size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-slate-900">{activeChat.name}</h3>
                   <p className="text-sm text-green-500 font-bold">Active now</p>
                 </div>
               </div>
               <div className="flex gap-5 text-slate-400">
                 <Phone size={22} className="hover:text-blue-600 cursor-pointer" />
                 <Video size={22} className="hover:text-blue-600 cursor-pointer" />
                 <MoreHorizontal size={22} className="hover:text-blue-600 cursor-pointer" />
               </div>
             </header>

             {/* Messages Area */}
             <div style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
               {messages.map((msg, idx) => (
                 <div 
                  key={idx} 
                  className={`chat-bubble ${msg.sender === session?.user?.name ? 'chat-bubble-me' : 'chat-bubble-them'}`}
                 >
                   <p className="text-xs font-bold mb-1 opacity-70">{msg.sender}</p>
                   <p>{msg.text}</p>
                   <span className="text-[10px] mt-1 block opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
               ))}
               <div ref={scrollRef} />
             </div>

             {/* Chat Input */}
             <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
               <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
                 <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ImageIcon size={22} /></button>
                 <input 
                  type="text" 
                  placeholder="Start typing your medical query..." 
                  className="textarea-ghost"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1 }}
                 />
                 <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Smile size={22} /></button>
                 <Button onClick={handleSendMessage} disabled={!inputText.trim()} style={{ borderRadius: "1rem", width: "3rem", height: "3rem", padding: 0 }}>
                   <Send size={20} />
                 </Button>
               </div>
             </div>
           </>
         ) : (
           <div className="text-center">
              <div className="avatar-soft mx-auto mb-6" style={{ width: "5rem", height: "5rem" }}>
                 <MessageSquare size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Your Messages</h2>
              <p className="text-slate-500">Select a conversation to start messaging.</p>
           </div>
         )}
      </main>
    </div>
  );
}

function ChatListItem({ name, lastMessage, time, active, onClick }: any) {
  return (
    <div 
      className={`flex gap-3 p-4 transition-all cursor-pointer ${active ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50'}`} 
      onClick={onClick}
    >
      <div className="avatar" style={{ width: "3rem", height: "3rem" }}>
        {name[0]}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div className="flex justify-between">
          <h4 className="font-bold text-sm truncate">{name}</h4>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-sm truncate text-slate-500">
          {lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
}

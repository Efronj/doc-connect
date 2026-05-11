"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Bell, 
  Settings,
  BadgeCheck,
  Stethoscope
} from "lucide-react";

export default function NotificationsPage() {
  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Notifications Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: "4rem", backgroundColor: "white", zIndex: 10 }}>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, borderBottom: "4px solid var(--primary)" }}>All</button>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, color: "var(--text-muted)" }}>Verified</button>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, color: "var(--text-muted)" }}>Mentions</button>
      </div>

      <div className="flex-col">
        <NotificationItem 
          Icon={Heart} 
          iconColor="#ef4444" 
          content="Dr. Emily Blunt and 12 others liked your doubt about 'Cardiomyopathy differentiation'." 
          time="12m"
          unread
        />
        <NotificationItem 
          Icon={UserPlus} 
          iconColor="#3b82f6" 
          content="Dr. Alex Rivera followed you." 
          time="1h"
        />
        <NotificationItem 
          Icon={MessageSquare} 
          iconColor="#10b981" 
          content="New reply to your case study from Dr. Sarah Chen." 
          time="3h"
          unread
        />
        <NotificationItem 
          Icon={BadgeCheck} 
          iconColor="#3b82f6" 
          content="Your professional credentials have been verified. Welcome to the elite network!" 
          time="1d"
        />
        <NotificationItem 
          Icon={Stethoscope} 
          iconColor="#8b5cf6" 
          content="Trending Case: 'Rare autoimmune presentation in a 24M' is buzzing in your specialty." 
          time="2d"
        />
      </div>
    </div>
  );
}

function NotificationItem({ Icon, iconColor, content, time, unread }: any) {
  return (
    <div className={`notification-item ${unread ? "unread" : ""}`}>
      <div style={{ color: iconColor, padding: "0.5rem" }}>
        <Icon size={24} fill={unread ? iconColor : "transparent"} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex justify-between items-start mb-1">
          <div className="avatar" style={{ width: "2rem", height: "2rem", borderRadius: "50%" }} />
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-sm" style={{ color: "var(--text)", lineHeight: 1.5 }}>{content}</p>
      </div>
    </div>
  );
}

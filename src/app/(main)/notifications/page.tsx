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
import { useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Notifications Tabs */}
      <div className="flex" style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: "0", backgroundColor: "white", zIndex: 10 }}>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, borderBottom: "4px solid var(--primary)" }}>All</button>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, color: "var(--text-muted)" }}>Verified</button>
        <button style={{ flex: 1, padding: "1rem", fontWeight: 700, color: "var(--text-muted)" }}>Mentions</button>
      </div>

      <div className="flex-col">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="premium-card text-center py-24" style={{ margin: "2rem" }}>
             <Bell size={48} className="mx-auto mb-4 text-slate-200" />
             <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications yet</h3>
             <p className="text-slate-500">We'll notify you when someone interacts with your clinical cases.</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <NotificationItem 
              key={index}
              Icon={Bell} 
              iconColor="#3b82f6" 
              content={notif.content} 
              time={notif.time}
              unread={notif.unread}
            />
          ))
        )}
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

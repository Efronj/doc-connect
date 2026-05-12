"use client";

import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare, 
  User, 
  MoreHorizontal, 
  Plus,
  Stethoscope,
  Bookmark,
  Users,
  Activity
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";

import { useSession, signOut } from "next-auth/react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Search, label: "Explore", href: "/search" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: User, label: "Profile", href: session?.user?.name ? `/profile/${session.user.name.toLowerCase().replace(/\s+/g, '')}` : "/profile" },
  ];

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="flex-col gap-10">
          <Link href="/home" className="flex items-center gap-3 px-2">
            <div className="avatar-soft" style={{ width: "3rem", height: "3rem", borderRadius: "1rem" }}>
              <Stethoscope size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter">DoctorNet</span>
          </Link>
 
          <nav className="flex-col">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} className={`nav-link ${isActive ? "active" : ""}`}>
                  <item.icon size={22} />
                  <span className="hidden-mobile">{item.label}</span>
                </Link>
              );
            })}
          </nav>
 
          <Button className="w-full py-5 text-lg hidden-mobile shadow-premium" style={{ borderRadius: "1.5rem" }}>
            <Plus size={20} style={{ marginRight: "0.5rem" }} /> Share Case
          </Button>
        </div>
 
        {/* User Profile Mini */}
        {session && (
          <div 
            onClick={() => { if(confirm("Do you want to sign out?")) signOut(); }}
            className="mt-auto p-4 flex items-center justify-between cursor-pointer hover-bg-subtle" 
            style={{ borderRadius: "1.5rem", transition: "var(--transition)" }}
          >
            <div className="flex items-center gap-3">
              <div className="avatar-soft" style={{ width: "2.75rem", height: "2.75rem", fontSize: "0.8rem" }}>
                {session.user?.name?.[0] || "U"}
              </div>
              <div className="hidden-mobile">
                <h4 className="font-bold text-sm">{session.user?.name}</h4>
                {/* @ts-ignore */}
                <p className="text-slate-400" style={{ fontSize: "0.75rem" }}>{session.user?.specialty || "Medical Professional"}</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-slate-400 hidden-mobile" />
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="right-panel">
        <div className="premium-card" style={{ padding: "1.5rem" }}>
          <div className="relative">
            <Search className="absolute" style={{ left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
            <input 
              type="text" 
              placeholder="Search medical network..."
              className="input w-full"
              style={{ paddingLeft: "3.25rem", backgroundColor: "var(--bg-subtle)", borderRadius: "1.25rem" }}
            />
          </div>
        </div>

        <div className="premium-card" style={{ background: "var(--medical-gradient)", color: "white", padding: "2rem" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 glass rounded-xl">
              <Activity size={24} />
            </div>
            <h3 className="font-bold text-lg">AI Clinical Assistant</h3>
          </div>
          <p className="text-sm opacity-90 mb-6 leading-relaxed">Instantly analyze complex case studies and check global research data.</p>
          <Button variant="outline" className="w-full py-4" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}>
            Launch Assistant
          </Button>
        </div>

        <div className="premium-card">
          <h3 className="font-black text-xl mb-6 tracking-tight">Clinical Trends</h3>
          <div className="flex-col gap-6">
            <TrendItem category="Cardiology" tag="#AorticStenosis" posts="2.1k" />
            <TrendItem category="Neurology" tag="#StrokeProtocol" posts="1.8k" />
            <TrendItem category="Surgery" tag="#RoboticAssisted" posts="950" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
        <Link href="/home" className={pathname === "/home" ? "text-blue-600" : "text-slate-400"}><Home size={22} /></Link>
        <Link href="/search" className={pathname === "/search" ? "text-blue-600" : "text-slate-400"}><Search size={22} /></Link>
        <div className="icon-box shadow-premium" style={{ width: "3.5rem", height: "3.5rem", borderRadius: "1.25rem", marginTop: "-2.5rem" }}>
          <Plus size={26} />
        </div>
        <Link href="/notifications" className={pathname === "/notifications" ? "text-blue-600" : "text-slate-400"}><Bell size={22} /></Link>
        <Link href={session?.user?.name ? `/profile/${session.user.name.toLowerCase().replace(/\s+/g, '')}` : "/profile"} className={pathname.startsWith("/profile") ? "text-blue-600" : "text-slate-400"}><User size={22} /></Link>
      </nav>

      <style jsx>{`
        .hover-bg-alt:hover { background-color: var(--bg-alt); }
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function TrendItem({ category, tag, posts }: any) {
  return (
    <div style={{ cursor: "pointer" }} className="group">
      <div className="flex justify-between text-xs text-slate-400 font-bold mb-1">
        <span>{category} · Trending</span>
        <MoreHorizontal size={14} />
      </div>
      <h4 className="font-bold text-slate-800" style={{ fontSize: "1rem" }}>{tag}</h4>
      <p className="text-xs text-slate-400 mt-1">{posts} posts</p>
    </div>
  );
}

function DoctorSuggest({ name, specialty }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="avatar" style={{ width: "2.5rem", height: "2.5rem" }} />
        <div>
          <h4 className="font-bold text-sm" style={{ lineHeight: 1.2 }}>{name}</h4>
          <p className="text-slate-400" style={{ fontSize: "0.7rem" }}>{specialty}</p>
        </div>
      </div>
      <Button variant="primary" style={{ padding: "0.4rem 1rem", fontSize: "0.75rem", borderRadius: "9999px" }}>Follow</Button>
    </div>
  );
}

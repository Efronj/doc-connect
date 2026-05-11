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
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: Search, label: "Explore", href: "/search" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
    { icon: Users, label: "Communities", href: "/communities" },
    { icon: User, label: "Profile", href: "/profile/johndoe_md" },
  ];

  return (
    <div className="bg-white">
      <div className="app-container">
        
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="flex-col" style={{ gap: "0.5rem" }}>
            <Link href="/home" className="flex items-center gap-3" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
              <div className="icon-box" style={{ padding: "0.6rem", borderRadius: "0.85rem", boxShadow: "var(--shadow-md)" }}>
                <Stethoscope size={24} />
              </div>
              <span className="text-2xl font-black hidden-mobile tracking-tighter">DoctorNet</span>
            </Link>

            <nav className="flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href} className={`nav-link ${isActive ? "active" : ""}`}>
                    <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-lg hidden-mobile">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 hidden-mobile">
              <Button className="w-full py-4 text-lg" style={{ borderRadius: "1.25rem", boxShadow: "var(--shadow-lg)" }}>
                <Plus size={20} style={{ marginRight: "0.5rem" }} /> Post Doubt
              </Button>
            </div>
            
            <div className="mt-6 display-desktop" style={{ display: "none" }}>
               <button className="icon-box w-full" style={{ borderRadius: "1rem", height: "3.5rem" }}>
                 <Plus size={24} />
               </button>
            </div>
          </div>

          {/* User Profile Mini */}
          <div className="flex items-center justify-between p-2 hover-bg-alt" style={{ borderRadius: "1.25rem", cursor: "pointer", transition: "var(--transition)" }}>
            <div className="flex items-center gap-3">
              <div className="avatar font-bold text-blue-600" style={{ border: "2px solid white", boxShadow: "var(--shadow-sm)" }}>JD</div>
              <div className="hidden-mobile">
                <h4 className="font-bold text-sm" style={{ lineHeight: 1 }}>Dr. John Doe</h4>
                <p className="text-slate-400" style={{ fontSize: "0.7rem", marginTop: "0.2rem" }}>Cardiologist</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-slate-400 hidden-mobile" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="header-sticky">
            <h1 className="text-xl font-black text-slate-800 capitalize tracking-tight">
              {pathname.split("/").pop()?.replace("-", " ") || "Home"}
            </h1>
          </header>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-panel">
          <div className="relative">
            <Search className="absolute" style={{ left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
            <input 
              type="text" 
              placeholder="Search DoctorNet"
              className="input"
              style={{ paddingLeft: "3.25rem", borderRadius: "9999px", backgroundColor: "var(--bg-alt)", border: "1px solid transparent" }}
            />
          </div>

          <div className="gradient-card" style={{ padding: "1.75rem" }}>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <div style={{ padding: "0.3rem 0.6rem", background: "rgba(255,255,255,0.2)", borderRadius: "0.6rem", fontSize: "0.7rem", fontWeight: 900 }}>AI</div>
              Medical Assistant
            </h3>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>Analyze complex cases or check drug interactions with our specialized medical AI.</p>
            <Button variant="outline" className="w-full" style={{ background: "rgba(255,255,255,0.15)", color: "white", borderColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}>
              Start Consultation
            </Button>
          </div>

          <div className="panel-card" style={{ padding: "1.5rem" }}>
            <h3 className="font-black text-lg mb-6 tracking-tight">Trending Topics</h3>
            <div className="flex-col gap-6">
              <TrendItem category="Cardiology" tag="#HeartHealth" posts="2.4k" />
              <TrendItem category="Education" tag="#MBBSLife" posts="1.8k" />
              <TrendItem category="Surgery" tag="#RoboticSurgery" posts="842" />
            </div>
            <button className="text-blue-600 font-bold mt-6 text-sm hover:underline">Show more</button>
          </div>

          <div className="panel-card" style={{ padding: "1.5rem" }}>
            <h3 className="font-black text-lg mb-6 tracking-tight">Doctors to follow</h3>
            <div className="flex-col gap-5">
               <DoctorSuggest name="Dr. Sarah Chen" specialty="Neurologist" />
               <DoctorSuggest name="Dr. Alex Rivera" specialty="Pediatrician" />
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <Link href="/home" className={pathname === "/home" ? "text-blue-600" : "text-slate-400"}><Home size={24} /></Link>
          <Link href="/search" className={pathname === "/search" ? "text-blue-600" : "text-slate-400"}><Search size={24} /></Link>
          <div className="icon-box" style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", marginTop: "-2rem", boxShadow: "var(--shadow-lg)" }}><Plus size={28} /></div>
          <Link href="/notifications" className={pathname === "/notifications" ? "text-blue-600" : "text-slate-400"}><Bell size={24} /></Link>
          <Link href="/profile/johndoe_md" className={pathname.startsWith("/profile") ? "text-blue-600" : "text-slate-400"}><User size={24} /></Link>
        </nav>

      </div>
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

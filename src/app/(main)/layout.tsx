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
    { icon: User, label: "Profile", href: "/profile/johndoe_md" },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="app-container">
        
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="flex-col gap-8">
            <Link href="/home" className="flex items-center gap-2 px-4">
              <Stethoscope size={32} className="text-blue-600" />
              <span className="text-2xl font-black tracking-tighter">DoctorNet</span>
            </Link>

            <nav className="flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href} className={`nav-link ${isActive ? "active" : ""}`}>
                    <item.icon size={24} />
                    <span className="hidden-mobile">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <Button className="w-full py-4 text-lg hidden-mobile" style={{ borderRadius: "var(--radius-lg)" }}>
              <Plus size={20} style={{ marginRight: "0.5rem" }} /> Post Case
            </Button>
          </div>

          {/* User Profile Mini */}
          <div className="card p-3 mt-auto flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="avatar-clean">JD</div>
              <div className="hidden-mobile">
                <h4 className="font-bold text-sm">Dr. John Doe</h4>
                <p className="text-slate-500" style={{ fontSize: "0.75rem" }}>Cardiologist</p>
              </div>
            </div>
            <MoreHorizontal size={18} className="text-slate-400 hidden-mobile" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="right-panel">
          <div className="card p-4">
            <div className="relative">
              <Search className="absolute" style={{ left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} size={18} />
              <input 
                type="text" 
                placeholder="Search cases..."
                className="input"
                style={{ paddingLeft: "3rem", backgroundColor: "white", border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div className="card p-5" style={{ background: "var(--medical-gradient)", color: "white" }}>
            <h3 className="font-bold text-lg mb-2">Medical AI Assistant</h3>
            <p className="text-sm opacity-90 mb-4">Analyze patient symptoms or check contraindications.</p>
            <Button variant="outline" className="w-full" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
              Open Assistant
            </Button>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-lg mb-4">Trending in Medicine</h3>
            <div className="flex-col gap-4">
              <TrendItem category="Cardiology" tag="#AorticStenosis" posts="2.1k" />
              <TrendItem category="Pediatrics" tag="#VaccineStudy" posts="1.4k" />
              <TrendItem category="Neurology" tag="#StrokeProtocol" posts="950" />
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <Link href="/home" className={pathname === "/home" ? "text-blue-600" : "text-slate-400"}><Home size={24} /></Link>
          <Link href="/search" className={pathname === "/search" ? "text-blue-600" : "text-slate-400"}><Search size={24} /></Link>
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

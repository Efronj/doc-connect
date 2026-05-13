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
  Activity,
  Shield,
  LogOut
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
    { icon: Bookmark, label: "Saved", href: "/settings?tab=saved" },
    { icon: User, label: "Profile", href: session?.user?.name ? `/profile/${session.user.name.toLowerCase().replace(/\s+/g, '')}` : "/profile" },
    { icon: Shield, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="app-container bg-[#fcfdfe]">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar border-r border-slate-100/50 bg-white">
        <div className="flex flex-col gap-12 h-full py-8">
          <Link href="/home" className="flex items-center gap-4 px-4 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
              <Stethoscope size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">DoctorNet</span>
          </Link>
 
          <nav className="flex flex-col gap-2 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold ${isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="hidden-mobile">{item.label}</span>
                </Link>
              );
            })}
          </nav>
 
          <div className="px-4 mt-4">
            <Button className="w-full py-6 text-lg hidden-mobile shadow-xl shadow-blue-100 bg-blue-600 hover:bg-blue-700 rounded-2xl">
              <Plus size={20} className="mr-2" /> Share Case
            </Button>
          </div>

          {/* User Profile Mini */}
          {session && (
            <div className="mt-auto px-2">
              <div 
                className="p-3 flex items-center justify-between rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <div className="hidden-mobile">
                    <h4 className="font-bold text-sm text-slate-900">{session.user?.name}</h4>
                    <p className="text-slate-400 font-bold" style={{ fontSize: "10px" }}>
                      {session.user.role || "DOCTOR"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors hidden-mobile"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="right-panel flex flex-col gap-8 py-8">

        {/* AI Assistant Card */}
        <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
                <Activity size={24} />
              </div>
              <h3 className="font-black text-white text-xl tracking-tight">Clinical AI</h3>
            </div>
            
            <p className="text-blue-100/70 text-sm mb-8 leading-relaxed font-medium">
              Analyze complex case histories and check global clinical research in seconds.
            </p>
            
            <Button className="w-full py-4 bg-white text-slate-900 hover:bg-blue-50 font-black rounded-2xl transition-all">
              Launch Assistant
            </Button>
          </div>
        </div>

        {/* Trends Section */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Clinical Trends</h3>
            <div className="px-2 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</div>
          </div>
          
          <div className="flex flex-col gap-6">
            <TrendItem category="Cardiology" tag="#AorticStenosis" posts="2.1k" />
            <TrendItem category="Neurology" tag="#StrokeProtocol" posts="1.8k" />
            <TrendItem category="Surgery" tag="#RoboticAssisted" posts="950" />
            <TrendItem category="Pediatrics" tag="#NeonatalCare" posts="740" />
          </div>

          <button className="w-full mt-8 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
            View All Trends
          </button>
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
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function TrendItem({ category, tag, posts }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">{category}</span>
        <MoreHorizontal size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{tag}</h4>
      <p className="text-[10px] font-bold text-slate-400 mt-1">{posts} practitioners discussing</p>
    </div>
  );
}

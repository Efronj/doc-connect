"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { 
  Calendar, 
  MapPin, 
  BadgeCheck, 
  MoreHorizontal,
  Mail,
  Stethoscope,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui";
import { use } from "react";

export default function ProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = session?.user?.name?.toLowerCase().replace(/\s+/g, '') === params.username.toLowerCase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${params.username}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.username]);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading profile...</div>;
  if (!user) return <div className="text-center py-20 font-bold text-slate-400">Doctor not found</div>;

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Cover Image */}
      <div style={{ height: "16rem", background: "var(--medical-gradient)", position: "relative" }}>
        <div style={{ position: "absolute", bottom: "-5rem", left: "2rem" }}>
          <div className="avatar-soft shadow-2xl" style={{ width: "10rem", height: "10rem", border: "8px solid white", fontSize: "2.5rem", borderRadius: "2.5rem" }}>
            {user.name?.[0] || "U"}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex" style={{ justifyContent: "flex-end", padding: "1.5rem", gap: "1rem", marginTop: "1.5rem" }}>
        {isOwnProfile ? (
          <Link href="/settings">
            <Button variant="outline" className="px-8" style={{ borderRadius: "1.5rem", fontWeight: 900 }}>
              <Settings size={20} className="mr-2" /> Edit Profile
            </Button>
          </Link>
        ) : (
          <>
            <Button variant="outline" style={{ borderRadius: "1.25rem", width: "3.5rem", height: "3.5rem", padding: 0 }}>
              <Mail size={22} />
            </Button>
            <Button className="px-8 py-4" style={{ borderRadius: "1.5rem", fontWeight: 900 }}>Follow Doctor</Button>
          </>
        )}
      </div>

      {/* Profile Info */}
      <div style={{ padding: "0 2rem", marginTop: "1rem" }}>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
          <BadgeCheck size={28} className="text-blue-600" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-lg text-blue-600 font-black uppercase tracking-widest" style={{ fontSize: '0.8rem' }}>
            {user.role || 'DOCTOR'}
          </p>
          <span className="text-slate-300">•</span>
          <p className="text-lg text-slate-500 font-bold" style={{ fontSize: '0.9rem' }}>
            @{user.username || params.username}
          </p>
        </div>
        
        <p className="text-slate-700 leading-relaxed mt-6 text-lg max-w-2xl font-medium">
          {user.bio || "This medical professional has not added a bio yet."}
        </p>

        <div className="flex" style={{ flexWrap: "wrap", gap: "2rem", marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
          <div className="flex items-center gap-2 text-slate-600 font-bold">
            <Stethoscope size={20} className="text-blue-600" />
            <span>{user.department || "General Medicine"}</span>
          </div>
          {user.hospital && (
            <div className="flex items-center gap-2 text-slate-600 font-bold">
              <MapPin size={20} className="text-blue-600" />
              <span>{user.hospital}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={20} />
            <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex gap-10 mt-8 border-t border-slate-100 pt-8">
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-900">0</span>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-900">0</span>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Following</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-900">{user._count?.posts || 0}</span>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Cases</span>
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

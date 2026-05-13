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
  Settings,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { use } from "react";

export default function ProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
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

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/user/${params.username}/posts`);
        setUserPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUser();
    fetchPosts();
  }, [params.username]);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading profile...</div>;
  if (!user) return <div className="text-center py-20 font-bold text-slate-400">Doctor not found</div>;

  return (
    <div className="pb-20">
      {/* Cover Image */}
      <div className="h-40 lg:h-64 bg-gradient-to-br from-blue-600 to-blue-900 relative">
        <div className="absolute -bottom-12 lg:-bottom-20 left-4 lg:left-8">
          <div className="w-24 h-24 lg:w-40 lg:h-40 bg-blue-50 flex items-center justify-center text-2xl lg:text-4xl font-black text-blue-600 rounded-3xl lg:rounded-[2.5rem] border-4 lg:border-8 border-white shadow-xl">
            {user.name?.[0] || "U"}
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex justify-end p-4 lg:p-6 gap-3 mt-12 lg:mt-6">
        {isOwnProfile ? (
          <Link href="/settings">
            <Button variant="outline" className="rounded-full px-6 lg:px-8 border-slate-200 text-sm">
              <Settings size={18} className="mr-2" /> Edit Profile
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2 lg:gap-3">
            <Button className="rounded-full px-4 lg:px-8 shadow-premium text-sm">
              Follow
            </Button>
            <Link href={`/messages?user=${user?.name}`}>
              <Button variant="outline" className="rounded-full px-4 lg:px-8 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm">
                <Mail size={18} className="mr-2" /> Message
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 lg:px-8 mt-4 lg:mt-8">
        <div className="flex items-center gap-2 lg:gap-3">
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
          <BadgeCheck size={24} className="text-blue-600 lg:w-7 lg:h-7" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[10px] lg:text-xs text-blue-600 font-black uppercase tracking-widest">
            {user.role || 'DOCTOR'}
          </p>
          <span className="text-slate-300">•</span>
          <p className="text-xs lg:text-sm text-slate-500 font-bold">
            @{user.username || params.username}
          </p>
        </div>
        
        <p className="text-slate-700 leading-relaxed mt-4 lg:mt-6 text-sm lg:text-lg max-w-2xl font-medium">
          {user.bio || "This medical professional has not added a bio yet."}
        </p>

        <div className="flex flex-wrap gap-4 lg:gap-8 mt-6 lg:mt-8 text-slate-600 text-xs lg:text-sm">
          <div className="flex items-center gap-2 font-bold">
            <Stethoscope size={18} className="text-blue-600" />
            <span>{user.department || "General Medicine"}</span>
          </div>
          {user.hospital && (
            <div className="flex items-center gap-2 font-bold">
              <MapPin size={18} className="text-blue-600" />
              <span>{user.hospital}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={18} />
            <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex gap-8 lg:gap-12 mt-8 border-t border-slate-100 pt-8">
          <div className="flex flex-col">
            <span className="font-black text-xl lg:text-2xl text-slate-900">0</span>
            <span className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-wider">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl lg:text-2xl text-slate-900">0</span>
            <span className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-wider">Following</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl lg:text-2xl text-slate-900">{user._count?.posts || 0}</span>
            <span className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-wider">Cases</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-100 mt-8 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <TabItem label="Cases" active />
        <TabItem label="Insights" />
        <TabItem label="Library" />
      </div>

      {/* Grid Content */}
      {postsLoading ? (
        <div className="text-center py-20 text-slate-400 font-bold">Loading cases...</div>
      ) : userPosts.length === 0 ? (
        <div className="py-20 text-center px-4">
          <p className="text-lg font-bold text-slate-400">No cases shared yet</p>
          <p className="text-sm text-slate-400">Clinical posts from @{params.username} will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 lg:gap-1 mt-1 px-0.5 lg:px-1">
          {userPosts.map((post) => (
            <div key={post.id} className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer group">
              {post.image ? (
                <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 lg:p-4 text-center">
                  <p className="text-[8px] lg:text-[10px] font-bold text-slate-400 line-clamp-3">{post.content}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 lg:gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Heart size={16} fill="white" className="lg:w-5 lg:h-5" />
                  <span className="font-bold text-xs lg:text-base">{post.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

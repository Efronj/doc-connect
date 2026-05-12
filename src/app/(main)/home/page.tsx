"use client";

import { motion } from "framer-motion";
import { 
  Image as ImageIcon, 
  HelpCircle, 
  MessageCircle, 
  Heart, 
  Share, 
  MoreHorizontal,
  Stethoscope,
  Bookmark,
  Users,
  Activity,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() || !session?.user) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (selectedImage) {
        setUploading(true);
        const uploadRes = await axios.post("/api/upload", { image: selectedImage });
        imageUrl = uploadRes.data.url;
        setUploading(false);
      }

      await axios.post("/api/posts", {
        content: postContent,
        // @ts-ignore
        authorId: session.user.id || session.user.uid,
        media: imageUrl
      });
      
      setPostContent("");
      setSelectedImage(null);
      toast.success("Post shared successfully!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to share post");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div style={{ paddingBottom: "5rem" }}>
      <header className="page-header flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Medical Feed</h1>
        <div className="flex gap-2">
           <button className="avatar-soft" style={{ width: "2.75rem", height: "2.75rem", borderRadius: "1rem" }}>
             <Activity size={20} />
           </button>
        </div>
      </header>

      {/* Post Creator */}
      {session && (
        <div className="post-creator-minimal">
          <div className="flex gap-5">
            <div className="avatar-soft">
              {session.user?.name?.[0] || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <textarea 
                placeholder="What clinical case or doubt do you have today?" 
                className="textarea-ghost"
                rows={2}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                style={{ fontSize: "1.25rem", fontWeight: 500 }}
              />
              
              {selectedImage && (
                <div className="relative mt-4 rounded-2xl overflow-hidden group h-64 shadow-lg border border-slate-100">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus size={20} style={{ transform: "rotate(45deg)" }} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-4">
                  <input 
                    type="file" 
                    id="image-upload" 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                  <label htmlFor="image-upload" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <ImageIcon size={20} />
                    <span className="text-sm font-bold">Clinical Image</span>
                  </label>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Activity size={20} />
                    <span className="text-sm font-bold">Case Study</span>
                  </button>
                </div>
                <Button 
                  onClick={handlePost}
                  disabled={isSubmitting || uploading || !postContent.trim()}
                  className="px-8"
                >
                  {isSubmitting ? "Sharing..." : uploading ? "Uploading..." : "Share Case"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-col"
      >
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-medium">Loading medical feed...</div>
        ) : posts.length === 0 ? (
          <div className="premium-card text-center py-20">
            <Stethoscope size={48} className="mx-auto mb-4 text-slate-200" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">The feed is empty</h3>
            <p className="text-slate-500">Be the first to share a medical case or insight!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              author={post.author?.name || "Anonymous Doctor"} 
              specialty={post.author?.specialty || "Medical Practitioner"}
              content={post.content}
              time={new Date(post.createdAt).toLocaleDateString()}
              likes={post.likes?.length || 0}
              comments={post._count?.comments || 0}
              image={post.media}
              type={post.type}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}

function PostCard({ author, specialty, content, time, likes, comments, type, image }: any) {
  return (
    <div className="premium-card">
      <div className="flex gap-5">
        <div className="avatar-soft">
          {author.split(" ").map((n: string) => n[0]).join("")}
        </div>
        
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-slate-900">{author}</h4>
              <p className="text-blue-600 font-bold" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{specialty} · {time}</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors"><MoreHorizontal size={22} /></button>
          </div>

          {type === "DOUBT" && (
            <div className="mt-3 px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold w-fit border border-emerald-100">
              Medical Doubt
            </div>
          )}

          <p className="text-slate-700 leading-relaxed my-5" style={{ fontSize: "1.1rem", whiteSpace: "pre-wrap", fontWeight: 400 }}>
            {content}
          </p>

          {image && (
            <div style={{ borderRadius: "1.5rem", overflow: "hidden", marginBottom: "1.5rem", height: "20rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
              <img src={image} alt="Medical visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <div className="flex gap-10 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all">
              <MessageCircle size={22} />
              <span className="text-sm font-bold">{comments}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all">
              <Heart size={22} />
              <span className="text-sm font-bold">{likes}</span>
            </button>
            <button className="text-slate-400 hover:text-blue-600 transition-all ml-auto"><Bookmark size={22} /></button>
            <button className="text-slate-400 hover:text-blue-600 transition-all"><Share size={22} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

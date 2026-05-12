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
  const [postType, setPostType] = useState("POST");
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
        authorId: session.user.id,
        media: imageUrl,
        type: postType
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

              <div className="flex gap-2 mb-4">
                <PostTypeBtn 
                  label="Post" 
                  active={postType === "POST"} 
                  onClick={() => setPostType("POST")} 
                />
                <PostTypeBtn 
                  label="Medical Doubt" 
                  active={postType === "DOUBT"} 
                  onClick={() => setPostType("DOUBT")} 
                />
                <PostTypeBtn 
                  label="Case Study" 
                  active={postType === "CASE"} 
                  onClick={() => setPostType("CASE")} 
                />
              </div>
              
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
              id={post.id}
              author={post.author?.name || "Anonymous Doctor"} 
              specialty={post.author?.department || post.author?.specialty || "Medical Practitioner"}
              role={post.author?.role}
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

function PostCard({ id, author, specialty, content, time, likes, comments, type, image, role }: any) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const handleLike = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setCurrentLikes(prev => previousState ? prev - 1 : prev + 1);
    
    try {
      await axios.post(`/api/posts/${id}/like`);
    } catch (error) {
      setIsLiked(previousState);
      setCurrentLikes(prev => previousState ? prev + 1 : prev - 1);
      toast.error("Failed to update like");
    }
  };

  const handleSave = async () => {
    const previousState = isSaved;
    setIsSaved(!isSaved);
    
    try {
      await axios.post(`/api/posts/${id}/save`);
      toast.success(isSaved ? "Case removed from saved" : "Case saved to library");
    } catch (error) {
      setIsSaved(previousState);
      toast.error("Failed to save case");
    }
  };

  return (
    <div className="premium-card overflow-hidden" style={{ padding: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="avatar-soft" style={{ width: "3.5rem", height: "3.5rem" }}>
            {author.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 tracking-tight">{author}</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${role === 'STUDENT' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {role || 'DOCTOR'}
              </span>
            </div>
            <p className="text-slate-400 font-bold" style={{ fontSize: "0.75rem" }}>
              {specialty} · {time}
            </p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-900 transition-colors">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {type === "DOUBT" && (
          <div className="mb-4 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest w-fit border border-emerald-100">
            Medical Doubt
          </div>
        )}
        <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Media */}
      {image && (
        <div className="relative aspect-square w-full bg-slate-100 group">
          <img 
            src={image} 
            alt="Clinical visual" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      )}

      {/* Social Actions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all active:scale-125 ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
            >
              <Heart size={28} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all">
              <MessageCircle size={28} strokeWidth={2.5} />
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all">
              <Share size={28} strokeWidth={2.5} />
            </button>
          </div>
          <button 
            onClick={handleSave}
            className={`transition-all active:scale-125 ${isSaved ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
          >
            <Bookmark size={28} fill={isSaved ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-slate-900">
            {currentLikes} doctors <span className="text-slate-400 font-bold">liked this</span>
          </p>
        </div>
        
        {comments > 0 && (
          <button className="mt-3 text-slate-400 text-sm font-bold hover:text-blue-600">
            View all {comments} medical insights
          </button>
        )}
      </div>
    </div>
  );
}

function PostTypeBtn({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );
}
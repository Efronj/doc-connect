"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Trash2,
  Edit3,
  X
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

              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mb-6 gap-1">
                <PostTypeBtn 
                  label="Insight" 
                  icon={<MessageCircle size={16} />}
                  active={postType === "POST"} 
                  onClick={() => setPostType("POST")} 
                />
                <PostTypeBtn 
                  label="Doubt" 
                  icon={<HelpCircle size={16} />}
                  active={postType === "DOUBT"} 
                  onClick={() => setPostType("DOUBT")} 
                />
                <PostTypeBtn 
                  label="Case Study" 
                  icon={<Activity size={16} />}
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
              specialty={post.author?.department || "Medical Practitioner"}
              role={post.author?.role}
              content={post.content}
              time={new Date(post.createdAt).toLocaleDateString()}
              likes={post.likes?.length || 0}
              comments={post._count?.comments || 0}
              image={post.media}
              type={post.type}
              authorId={post.authorId}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}

function PostCard({ id, author, specialty, content, time, likes, comments, type, image, role, authorId }: any) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);

  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(comments);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      toast.success("Case deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete case");
    }
  };

  const handleEditPost = async () => {
    try {
      await axios.patch(`/api/posts/${id}`, { content: editContent });
      toast.success("Case updated");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update case");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setCommentsList(prev => prev.filter(c => c.id !== commentId));
      setCommentsCount((prev: number) => prev - 1);
      toast.success("Insight removed");
    } catch (error) {
      toast.error("Failed to remove insight");
    }
  };

  const handleLike = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setCurrentLikes((prev: number) => previousState ? prev - 1 : prev + 1);
    
    try {
      await axios.post(`/api/posts/${id}/like`);
    } catch (error) {
      setIsLiked(previousState);
      setCurrentLikes((prev: number) => previousState ? prev + 1 : prev - 1);
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

  const handleShare = () => {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Clinical case link copied!");
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${id}/comments`);
      setCommentsList(res.data);
    } catch (error) {
      console.error("Failed to fetch comments");
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    setIsCommenting(true);
    
    // Optimistic update
    const newComment = {
      id: Date.now().toString(),
      content: commentInput,
      createdAt: new Date().toISOString(),
      user: {
        name: "You",
        role: "DOCTOR"
      }
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentsCount((prev: number) => prev + 1);
    const text = commentInput;
    setCommentInput("");

    try {
      const res = await axios.post(`/api/posts/${id}/comments`, { content: text });
      // Replace optimistic comment with real one
      setCommentsList((prev: any[]) => [res.data, ...prev.filter(c => c.id !== newComment.id)]);
    } catch (error) {
      setCommentsList((prev: any[]) => prev.filter(c => c.id !== newComment.id));
      setCommentsCount((prev: number) => prev - 1);
      toast.error("Failed to post comment");
    } finally {
      setIsCommenting(false);
    }
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments]);

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
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-300 hover:text-slate-900 transition-colors p-2"
          >
            <MoreHorizontal size={24} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden"
              >
                {(session?.user as any)?.id === authorId ? (
                  <>
                    <button 
                      onClick={() => { setIsEditing(true); setShowMenu(false); }}
                      className="flex items-center gap-3 w-full p-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Edit3 size={18} /> Edit Case
                    </button>
                    <button 
                      onClick={handleDeletePost}
                      className="flex items-center gap-3 w-full p-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} /> Delete Case
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-3 w-full p-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    Report Content
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        {type === "DOUBT" && (
          <div className="mb-4 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest w-fit border border-emerald-100">
            Medical Doubt
          </div>
        )}
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea 
              className="input-minimal min-h-[100px]"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleEditPost} className="px-6">Save</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="px-6">Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">
            {content}
          </p>
        )}
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
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all"
            >
              <MessageCircle size={28} strokeWidth={2.5} />
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all"
            >
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
        
        {commentsCount > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="mt-3 text-slate-400 text-sm font-bold hover:text-blue-600"
          >
            {showComments ? "Hide medical insights" : `View all ${commentsCount} medical insights`}
          </button>
        )}

        {/* Comment Section */}
        {showComments && (
          <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-5">
            <div className="flex gap-3">
              <div className="avatar-soft" style={{ width: "2.5rem", height: "2.5rem", flexShrink: 0 }}>
                {session?.user?.name?.[0] || "U"}
              </div>
              <div className="flex-1 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Share a clinical insight..." 
                  className="input-minimal"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button 
                  onClick={handleAddComment} 
                  disabled={isCommenting || !commentInput.trim()}
                  className="px-4"
                >
                  Post
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {commentsList.map((c) => (
                <div key={c.id} className="flex gap-3 group">
                  <div className="avatar-soft" style={{ width: "2.5rem", height: "2.5rem", flexShrink: 0 }}>
                    {c.user?.name?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-sm text-slate-900">{c.user?.name}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-black uppercase text-slate-500">
                        {c.user?.role || "DOCTOR"}
                      </span>
                      <span className="text-[10px] text-slate-300 font-bold">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {c.content}
                    </p>
                  </div>
                  {(session?.user as any)?.id === c.userId && (
                    <button 
                      onClick={() => handleDeleteComment(c.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function PostTypeBtn({ label, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 lg:px-5 py-2 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
        active 
          ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
          : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
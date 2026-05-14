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
  Activity,
  Plus,
  Trash2,
  Edit3,
  X,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
    if (session?.user) {
      if (!session.user.department) {
        router.push("/onboarding");
        return;
      }
    }
    fetchPosts();
  }, [session, router]);

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
        image: imageUrl
      });
      
      setPostContent("");
      setSelectedImage(null);
      toast.success("Case shared with the community!");
      fetchPosts();
    } catch (error) {
      toast.error("Failed to share case");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">

      <div className="pt-12 pb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Feed</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest Insights</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-blue-600">
              {i === 3 ? "+12" : "D"}
            </div>
          ))}
        </div>
      </div>

      {/* Post Creator */}
      {session && (
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 mb-10 shadow-xl shadow-slate-200/40 border border-slate-100 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg ring-4 ring-blue-50/50">
                {session.user?.name?.[0] || "U"}
              </div>
              <div style={{ flex: 1 }}>
                <textarea 
                  placeholder="Share a clinical case, doubt, or insight..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-slate-300 resize-none py-1"
                  rows={2}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />

                <div className="flex items-center gap-2 mt-4 p-1 bg-slate-50/50 rounded-xl w-fit border border-slate-100">
                  <PostTypeBtn 
                    label="Insight" 
                    icon={<MessageCircle size={16} />}
                    active={postType === "POST"} 
                    onClick={() => setPostType("POST")} 
                  />
                  <PostTypeBtn 
                    label="Clinical Doubt" 
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
                  <div className="relative mt-8 rounded-[2.5rem] overflow-hidden group h-[400px] shadow-2xl border-4 border-white">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                  <div className="flex gap-6">
                    <input 
                      type="file" 
                      id="image-upload" 
                      hidden 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                    <label htmlFor="image-upload" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors border border-slate-100">
                        <ImageIcon size={18} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Attachment</span>
                    </label>
                  </div>
                  <Button 
                    onClick={handlePost}
                    disabled={isSubmitting || uploading || !postContent.trim()}
                    className="px-8 py-3 text-sm font-black rounded-xl shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Publishing..." : uploading ? "Uploading..." : "Share with Doctors"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feed Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Clinical Records...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-[3rem] text-center py-24 border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
              <Stethoscope size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">The medical feed is quiet</h3>
            <p className="text-slate-500 font-medium text-lg">Be the pioneer and share the first clinical insight today.</p>
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
              image={post.image}
              authorId={post.authorId}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}

function PostCard({ id, author, specialty, content, time, likes, comments, image, role, authorId }: any) {
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

  const handleLike = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);
    setCurrentLikes((prev: number) => previousState ? prev - 1 : prev + 1);
    try {
      await axios.post(`/api/posts/${id}/like`);
    } catch (error) {
      setIsLiked(previousState);
      setCurrentLikes((prev: number) => previousState ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    try {
      await axios.post(`/api/posts/${id}/save`);
      toast.success(isSaved ? "Removed from library" : "Saved to clinical library");
    } catch (error) {
      setIsSaved(!isSaved);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    setIsCommenting(true);
    const text = commentInput;
    setCommentInput("");

    try {
      const res = await axios.post(`/api/posts/${id}/comments`, { content: text });
      setCommentsList((prev) => [res.data, ...prev]);
      setCommentsCount((prev: number) => prev + 1);
    } catch (error) {
      toast.error("Failed to post insight");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this case study?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      toast.success("Case removed");
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting case");
    }
  };

  useEffect(() => {
    if (showComments) {
      axios.get(`/api/posts/${id}/comments`).then(res => setCommentsList(res.data));
    }
  }, [showComments, id]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500"
    >
      {/* Post Header */}
      <div className="p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 flex items-center justify-center text-blue-600 font-black text-lg shadow-inner">
            {author[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-black text-slate-900 tracking-tight text-base">{author}</h4>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-full">
                <ShieldCheck size={10} className="text-blue-600" />
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Verified</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400">
              <span className="text-blue-600/60 uppercase tracking-tighter">{specialty}</span>
              <span className="mx-2 opacity-30">|</span>
              {time}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors">
            <MoreHorizontal size={20} />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden"
              >
                {(session?.user as any)?.id === authorId ? (
                  <>
                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                      <Edit3 size={16} /> Edit Clinical Case
                    </button>
                    <button onClick={handleDeletePost} className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50">
                      <Trash2 size={16} /> Delete Case
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <Bookmark size={16} /> Report Case
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 lg:px-8 pb-4">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <textarea 
              className="input-minimal min-h-[140px] text-lg"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={() => { /* Handle Update Logic */ setIsEditing(false); }}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">
            {content}
          </p>
        )}

        {image && (
          <div className="mt-8 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img src={image} alt="Clinical Case" className="w-full object-cover max-h-[600px]" />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 lg:px-8 py-8 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ActionButton 
            icon={<Heart size={22} fill={isLiked ? "currentColor" : "none"} />}
            count={currentLikes}
            active={isLiked}
            onClick={handleLike}
            activeClass="text-red-500 bg-red-50"
          />
          <ActionButton 
            icon={<MessageCircle size={22} />}
            count={commentsCount}
            active={showComments}
            onClick={() => setShowComments(!showComments)}
            activeClass="text-blue-600 bg-blue-50"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
              toast.success("Case link copied!");
            }}
            className="w-12 h-12 rounded-2xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all hover:scale-105 active:scale-95"
          >
            <Share size={22} />
          </button>
        </div>

        <button 
          onClick={handleSave}
          className={`w-14 h-14 rounded-[1.25rem] transition-all flex items-center justify-center ${isSaved ? 'bg-amber-50 text-amber-500 shadow-inner ring-2 ring-amber-100' : 'bg-slate-50 text-slate-300 hover:text-slate-600'}`}
        >
          <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#fcfdfe] border-t border-slate-100 overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {/* Comment Input */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm text-sm">
                  {session?.user?.name?.[0] || "U"}
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Add a clinical insight..." 
                    className="w-full h-14 bg-white rounded-2xl px-6 pr-14 text-sm font-bold border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <button 
                    disabled={isCommenting || !commentInput.trim()}
                    onClick={handleAddComment}
                    className="absolute right-3 top-3 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 transition-all disabled:opacity-30 disabled:scale-100"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {commentsList.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                      {comment.author?.name?.[0] || "A"}
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-black text-slate-900 text-xs tracking-tight">{comment.author?.name}</h5>
                        <span className="text-[10px] font-bold text-slate-300">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PostTypeBtn({ label, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-black text-[10px] uppercase tracking-widest border-2 ${active ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionButton({ icon, count, active, onClick, activeClass }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 group ${active ? activeClass : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="text-sm font-black tracking-tight">{count}</span>
    </button>
  );
}
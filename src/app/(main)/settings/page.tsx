"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  ChevronRight,
  Camera,
  LogOut,
  ShieldCheck,
  Mail,
  Settings as SettingsIcon,
  Shield,
  Activity,
  Award,
  AtSign
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    department: "",
    role: "MBBS",
    isPrivate: false,
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        bio: (session.user as any).bio || "",
        department: (session.user as any).department || "",
        role: (session.user as any).role || "MBBS",
        isPrivate: (session.user as any).isPrivate || false,
      });
    }
  }, [session]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/update", formData);
      await update();
      toast.success("Professional identity updated!");
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const { auth } = await import("@/lib/firebase");
      const { sendPasswordResetEmail } = await import("firebase/auth");
      if (!auth) throw new Error("Authentication service unavailable");
      await sendPasswordResetEmail(auth, session.user.email);
      toast.success("Security reset link dispatched to your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate reset");
    } finally {
      setLoading(false);
    }
  };

  const ROLES = [
    { id: "STUDENT", label: "Med Student" },
    { id: "MBBS", label: "MBBS Doctor" },
    { id: "PG", label: "PG Resident" },
    { id: "SPECIALIST", label: "Specialist" }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-32">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-50/30 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-12 relative z-10">
        
        {/* Premium Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-100">
                <SettingsIcon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Institutional</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Management Console</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 text-balance">
              Control your <br />
              <span className="text-blue-600 italic">professional</span> identity.
            </h1>
            <p className="text-slate-500 font-medium text-xl leading-relaxed">
              Manage your clinical credentials, security preferences, and professional presence in the network.
            </p>
          </div>
          
          <div className="flex p-2 bg-white/50 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20">
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} label="Profile" icon={<User size={16} />} />
            <TabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} label="Security" icon={<Shield size={16} />} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: MINI PROFILE & ACTIONS */}
          <div className="lg:col-span-4 space-y-8 sticky top-32">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -mr-24 -mt-24 transition-transform group-hover:scale-125" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-[3.5rem] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-100 ring-8 ring-blue-50">
                    {formData.name?.[0] || "D"}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border-4 border-[#fcfdfe] hover:scale-110 active:scale-95 transition-all">
                    <Camera size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formData.name || "Doctor"}</h2>
                  <ShieldCheck size={20} className="text-blue-500" />
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {formData.role}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formData.department || "No specialty"}</span>
                </div>

                <div className="w-full space-y-3 pt-8 border-t border-slate-50">
                  <ProfileInfoItem icon={<Mail size={14} />} text={session?.user?.email || "N/A"} />
                  <ProfileInfoItem icon={<AtSign size={14} />} text={`@${(session?.user as any)?.username || 'doctor'}`} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => { if(confirm("Terminate current session?")) signOut({ callbackUrl: "/" }); }}
              className="w-full group flex items-center justify-between p-8 bg-rose-50/50 hover:bg-rose-50 transition-all rounded-[2.5rem] border border-rose-100 text-rose-600 font-black"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-90 transition-transform text-rose-500">
                  <LogOut size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm">Terminate Session</p>
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest">Logout from all devices</p>
                </div>
              </div>
              <ChevronRight size={24} className="opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* RIGHT COLUMN: DETAILED CONTROLS */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-[3.5rem] p-10 lg:p-16 border border-slate-100 shadow-2xl shadow-slate-200/20 min-h-[700px] relative overflow-hidden"
              >
                {activeTab === "profile" && (
                  <div className="space-y-12">
                    <header>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 mb-2">
                        <User size={28} className="text-blue-600" />
                        Clinical Profile
                      </h3>
                      <p className="text-slate-400 font-medium">Update your public identity on the network.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input 
                        label="Full Professional Name" 
                        placeholder="Dr. Jane Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-50 border-transparent focus:bg-white focus:border-blue-600"
                      />
                      <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Clinical Specialty</label>
                        <select 
                          className="w-full h-[60px] bg-slate-50 border-2 border-transparent rounded-2xl px-6 font-bold text-slate-600 appearance-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-50 transition-all cursor-pointer"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                          <option value="">Select Department</option>
                          <option value="General Medicine">General Medicine</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Surgery">Surgery</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-6 block">Professional Designation</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ROLES.map((role) => (
                          <button
                            key={role.id}
                            onClick={() => setFormData({ ...formData, role: role.id })}
                            className={`p-6 rounded-[1.5rem] border-2 transition-all group ${formData.role === role.id ? 'border-blue-600 bg-blue-50 text-blue-600 ring-8 ring-blue-50/50' : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-100 hover:bg-slate-50'}`}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <Award size={20} className={formData.role === role.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'} />
                              <span className="font-black text-[10px] uppercase tracking-widest">{role.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-4 block">Medical Bio / Expertise</label>
                      <textarea 
                        className="w-full min-h-[200px] bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-50 transition-all p-8 text-lg font-medium placeholder:text-slate-300 resize-none outline-none"
                        placeholder="Share your research interests, clinical experience, or academic background..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      />
                    </div>

                    <Button 
                      onClick={handleUpdate} 
                      disabled={loading}
                      className="w-full py-8 text-xl font-black rounded-[2rem] bg-blue-600 shadow-2xl shadow-blue-100 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      {loading ? "Syncing Identity..." : "Save Professional Identity"}
                    </Button>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-12">
                    <header>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 mb-2">
                        <Shield size={28} className="text-blue-600" />
                        Security & Trust
                      </h3>
                      <p className="text-slate-400 font-medium">Configure institutional access and privacy levels.</p>
                    </header>
                    
                    <div className="bg-[#fcfdfe] rounded-[2.5rem] p-10 border-2 border-slate-50">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                            <Lock size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Clinical Privacy Mode</h4>
                            <p className="text-sm text-slate-500 font-medium">Only verified medical practitioners can view your posts.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                          className={`w-16 h-9 rounded-full transition-all relative flex items-center px-1.5 shadow-inner ${formData.isPrivate ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                          <motion.div 
                            animate={{ x: formData.isPrivate ? 28 : 0 }}
                            className="w-6 h-6 bg-white rounded-full shadow-2xl" 
                          />
                        </button>
                      </div>

                      <div className="p-6 bg-blue-50/50 rounded-2xl flex items-center gap-4 border border-blue-100">
                        <Activity size={20} className="text-blue-500" />
                        <span className="text-xs font-black text-blue-700 uppercase tracking-widest">End-to-End Clinical Data Protection Active</span>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Credential Security</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Maintain your account security by updating your password regularly. A secure reset link will be sent to your medical email.
                          </p>
                        </div>
                        <Button 
                          onClick={handleResetPassword}
                          disabled={loading}
                          variant="outline"
                          className="px-10 py-5 rounded-2xl border-2 border-slate-100 font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all shrink-0"
                        >
                          {loading ? "Dispatching..." : "Request Reset"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm transition-all ${active ? 'bg-slate-900 text-white shadow-2xl shadow-slate-400' : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function ProfileInfoItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-4 text-slate-400 hover:text-blue-600 transition-all group/item cursor-default">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-bold truncate">{text}</span>
    </div>
  );
}

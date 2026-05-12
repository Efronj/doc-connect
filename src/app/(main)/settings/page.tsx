"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Bell, 
  Bookmark, 
  Shield, 
  ChevronRight,
  Camera,
  Check,
  Activity
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    bio: (session?.user as any)?.bio || "",
    department: (session?.user as any)?.department || "",
    role: (session?.user as any)?.role || "DOCTOR",
    isPrivate: (session?.user as any)?.isPrivate || false,
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/update", formData);
      await update(); // Update session
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      // Import auth from firebase here or use the one from lib
      const { auth } = await import("@/lib/firebase");
      const { sendPasswordResetEmail } = await import("firebase/auth");
      if (!auth) throw new Error("Auth unavailable");
      await sendPasswordResetEmail(auth, session.user.email);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 lg:px-0">
      <header className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your professional presence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-2">
          <SettingsTab icon={User} label="Edit Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          <SettingsTab icon={Lock} label="Security" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
          <SettingsTab icon={Bell} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <SettingsTab icon={Bookmark} label="Saved Cases" active={activeTab === "saved"} onClick={() => setActiveTab("saved")} />
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card"
          >
            {activeTab === "profile" && (
              <>
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                  <div className="relative group">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-blue-50 flex items-center justify-center text-3xl font-black text-blue-600">
                      {formData.name?.[0] || "D"}
                    </div>
                    <button className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Camera size={24} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{formData.name}</h3>
                    <p className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-widest">{formData.role} · {formData.department || "No Department Set"}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col gap-6">
                  <Input 
                    label="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-slate-900 px-1">Professional Role</label>
                    <div className="grid grid-cols-2 gap-4">
                      <RoleOption 
                        label="Doctor" 
                        selected={formData.role === "DOCTOR"} 
                        onClick={() => setFormData({ ...formData, role: "DOCTOR" })}
                      />
                      <RoleOption 
                        label="Student" 
                        selected={formData.role === "STUDENT"} 
                        onClick={() => setFormData({ ...formData, role: "STUDENT" })}
                      />
                    </div>
                  </div>

                  <Input 
                    label="Department / Specialty" 
                    placeholder="e.g. Cardiology" 
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-slate-900 px-1">Bio</label>
                    <textarea 
                      className="input min-h-[120px] resize-none"
                      placeholder="Share your professional background..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      style={{ fontSize: "0.95rem" }}
                    />
                  </div>

                  <Button 
                    onClick={handleUpdate} 
                    disabled={loading}
                    className="w-full py-4 lg:py-5 text-lg"
                    style={{ borderRadius: "1.25rem" }}
                  >
                    {loading ? "Saving..." : "Save Professional Info"}
                  </Button>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Password Management</h3>
                  <p className="text-slate-500 text-sm font-medium">Secure your medical practitioner account</p>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Reset Password</h4>
                      <p className="text-xs text-slate-500">We'll send a secure link to your email.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleResetPassword}
                    disabled={loading}
                    variant="outline"
                    className="w-full bg-white border-slate-200"
                    style={{ borderRadius: "1.25rem" }}
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                  <div>
                    <h4 className="font-bold text-slate-900">Two-Factor Auth</h4>
                    <p className="text-xs text-slate-500">Coming soon for clinical grade security.</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase">Alpha</div>
                </div>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "saved") && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity size={32} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Section Empty</h3>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-bold">{label}</span>
      </div>
      <ChevronRight size={16} opacity={active ? 1 : 0.5} />
    </button>
  );
}

function RoleOption({ label, selected, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${selected ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
    >
      <span className="font-bold">{label}</span>
      {selected && <Check size={18} strokeWidth={3} />}
    </button>
  );
}

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
  Check
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    bio: session?.user?.bio || "",
    department: session?.user?.department || "",
    role: session?.user?.role || "DOCTOR",
    isPrivate: session?.user?.isPrivate || false,
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

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your professional presence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-2">
          <SettingsTab icon={User} label="Edit Profile" active />
          <SettingsTab icon={Lock} label="Privacy & Safety" />
          <SettingsTab icon={Bell} label="Notifications" />
          <SettingsTab icon={Bookmark} label="Saved Cases" />
          <SettingsTab icon={Shield} label="Verification" />
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card"
          >
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-blue-50 flex items-center justify-center text-3xl font-black text-blue-600">
                  {formData.name?.[0] || "D"}
                </div>
                <button className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera size={24} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{formData.name}</h3>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{formData.role} · {formData.department || "No Department Set"}</p>
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
                    label="Medical Student" 
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
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900">Private Account</h4>
                  <p className="text-xs text-slate-500">Only verified practitioners can see your cases.</p>
                </div>
                <button 
                  onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPrivate ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPrivate ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <Button 
                onClick={handleUpdate} 
                disabled={loading}
                className="w-full py-5 text-lg"
              >
                {loading ? "Saving..." : "Save Professional Info"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon: Icon, label, active = false }: any) {
  return (
    <button className={`flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
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

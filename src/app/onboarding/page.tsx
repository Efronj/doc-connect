"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { 
  ChevronRight, 
  GraduationCap, 
  UserRound, 
  Stethoscope, 
  Building2, 
  Check,
  Microscope,
  Activity,
  Heart,
  ArrowRight,
  ShieldCheck,
  Stethoscope as StethoscopeIcon,
  Camera
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

type Step = "welcome" | "role" | "department" | "bio";

const ROLES = [
  { id: "STUDENT", title: "Medical Student", icon: <GraduationCap size={32} /> },
  { id: "MBBS", title: "MBBS Doctor", icon: <UserRound size={32} /> },
  { id: "PG", title: "PG Resident", icon: <Microscope size={32} /> },
  { id: "SPECIALIST", title: "Specialist", icon: <Stethoscope size={32} /> },
  { id: "OTHER", title: "Healthcare Prof.", icon: <Building2 size={32} /> }
];

const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Neurology", "Orthopedics", 
  "Pediatrics", "Surgery", "Dermatology", "Radiology", 
  "Emergency Medicine", "Psychiatry", "Other"
];

export default function OnboardingPage() {
  const { update } = useSession();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "MBBS",
    department: "",
    bio: ""
  });
  const router = useRouter();

  const handleNext = async () => {
    if (step === "welcome") setStep("role");
    else if (step === "role") setStep("department");
    else if (step === "department") setStep("bio");
    else await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/update", formData);
      await update();
      toast.success("Professional identity verified!");
      window.location.href = "/home";
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["welcome", "role", "department", "bio"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-10 lg:py-20 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Progress System */}
        {step !== "welcome" && (
          <div className="max-w-xs mx-auto mb-16">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((s, i) => (
                <div 
                  key={s} 
                  className={`relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 ${i <= currentStepIndex ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "bg-white text-slate-300 border-2 border-slate-100"}`}
                >
                  {i < currentStepIndex ? <Check size={16} strokeWidth={3} /> : i}
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-48 -mt-48" />

            {step === "welcome" && (
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-white shadow-2xl shadow-blue-100 rotate-3 hover:rotate-0 transition-transform">
                  <StethoscopeIcon size={48} />
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
                  Welcome to the <br />
                  <span className="text-blue-600">Clinical Network</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                  Join a verified community of healthcare professionals. Let's set up your clinical identity.
                </p>
                <Button 
                  onClick={handleNext}
                  className="px-12 py-8 text-xl font-black rounded-3xl bg-blue-600 shadow-2xl shadow-blue-100 group transition-all"
                >
                  Get Started 
                  <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
                
                <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified ONLY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">HIPAA Compliant</span>
                  </div>
                </div>
              </div>
            )}

            {step === "role" && (
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Step 01</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">What is your medical role?</h2>
                  <p className="text-slate-500 text-lg font-medium mt-2">This helps us customize your clinical feed.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {ROLES.map((role) => (
                    <CategoryCard 
                      key={role.id}
                      title={role.title} 
                      icon={role.icon} 
                      selected={formData.role === role.id}
                      onClick={() => setFormData({ ...formData, role: role.id })}
                    />
                  ))}
                </div>

                <Button onClick={handleNext} className="w-full py-6 text-xl mt-12 font-black rounded-[2rem] shadow-xl shadow-blue-100">
                  Continue to Specialty
                </Button>
              </div>
            )}

            {step === "department" && (
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Step 02</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Clinical Specialty</h2>
                  <p className="text-slate-500 text-lg font-medium mt-2">Connect with peers in your field of expertise.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFormData({ ...formData, department: dept })}
                      className={`p-6 rounded-[1.5rem] border-2 transition-all font-bold text-sm text-left flex items-center justify-between group ${formData.department === dept ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-50' : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-slate-50'}`}
                    >
                      {dept}
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.department === dept ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'}`}>
                        <Check size={14} strokeWidth={4} />
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!formData.department}
                  className="w-full py-6 text-xl mt-12 font-black rounded-[2rem] shadow-xl shadow-blue-100 disabled:opacity-20"
                >
                  Continue to Bio
                </Button>
              </div>
            )}

            {step === "bio" && (
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Step 03</span>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Professional Background</h2>
                  <p className="text-slate-500 text-lg font-medium mt-2">A brief intro for the medical community.</p>
                </div>

                <div className="flex flex-col items-center gap-10">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-[3rem] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-blue-300 group-hover:text-blue-500 transition-all">
                      <Camera size={32} className="mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1 mb-4 block">About Your Clinical Focus</label>
                    <textarea 
                      className="w-full min-h-[180px] bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all p-8 text-lg font-medium placeholder:text-slate-300 resize-none outline-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Describe your expertise, research interests, or clinical goals..."
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={loading}
                  className="w-full py-6 text-xl mt-12 font-black rounded-[2rem] shadow-xl shadow-blue-100"
                >
                  {loading ? "Verifying Profile..." : "Complete Professional Profile"}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryCard({ title, icon, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer transition-all p-6 flex flex-col items-center text-center rounded-[2rem] border-2 h-full ${selected ? "ring-8 ring-blue-50 border-blue-600 bg-blue-50" : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"}`}
    >
      <div 
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${selected ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 shadow-sm group-hover:scale-110"}`}
      >
        {icon}
      </div>
      <h3 className={`font-black text-[10px] uppercase tracking-wider leading-tight ${selected ? "text-blue-600" : "text-slate-500"}`}>{title}</h3>
    </div>
  );
}

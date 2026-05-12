"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { 
  ChevronRight, 
  GraduationCap, 
  UserRound, 
  Stethoscope, 
  Building2, 
  PlusCircle, 
  Check,
  Microscope,
  Activity,
  Heart
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

type Step = "role" | "department" | "bio";

const ROLES = [
  { id: "STUDENT", title: "Medical Student", icon: <GraduationCap size={32} /> },
  { id: "MBBS", title: "MBBS Doctor", icon: <UserRound size={32} /> },
  { id: "PG", title: "PG Doctor", icon: <Microscope size={32} /> },
  { id: "SPECIALIST", title: "Specialist", icon: <Stethoscope size={32} /> },
  { id: "OTHER", title: "Healthcare Role", icon: <Building2 size={32} /> }
];

const DEPARTMENTS = [
  "General Medicine", "Cardiology", "Neurology", "Orthopedics", 
  "Pediatrics", "Surgery", "Dermatology", "Radiology", 
  "Emergency Medicine", "Psychiatry", "Other"
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("role");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "MBBS",
    department: "",
    bio: ""
  });
  const router = useRouter();

  const handleNext = async () => {
    if (step === "role") setStep("department");
    else if (step === "department") setStep("bio");
    else await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.patch("/api/user/update", formData);
      toast.success("Profile finalized!");
      router.push("/home");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["role", "department", "bio"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="onboarding-container" style={{ backgroundColor: "#fcfdff", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "42rem", width: "100%", margin: "0 auto" }}>
        
        {/* Progress Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="flex justify-center items-center gap-3 mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div 
                  className={`flex items-center justify-center font-bold text-xs transition-all`}
                  style={{ 
                    width: "2.25rem", 
                    height: "2.25rem", 
                    borderRadius: "50%", 
                    backgroundColor: i <= currentStepIndex ? "#2563eb" : "white",
                    color: i <= currentStepIndex ? "white" : "#94a3b8",
                    border: i <= currentStepIndex ? "none" : "2px solid #e2e8f0",
                    boxShadow: i === currentStepIndex ? "0 0 0 4px #dbeafe" : "none"
                  }}
                >
                  {i < currentStepIndex ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: "2.5rem", height: "2px", backgroundColor: i < currentStepIndex ? "#2563eb" : "#e2e8f0" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="premium-card p-8 lg:p-12"
          >
            {step === "role" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tight">Select your role</h1>
                  <p className="text-slate-500 text-base lg:text-lg font-medium">Tailoring your clinical feed</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
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

                <Button 
                  onClick={handleNext} 
                  className="w-full py-4 lg:py-6 text-lg lg:text-xl mt-10 font-black"
                  style={{ borderRadius: "1.5rem" }}
                >
                  Continue <ChevronRight size={18} style={{ marginLeft: "0.5rem" }} />
                </Button>
              </div>
            )}

            {step === "department" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tight">Your Department</h1>
                  <p className="text-slate-500 text-base lg:text-lg font-medium">Connect with specialist peers</p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFormData({ ...formData, department: dept })}
                      className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all font-bold text-sm lg:text-base text-left flex items-center justify-between ${formData.department === dept ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {dept}
                      {formData.department === dept && <Check size={16} strokeWidth={3} />}
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!formData.department}
                  className="w-full py-4 lg:py-6 text-lg lg:text-xl mt-10 font-black" 
                  style={{ borderRadius: "1.5rem" }}
                >
                  Next Step <ChevronRight size={18} style={{ marginLeft: "0.5rem" }} />
                </Button>
              </div>
            )}

            {step === "bio" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tight">Professional Bio</h1>
                  <p className="text-slate-500 text-base lg:text-lg font-medium">Let other doctors know your expertise</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2rem] lg:rounded-[2.5rem] bg-blue-50 flex items-center justify-center text-blue-600 border-4 border-dashed border-blue-200">
                      <PlusCircle size={32} />
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-400">Upload Photo</p>
                  </div>
                  
                  <div className="w-full">
                    <label className="text-sm font-black text-slate-900 px-1 mb-2 block">Tell us about your medical background</label>
                    <textarea 
                      className="input w-full min-h-[140px] resize-none"
                      style={{ padding: "1.25rem", fontSize: "1rem" }}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="e.g. Cardiologist focused on non-invasive procedures..."
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={loading}
                  className="w-full py-4 lg:py-6 text-lg lg:text-xl mt-10 font-black" 
                  style={{ borderRadius: "1.5rem" }}
                >
                  {loading ? "Saving Profile..." : "Finish Onboarding"}
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
      className={`category-card cursor-pointer transition-all ${selected ? "ring-4 ring-blue-100 border-blue-600 bg-blue-50" : "border-slate-100"}`}
      style={{ 
        padding: "2rem", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        textAlign: "center",
        borderRadius: "2rem",
        borderWidth: "2px"
      }}
    >
      <div 
        style={{ 
          width: "4rem",
          height: "4rem",
          borderRadius: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          backgroundColor: selected ? "#2563eb" : "#eff6ff", 
          color: selected ? "white" : "#2563eb" 
        }}
      >
        {icon}
      </div>
      <h3 className={`font-black text-sm tracking-tight ${selected ? "text-blue-600" : "text-slate-600"}`}>{title}</h3>
    </div>
  );
}


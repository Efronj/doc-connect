"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@/components/ui";
import { ChevronRight, GraduationCap, UserRound, Stethoscope, Building2, PlusCircle, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "category" | "details" | "bio";
type Category = "Student" | "Doctor" | "Specialist" | "Other";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<Category | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (step === "category") setStep("details");
    else if (step === "details") setStep("bio");
    else router.push("/home");
  };

  const steps = ["category", "details", "bio"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="onboarding-container" style={{ backgroundColor: "#fcfdff" }}>
      <div style={{ maxWidth: "48rem", width: "100%" }}>
        
        {/* Progress Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="flex justify-center gap-4 mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div 
                  className={`flex items-center justify-center font-bold text-sm transition-all`}
                  style={{ 
                    width: "2.5rem", 
                    height: "2.5rem", 
                    borderRadius: "50%", 
                    backgroundColor: i <= currentStepIndex ? "var(--primary)" : "var(--white)",
                    color: i <= currentStepIndex ? "white" : "var(--text-muted)",
                    border: i <= currentStepIndex ? "none" : "2px solid var(--border)",
                    boxShadow: i === currentStepIndex ? "0 0 0 4px var(--primary-light)" : "none"
                  }}
                >
                  {i < currentStepIndex ? <Check size={16} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: "3rem", height: "2px", backgroundColor: i < currentStepIndex ? "var(--primary)" : "var(--border)" }} />
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
            className="onboarding-card"
          >
            {step === "category" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Select your role</h1>
                  <p className="text-slate-500 text-lg font-medium">Join the professional network that fits you</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <CategoryCard 
                    title="MBBS Student" 
                    icon={<GraduationCap size={32} />} 
                    selected={category === "Student"}
                    onClick={() => setCategory("Student")}
                  />
                  <CategoryCard 
                    title="Medical Doctor" 
                    icon={<UserRound size={32} />} 
                    selected={category === "Doctor"}
                    onClick={() => setCategory("Doctor")}
                  />
                  <CategoryCard 
                    title="Specialist" 
                    icon={<Stethoscope size={32} />} 
                    selected={category === "Specialist"}
                    onClick={() => setCategory("Specialist")}
                  />
                  <CategoryCard 
                    title="Healthcare Pro" 
                    icon={<Building2 size={32} />} 
                    selected={category === "Other"}
                    onClick={() => setCategory("Other")}
                  />
                </div>

                <Button 
                  onClick={handleNext} 
                  disabled={!category}
                  className="w-full py-5 text-xl mt-8"
                  style={{ borderRadius: "1.5rem" }}
                >
                  Continue <ChevronRight size={20} style={{ marginLeft: "0.5rem" }} />
                </Button>
              </div>
            )}

            {step === "details" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Professional Details</h1>
                  <p className="text-slate-500 text-lg font-medium">Verify your medical background</p>
                </div>

                <div className="flex-col gap-6">
                  {category === "Student" ? (
                    <>
                      <Input label="Medical School / University" placeholder="e.g. Johns Hopkins School of Medicine" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Current Year of Study" placeholder="3rd Year" />
                        <Input label="Expected Graduation" placeholder="2026" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Input label="Primary Specialty" placeholder="e.g. Cardiology, Pediatrics" />
                      <Input label="Primary Workplace" placeholder="e.g. Mayo Clinic, City Hospital" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Medical License #" placeholder="123456789" />
                        <Input label="Years in Practice" placeholder="5+" />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Work City" placeholder="New York" />
                    <Input label="Country" placeholder="United States" />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full py-5 text-xl mt-8" style={{ borderRadius: "1.5rem" }}>
                  Almost There <ChevronRight size={20} style={{ marginLeft: "0.5rem" }} />
                </Button>
              </div>
            )}

            {step === "bio" && (
              <div className="flex-col gap-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Final Touches</h1>
                  <p className="text-slate-500 text-lg font-medium">Let others know more about you</p>
                </div>

                <div className="flex-col items-center gap-8">
                  <div className="relative group">
                    <div className="avatar" style={{ width: "10rem", height: "10rem", borderRadius: "2.5rem", border: "4px dashed var(--border)", backgroundColor: "var(--bg-alt)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "var(--transition)" }}>
                      <PlusCircle size={40} color="var(--primary)" />
                    </div>
                    <div className="absolute" style={{ bottom: "-0.5rem", right: "-0.5rem", backgroundColor: "var(--primary)", padding: "0.5rem", borderRadius: "1rem", color: "white", border: "4px solid white" }}>
                      <Check size={20} />
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <label className="label">Professional Bio</label>
                    <textarea 
                      className="input"
                      style={{ minHeight: "10rem", resize: "none", padding: "1.25rem", fontSize: "1.1rem" }}
                      placeholder="Share your interests, research, or simple clinic life..."
                    />
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full py-5 text-xl mt-8" style={{ borderRadius: "1.5rem", boxShadow: "var(--shadow-premium)" }}>
                  Complete Setup
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
      className={`category-card ${selected ? "selected" : ""}`}
      style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
    >
      <div 
        className="step-icon-container" 
        style={{ 
          backgroundColor: selected ? "var(--primary)" : "var(--primary-light)", 
          color: selected ? "white" : "var(--primary)" 
        }}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg" style={{ color: selected ? "var(--primary)" : "var(--text)" }}>{title}</h3>
    </div>
  );
}

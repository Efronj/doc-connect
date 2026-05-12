"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Users, FileText, Activity, ArrowRight, LogOut, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password === "efron1122334455") {
      setIsAuthorized(true);
      toast.success("Authorized: Admin Access Granted");
    } else {
      toast.error("Invalid Admin Credentials");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Shield size={40} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white text-center mb-2">Network Control</h1>
          <p className="text-slate-400 text-center mb-10 font-medium">Enter medical administration key</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="password" 
                placeholder="Admin Password" 
                className="w-full bg-slate-800 border-none text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 ring-blue-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading} className="py-6 text-lg bg-blue-600 hover:bg-blue-500 border-none shadow-blue-500/20">
              {loading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 p-8 hidden lg:flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">AdminPanel</span>
        </div>

        <nav className="flex flex-col gap-2">
          <AdminNavBtn icon={Activity} label="Overview" active />
          <AdminNavBtn icon={Users} label="Practitioners" />
          <AdminNavBtn icon={FileText} label="Clinical Cases" />
          <AdminNavBtn icon={Shield} label="Verifications" />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => setIsAuthorized(false)}
            className="flex items-center gap-3 text-slate-400 hover:text-red-500 font-bold transition-colors w-full p-4"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Command Center</h1>
            <p className="text-slate-500 font-medium">Monitoring 2,450 verified doctors</p>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  placeholder="Search network..." 
                  className="bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-xl w-64 outline-none focus:ring-2 ring-blue-500/20"
                />
             </div>
             <Button className="rounded-xl px-6">Generate Report</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard label="Active Doctors" value="1,892" growth="+12%" />
          <StatCard label="Cases Shared" value="14,205" growth="+5.4%" />
          <StatCard label="Pending Verifications" value="48" growth="-2" />
        </div>

        {/* Recent Activity Table (Mock) */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-900">Recent Practitioners</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline">View all</button>
          </div>
          
          <div className="flex flex-col gap-4">
             <UserRow name="Dr. Sarah Johnson" dept="Cardiology" status="Verified" />
             <UserRow name="Dr. Michael Chen" dept="Neurology" status="Pending" />
             <UserRow name="Dr. Elena Rodriguez" dept="Surgery" status="Verified" />
             <UserRow name="James Wilson" dept="Student" status="Verified" />
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminNavBtn({ icon: Icon, label, active = false }: any) {
  return (
    <button className={`flex items-center justify-between p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
      <div className="flex items-center gap-4">
        <Icon size={20} />
        <span className="font-black text-sm">{label}</span>
      </div>
      {active && <ArrowRight size={16} />}
    </button>
  );
}

function StatCard({ label, value, growth }: any) {
  return (
    <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-4">
        <h3 className="text-4xl font-black text-slate-900">{value}</h3>
        <span className={`text-xs font-bold ${growth.startsWith('+') ? 'text-green-500' : 'text-amber-500'}`}>{growth}</span>
      </div>
    </div>
  );
}

function UserRow({ name, dept, status }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
          {name[4]}
        </div>
        <div>
          <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h4>
          <p className="text-xs text-slate-500 font-bold">{dept}</p>
        </div>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${status === 'Verified' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
        {status}
      </div>
    </div>
  );
}

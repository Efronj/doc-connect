"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  ShieldCheck, 
  UserMinus,
  CheckCircle,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui";

export default function AdminPage() {
  return (
    <div className="p-8 space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage users, content and system health.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">Export Data</Button>
          <Button className="rounded-xl shadow-blue-100">System Settings</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="124.5k" change="+12%" icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Active Posts" value="1.2M" change="+5%" icon={<FileText className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="Reports" value="128" change="-8%" icon={<AlertTriangle className="text-red-600" />} color="bg-red-50" />
        <StatCard title="Verified" value="15.2k" change="+18%" icon={<ShieldCheck className="text-emerald-600" />} color="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Verification Queue</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            <VerificationItem name="Dr. Alice Smith" doc="License_MD_402.pdf" date="2 hours ago" />
            <VerificationItem name="Dr. Bob Johnson" doc="Hosp_ID_992.png" date="5 hours ago" />
            <VerificationItem name="Dr. Carol White" doc="Board_Cert_CA.pdf" date="Yesterday" />
          </div>
        </div>

        {/* Analytics Mini */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-xl">
          <h3 className="text-xl font-bold mb-6">User Growth</h3>
          <div className="h-40 flex items-end gap-2 mb-6">
            {[40, 60, 45, 90, 65, 85, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="flex-1 bg-blue-500 rounded-t-lg"
              />
            ))}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Monthly Target</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[85%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: any) {
  return (
    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-50 group hover:scale-105 transition-all">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

function VerificationItem({ name, doc, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400 shadow-sm">
          {name.charAt(4)}
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{name}</h4>
          <p className="text-xs text-slate-500">{doc} · {date}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="rounded-lg border-red-100 text-red-500 hover:bg-red-50">Reject</Button>
        <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700">Verify</Button>
      </div>
    </div>
  );
}

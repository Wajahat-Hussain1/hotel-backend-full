"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import AdminStats from "../components/AdminStats";
import AdminRecent from "../components/AdminRecent";

// --- Sub-Component for Quick Actions ---
function QuickActionButton({ onClick, label, iconPath, bgColor, shadowColor }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between w-full p-5 ${bgColor} text-white rounded-2xl transition-all duration-300 shadow-lg ${shadowColor} hover:-translate-y-1 hover:brightness-110 focus:ring-4 focus:ring-opacity-50 active:scale-95`}
    >
      <div className="flex items-center gap-4">
        <span className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconPath}
          </svg>
        </span>
        <span className="font-bold text-base tracking-tight">{label}</span>
      </div>
      <svg className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("hotel_role") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    if (!token || role !== "admin") {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-slate-50/50"> 
      <AdminSidebar /> 

      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full"> 
          
          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 bg-indigo-600 rounded-full"></span>
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Management Console</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Velvet Door <span className="text-slate-400 font-light">Overview</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="relative flex">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Live: Ops Normal</span>
            </div>
          </div>

          {/* --- Metrics Grid --- */}
          <section className="mb-10">
            <AdminStats />
          </section>

          {/* --- Main Dashboard Content --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Activity: 8 Columns wide on large screens */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-full">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Latest Bookings</h2>
                    <p className="text-xs text-slate-400 font-medium">Real-time reservation flow</p>
                  </div>
                  <button 
                    onClick={() => router.push('/admin/bookings')}
                    className="px-4 py-2 text-[11px] font-black text-indigo-600 hover:bg-indigo-50 rounded-xl uppercase tracking-widest transition-all"
                  >
                    Manage All
                  </button>
                </div>
                <div className="p-2">
                   <AdminRecent />
                </div>
              </div>
            </div>

            {/* Quick Actions: 4 Columns wide */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 p-8 shadow-2xl shadow-slate-200 rounded-[2.5rem] text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Priority Actions</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <QuickActionButton
                    onClick={() => router.push("/admin/rooms/add")}
                    label="Add New Room"
                    bgColor="bg-indigo-600"
                    shadowColor="shadow-indigo-500/20"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />}
                  />

                  <QuickActionButton
                    onClick={() => router.push("/admin/staff")}
                    label="Manage All Staff"
                    bgColor="bg-slate-800"
                    shadowColor="shadow-slate-800/20"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                  />

                  <QuickActionButton
                    onClick={() => router.push("/admin/staff/add")}
                    label="Onboard Member"
                    bgColor="bg-indigo-500"
                    shadowColor="shadow-indigo-400/20"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />}
                  />
                </div>

                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">Admin Tip</p>
                   <p className="text-xs text-slate-300 leading-relaxed">
                     Daily audits are scheduled for 12:00 AM. Ensure all check-outs are processed before then.
                   </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
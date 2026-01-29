"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import AdminStats from "../components/AdminStats";
import AdminRecent from "../components/AdminRecent";

// --- Sub-Component for Quick Actions (Unchanged) ---
function QuickActionButton({ onClick, label, iconPath, bgColor, shadowColor }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between w-full p-4 ${bgColor} text-white rounded-xl transition-all duration-300 shadow-xl ${shadowColor} hover:-translate-y-1 hover:brightness-110 focus:ring-4 focus:ring-offset-2 focus:ring-opacity-50`}
    >
      <div className="flex items-center gap-3">
        <span className="p-1.5 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconPath}
          </svg>
        </span>
        <span className="font-extrabold text-lg">{label}</span>
      </div>
      {/* Arrow Animation */}
      <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
}
// ----------------------------------------


export default function AdminDashboardPage() {
  const router = useRouter();

  // --- Auth Check Logic (Unchanged) ---
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("hotel_role") : null;
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    if (!token || role !== "admin") {
      router.push("/");
    }
  }, [router]);
  // ------------------------------------------

  return (
    <div className="min-h-screen flex bg-gray-50"> {/* Changed to clean, subtle gray-50 background */}
      
      {/* Sidebar (Requires AdminSidebar to handle its own fixed positioning and size) */}
      {/* Note: Removed redundant <aside> wrapper here since AdminSidebar component handles fixed positioning and spacer. */}
      <AdminSidebar /> 

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        {/* Updated max-width and padding for a better central focus */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full"> 
          
          {/* --- Header Section (Cleaned up design) --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-gray-200 mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                Hotel Management Dashboard
              </h1>
              <p className="text-slate-500 text-lg mt-1 font-medium">
                High-level overview of core operations and quick action access.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full shadow-md">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700">System Operational</span>
            </div>
          </div>

          {/* --- Stats Section (AdminStats component is assumed to be professional) --- */}
          <section className="mb-12">
            {/* The AdminStats component will render professional-looking metric cards */}
            <AdminStats />
          </section>

          {/* --- Content Grid (Recent Activity vs Quick Actions) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Activity (Larger Card for high visibility) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h2 className="text-2xl font-bold text-slate-800">Latest Operations</h2>
                  <button className="text-sm font-extrabold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">
                    View Full Log
                  </button>
                </div>
                {/* AdminRecent component handles the content list */}
                <AdminRecent />
              </div>
            </div>

            {/* Quick Actions (Dedicated Panel) */}
            <div className="space-y-6">
              <div className="bg-white p-6 shadow-2xl shadow-indigo-100/50 border border-slate-100 rounded-2xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Instant Actions
                </h2>

                <div className="flex flex-col gap-5">
                  <QuickActionButton
                    onClick={() => router.push("/admin/rooms/add")}
                    label="Add New Room"
                    bgColor="bg-indigo-600"
                    shadowColor="shadow-indigo-300/60"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />} // Plus
                  />

                  {/* UPDATED: Replaced "Create New Booking" with "Manage All Staff" 
                  */}
                  <QuickActionButton
                    onClick={() => router.push("/admin/staff")}
                    label="Manage All Staff"
                    bgColor="bg-cyan-600" // Changed color for staff (professional look)
                    shadowColor="shadow-cyan-300/60"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />} // Staff/Users icon
                  />

                  <QuickActionButton
                    onClick={() => router.push("/admin/staff/add")}
                    label="Onboard Staff Member"
                    bgColor="bg-fuchsia-600" // New unique color for onboarding
                    shadowColor="shadow-fuchsia-300/60"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />} // User Plus
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
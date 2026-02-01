"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/AdminSidebar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all"); 

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success !== false) {
          setStaff(json.data || []);
        }
      } catch (err) {
        toast.error("Could not sync staff directory.");
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [token]);

  const filtered = staff.filter((s) => {
    const matchesView = view === "all" || s.status === view;
    const matchesSearch = `${s.staff_id} ${s.name} ${s.role} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesView && matchesSearch;
  });

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const loadingToast = toast.loading(`Updating status to ${newStatus}...`);

    try {
      const res = await fetch(`${API_URL}/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStaff((prev) =>
          prev.map((s) => (s.staff_id === id ? { ...s, status: newStatus } : s))
        );
        toast.success(`Staff ID #${id} is now ${newStatus}`, { id: loadingToast });
      } else {
        toast.error("Status update failed.", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Connection error.", { id: loadingToast });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <Sidebar active="staff" />

      <main className="flex-1 p-6 lg:p-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Personnel <span className="text-indigo-600 italic">Directory</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage access levels and employee records.</p>
          </div>

          <Link
            href="/admin/staff/add"
            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            <span className="font-black uppercase tracking-widest text-xs">Add New Member</span>
            <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </div>
          </Link>
        </div>

        {/* UTILITIES BAR */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                    type="text"
                    placeholder="Search by ID, Role, or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[2rem] font-bold text-slate-800 shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                />
            </div>

            <div className="flex bg-white p-2 rounded-[2rem] shadow-sm">
                {["all", "active", "inactive"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setView(tab)}
                        className={`px-8 py-3 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${
                            view === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Salary</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center font-bold text-slate-400 italic">No records found matching your criteria.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.staff_id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-400 group-hover:text-indigo-600 transition-colors">#{s.staff_id}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 tracking-tight">{s.name}</span>
                        <span className="text-xs text-slate-400 font-medium italic">{s.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            {s.role}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                        <span className="font-black text-slate-900 tracking-tighter">PKR {Number(s.salary).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${s.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {s.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/staff/${s.staff_id}/edit`}
                          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        
                        <button
                          onClick={() => handleToggleStatus(s.staff_id, s.status)}
                          className={`p-3 border rounded-2xl transition-all ${
                            s.status === "active" 
                            ? "bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>

                        <Link
                          href={`/admin/staff/${s.staff_id}/delete`}
                          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:shadow-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
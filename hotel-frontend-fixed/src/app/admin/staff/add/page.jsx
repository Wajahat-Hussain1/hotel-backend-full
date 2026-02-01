"use client";

import { useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function AddStaffPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    salary: "",
    hired_date: new Date().toISOString().split('T')[0], // Default to today
  });
  
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.password || !form.role) {
      return toast.error("Please fill in all required fields.");
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating personnel record...");

    try {
      const res = await fetch(`${API_URL}/api/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Staff member onboarded!", { id: loadingToast });
        setTimeout(() => router.push("/admin/staff"), 1500);
      } else {
        toast.error(json.message || "Onboarding failed.", { id: loadingToast });
        setLoading(false);
      }
    } catch (err) {
      toast.error("Network error: Connection failed.", { id: loadingToast });
      setLoading(false);
    }
  };

  const staffRoles = [
    "manager", "receptionist", "security", "driver", 
    "chef", "cleaner", "technician", "housekeeping"
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <Sidebar active="staff" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1200px] mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Onboard <span className="text-indigo-600">Staff</span>
            </h1>
            <p className="text-slate-500 font-medium">Create a new administrative or service profile.</p>
          </div>
          <button
            onClick={() => router.push("/admin/staff")}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
        </div>

        {/* ONBOARDING FORM */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden p-8 lg:p-12">
          <form onSubmit={submitForm} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Profile Credentials Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Credentials & Info</h3>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ali Khan"
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="staff@hotel.com"
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Access Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              {/* Administrative Details Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Employment Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Role *</label>
                    <select
                      value={form.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select...</option>
                      {staffRoles.map(role => (
                        <option key={role} value={role} className="capitalize">{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Salary (PKR)</label>
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(e) => updateField("salary", e.target.value)}
                      placeholder="50000"
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contact Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Hired Date</label>
                  <input
                    type="date"
                    value={form.hired_date}
                    onChange={(e) => updateField("hired_date", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? "Registering Staff..." : "Finalize Onboarding"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function EditStaffPage() {
  const router = useRouter();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const staffRoles = [
    "manager", "receptionist", "security", "driver", 
    "chef", "cleaner", "technician", "housekeeping"
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (!res.ok) {
          toast.error("Staff member not found.");
          return router.push("/admin/staff");
        }

        setStaff({
          ...json.data,
          hired_date: formatDate(json.data.hired_date),
        });
      } catch (err) {
        toast.error("Failed to sync with server.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router, token]);

  const updateField = (key, value) => {
    setStaff({ ...staff, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!staff.name || !staff.email || !staff.role) {
      return toast.error("Please fill all required fields.");
    }

    setUpdating(true);
    const loadingToast = toast.loading("Updating personnel record...");

    try {
      const res = await fetch(`${API_URL}/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          salary: staff.salary,
          hired_date: staff.hired_date,
          role: staff.role,
          ...(staff.password && { password: staff.password })
        }),
      });

      if (res.ok) {
        toast.success("Staff profile updated!", { id: loadingToast });
        setTimeout(() => router.push("/admin/staff"), 1500);
      } else {
        const json = await res.json();
        toast.error(json.message || "Update failed.", { id: loadingToast });
        setUpdating(false);
      }
    } catch (err) {
      toast.error("Network error during update.", { id: loadingToast });
      setUpdating(false);
    }
  };

  if (loading || !staff) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Fetching Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <Sidebar active="staff" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1200px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Edit <span className="text-indigo-600 italic">Personnel</span>
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">
               System ID: <span className="text-slate-900">#STF-{id}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/staff")}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Cancel
          </button>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden p-8 lg:p-12">
          <form onSubmit={submitForm} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Profile Details Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Identity & Contact</h3>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name *</label>
                  <input
                    type="text"
                    value={staff.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Official Email *</label>
                  <input
                    type="email"
                    value={staff.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Contact Phone</label>
                  <input
                    type="text"
                    value={staff.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Administrative Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Employment & Access</h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Monthly Salary</label>
                        <input
                            type="number"
                            value={staff.salary || ""}
                            onChange={(e) => updateField("salary", e.target.value)}
                            min="0"
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Hired On</label>
                        <input
                            type="date"
                            value={staff.hired_date || ""}
                            onChange={(e) => updateField("hired_date", e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Staff Role *</label>
                  <select
                    value={staff.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    {staffRoles.map(role => (
                        <option key={role} value={role} className="capitalize text-slate-900">{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Reset Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password or leave empty"
                    onChange={(e) => updateField("password", e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
              >
                {updating ? "Committing Changes..." : "Save Personnel Record"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
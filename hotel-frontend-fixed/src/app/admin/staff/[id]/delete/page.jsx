"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function DeleteStaffPage() {
  const router = useRouter();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`${API_URL}/api/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.message || "Staff not found.");
          setTimeout(() => router.push("/admin/staff"), 2000);
          return;
        }
        setStaff(json.data);
      } catch (err) {
        toast.error("Network error: Connection failed.");
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [id, router, token]);

  const deleteStaff = async () => {
    setDeleting(true);
    const loadingToast = toast.loading("Processing deletion...");

    try {
      const res = await fetch(`${API_URL}/api/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Record purged successfully", { id: loadingToast });
        setTimeout(() => router.push("/admin/staff"), 1500);
      } else {
        const json = await res.json();
        toast.error(json.message || "Deletion failed", { id: loadingToast });
        setDeleting(false);
      }
    } catch (err) {
      toast.error("Critical server error", { id: loadingToast });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <Sidebar active="staff" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1000px] mx-auto w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                    Terminate <span className="text-rose-600 text-3xl font-bold uppercase tracking-widest ml-2 italic">Record</span>
                </h1>
                <p className="text-slate-500 font-medium">Internal Employee ID: {id}</p>
            </div>
            <button
                onClick={() => router.push("/admin/staff")}
                className="px-5 py-2 text-slate-400 font-bold hover:text-slate-900 transition-colors flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                Abort
            </button>
        </div>

        {/* WARNING CARD */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-rose-200/40 border border-white overflow-hidden">
          <div className="bg-rose-600 p-12 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" /></svg>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Final Confirmation</h2>
            <p className="text-rose-100 font-medium opacity-90 max-w-sm mx-auto">
              This action is irreversible. All access tokens and logs associated with this member will be detached.
            </p>
          </div>

          <div className="p-12 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</span>
                    <span className="text-lg font-black text-slate-800 tracking-tight">{staff.name}</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Role</span>
                    <span className="text-lg font-black text-indigo-600 uppercase tracking-tighter italic">{staff.role}</span>
                </div>
                <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Email</span>
                    <span className="text-lg font-black text-slate-800 tracking-tight">{staff.email}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={deleteStaff}
                disabled={deleting}
                className="flex-1 py-5 bg-rose-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Purging Record..." : "Confirm Deletion"}
              </button>
              <button
                onClick={() => router.push("/admin/staff")}
                disabled={deleting}
                className="px-10 py-5 bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
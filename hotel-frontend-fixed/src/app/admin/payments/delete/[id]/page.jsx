"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function DeletePaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) {
            toast.error(json.message || "Could not find payment record");
            return router.push("/admin/payments");
        }

        setPayment(json.data);
      } catch (err) {
        console.error(err);
        toast.error("Network error while loading payment");
      }
      setLoading(false);
    };

    if (token) load();
  }, [id, token, router]);

  const deletePayment = async () => {
    setIsDeleting(true);
    const deleteToast = toast.loading("Purging transaction record...");

    try {
      const res = await fetch(`${API_URL}/api/payments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Deletion blocked by system", { id: deleteToast });
        setIsDeleting(false);
        return;
      }

      toast.success("Payment record permanently removed", { id: deleteToast });
      setTimeout(() => {
        router.push("/admin/payments");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to server", { id: deleteToast });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Verifying Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar active="payments" />
      <Toaster position="top-right" />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-red-100 border border-red-50 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-red-50/50 p-10 text-center border-b border-red-50">
            <div className="w-20 h-20 bg-white text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Confirm Deletion</h1>
            <p className="text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Critical Security Action</p>
          </div>

          {/* Details Section */}
          <div className="p-10 space-y-5 bg-white">
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Receipt ID</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">#PAY-{id}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Amount</span>
              <span className="text-xl font-black text-slate-900">Rs. {Number(payment?.amount).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Current Status</span>
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                payment?.payment_status?.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {payment?.payment_status}
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 mt-4">
                <div className="text-amber-600 font-bold text-xl">!</div>
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Deleting this payment will remove it from financial reports. The associated booking will remain, but will show an unpaid balance.
                </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="px-10 pb-10 flex flex-col gap-3">
            <button
              onClick={deletePayment}
              disabled={isDeleting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-red-200 active:scale-95 disabled:bg-red-300"
            >
              {isDeleting ? "Purging..." : "Confirm & Delete Record"}
            </button>
            
            <button
              onClick={() => router.push("/admin/payments")}
              disabled={isDeleting}
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel & Safe Exit
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-2 opacity-30 grayscale">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-[10px] text-white font-black italic">V</div>
            <p className="text-[10px] font-black uppercase tracking-widest">Velvet Door Security Ops</p>
        </div>
      </main>
    </div>
  );
}
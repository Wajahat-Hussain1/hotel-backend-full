"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function EditPaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  // Load existing payment
  useEffect(() => {
    const loadPayment = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) {
          toast.error(json.message || "Failed to load payment");
          return router.push("/admin/payments");
        }

        setPayment(json.data);
      } catch (err) {
        console.error(err);
        toast.error("Network error fetching payment details");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadPayment();
  }, [id, router, token]);

  const updateField = (key, value) => {
    setPayment({ ...payment, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const updateToast = toast.loading("Syncing financial records...");

    try {
      const res = await fetch(`${API_URL}/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payment),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Update failed", { id: updateToast });
        setIsUpdating(false);
        return;
      }

      toast.success("Payment record updated!", { id: updateToast });
      setTimeout(() => {
        router.push("/admin/payments");
      }, 1000);

    } catch (err) {
      toast.error("Update failed due to a server error", { id: updateToast });
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold tracking-tight">Accessing Ledger...</p>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar active="payments" />
      <Toaster position="top-right" />

      <main className="flex-1 p-6 lg:p-12 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="mb-10">
            <button 
                onClick={() => router.back()}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors mb-4 block"
            >
                ← Return to List
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Edit Transaction <span className="text-purple-600">#{id}</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">Update processing status or adjust the final amounts.</p>
          </div>

          <form
            onSubmit={submitForm}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8"
          >
            {/* ID Information Header */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Internal Reference</label>
                    <p className="font-bold text-slate-700 font-mono">PAY-{payment.payment_id}</p>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Associated Booking</label>
                    <p className="font-bold text-slate-700 font-mono">BOK-{payment.booking_id}</p>
                </div>
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">Transaction Amount (PKR)</label>
                <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rs.</span>
                    <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updateField("amount", e.target.value)}
                        className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl focus:border-purple-500 focus:ring-0 transition-all font-black text-xl text-slate-900 outline-none"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method */}
                <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">Payment Method</label>
                    <select
                        value={payment.payment_method}
                        onChange={(e) => updateField("payment_method", e.target.value)}
                        className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl bg-white font-bold text-slate-700 focus:border-purple-500 transition-all outline-none appearance-none"
                    >
                        <option value="cash">💵 Cash Payment</option>
                        <option value="card">💳 Credit/Debit Card</option>
                        <option value="bank">🏛️ Bank Transfer</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-3 ml-1">Current Status</label>
                    <select
                        value={payment.payment_status}
                        onChange={(e) => updateField("payment_status", e.target.value)}
                        className={`w-full px-5 py-4 border-2 rounded-2xl bg-white font-bold focus:ring-0 transition-all outline-none appearance-none ${
                            payment.payment_status === 'paid' ? 'border-emerald-100 text-emerald-600' : 
                            payment.payment_status === 'refunded' ? 'border-amber-100 text-amber-600' : 'border-rose-100 text-rose-600'
                        }`}
                    >
                        <option value="paid">✅ Paid / Received</option>
                        <option value="refunded">🔄 Refunded</option>
                        <option value="failed">❌ Payment Failed</option>
                    </select>
                </div>
            </div>

            {/* Read Only Meta */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                <span>Created At: {new Date(payment.created_at).toLocaleDateString()}</span>
                <span>Cancellation Deadline: {payment.cancel_until || 'No limit'}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-200 disabled:bg-purple-300 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                    {isUpdating ? "Processing Update..." : "Confirm & Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin/payments")}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-200 active:scale-[0.98]"
                >
                    Discard
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
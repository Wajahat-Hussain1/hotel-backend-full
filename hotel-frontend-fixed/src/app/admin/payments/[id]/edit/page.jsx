"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";

export default function EditPaymentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState(null); // For custom notification

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  // Load existing payment
  useEffect(() => {
    const loadPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) {
          // alert hata diya gaya hai
          console.error(json.message || "Failed to load payment");
          return router.push("/admin/payments");
        }

        setPayment(json.data);
      } catch (err) {
        console.error(err);
        // alert hata diya gaya hai
      }

      setLoading(false);
    };

    loadPayment();
  }, [id, router, token]);

  const updateField = (key, value) => {
    setPayment({ ...payment, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payment),
      });

      const json = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: json.message || "Update failed" });
        setIsUpdating(false);
        return;
      }

      setMessage({ type: 'success', text: "Payment updated successfully!" });
      // Notification dikhane ke liye thoda rukte hain, phir redirect karte hain
      setTimeout(() => {
        router.push("/admin/payments");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Update failed due to an error" });
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-gray-500 animate-pulse text-xl font-medium">Loading payment details...</p>
      </div>
    );
  }

  if (!payment)
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="p-10 text-red-600 font-semibold text-xl">Payment not found or access denied.</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar active="payments" />

      <main className="flex-1 p-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
            Edit Payment <span className="text-gray-400 font-light">#{id}</span>
          </h1>

          {/* Custom Notification Message */}
          {message && (
            <div className={`p-4 mb-6 rounded-lg font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form
            onSubmit={submitForm}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6"
          >
            {/* Disabled ID Fields */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment ID</label>
                    <input
                    disabled
                    value={payment.payment_id}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Booking ID</label>
                    <input
                    disabled
                    value={payment.booking_id}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (PKR)</label>
                <input
                type="number"
                value={payment.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                required
                />
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                    <select
                    value={payment.payment_method}
                    onChange={(e) => updateField("payment_method", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-purple-500 focus:border-purple-500 transition duration-150 appearance-none"
                    >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                    </select>
                </div>

                {/* Payment Status */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
                    <select
                    value={payment.payment_status}
                    onChange={(e) => updateField("payment_status", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-purple-500 focus:border-purple-500 transition duration-150 appearance-none"
                    >
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Cancel Until */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cancel Until (Read-Only)</label>
                <input
                    type="text"
                    disabled
                    value={payment.cancel_until || 'N/A'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>

            <div className="flex space-x-4 pt-4">
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-bold transition-all hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed shadow-lg shadow-purple-200 active:scale-[0.99]"
                >
                    {isUpdating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                        </>
                    ) : (
                        "Update Payment Details"
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin/payments")}
                    className="w-32 py-3.5 bg-gray-200 text-gray-700 rounded-xl font-bold transition-all hover:bg-gray-300 active:scale-[0.99]"
                >
                    Cancel
                </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

// ✅ Point to Render Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentPage() {
  const { bid } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      const token = localStorage.getItem("hotel_token");
      // ✅ Redirect to correct login path if no token
      if (!token) return router.push("/login");

      try {
        const res = await fetch(
          `${API_URL}/api/bookings/customer/${bid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        if (!res.ok) {
          alert(json.message || "Booking not accessible");
          return router.push("/user/bookings");
        }

        setBooking(json.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load booking details");
        router.push("/user/bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bid, router]);

  const payNow = async () => {
    if (!booking) return;

    setBusy(true);
    try {
      const token = localStorage.getItem("hotel_token");
      if (!token) return router.push("/login");

      // ✅ Call Stripe Checkout on Render Backend
      const res = await fetch(
        `${API_URL}/api/payments/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: booking.booking_id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Stripe session failed");
        setBusy(false);
        return;
      }

      // ⭐ Redirect to Stripe's hosted checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error(err);
      alert("Stripe payment error. Please try again.");
      setBusy(false);
    }
  };

  /* ================= LOADING & ERROR STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Initializing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm border border-gray-100">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">We couldn't retrieve the details for this session.</p>
            <button onClick={() => router.push('/')} className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold">Return Home</button>
        </div>
      </div>
    );
  }

  /* ================= UI RENDER ================= */

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-12 px-4">
        
        {/* STEPPER */}
        <div className="flex items-center justify-center mb-12">
            <div className="flex items-center text-green-600 font-semibold">
                <span className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full mr-2 shadow-sm">✓</span> 
                <span className="hidden sm:inline">Selection</span>
            </div>
            <div className="w-12 sm:w-16 h-1 bg-green-600 mx-4 rounded"></div>
            <div className="flex items-center text-indigo-600 font-semibold">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full mr-2 shadow-lg animate-pulse">2</span> 
                <span>Payment</span>
            </div>
            <div className="w-12 sm:w-16 h-1 bg-gray-200 mx-4 rounded"></div>
            <div className="flex items-center text-gray-400 font-medium">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full mr-2">3</span> 
                <span className="hidden sm:inline">Confirm</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: BOOKING DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Reservation Summary</h3>
                    <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-tighter">Awaiting Payment</span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking Reference</label>
                            <p className="text-slate-900 font-bold text-lg">#{booking.booking_id}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay Period</label>
                            <p className="text-slate-700 font-medium">
                                {new Date(booking.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                                <span className="mx-2 text-slate-300">—</span>
                                {new Date(booking.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Selection</label>
                            <p className="text-slate-900 font-bold">{booking.type_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-medium">Room {booking.room_number}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-6 mb-6 bg-indigo-50/50 rounded-xl p-4 flex items-start gap-4 border border-indigo-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.48l.342-1.615m0 0a11.952 11.952 0 01-4.642-4.706c1.815.143 3.51.122 5.304-.035m0 0a11.956 11.956 0 014.642 4.706c-1.815-.143-3.51-.122-5.304.035z"></path></svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-indigo-900">Secure Stripe Checkout</h4>
                        <p className="text-xs text-indigo-700/70 leading-relaxed mt-1">
                            You will be redirected to Stripe to complete your payment securely. We do not store your credit card information.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY & STRIPE BUTTON */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Price Breakdown</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-500 font-medium">
                        <span>Room Subtotal</span>
                        <span>PKR {Number(booking.total_price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                        <span>Service Charges</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-800">Total Amount</span>
                        <div className="text-right">
                             <span className="block text-2xl font-black text-indigo-600">PKR {Number(booking.total_price).toLocaleString()}</span>
                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">All taxes included</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={payNow}
                    disabled={busy}
                    className={`w-full relative py-4 rounded-xl text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-100 ${
                        busy 
                        ? "bg-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    <div className="flex items-center justify-center gap-3">
                        {busy ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Proceed to Pay</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </>
                        )}
                    </div>
                </button>

                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6 opacity-40 grayscale hover:grayscale-0 transition" alt="Stripe" />
                    <p className="text-[9px] text-slate-400 mt-4 font-bold uppercase tracking-widest">
                        🛡️ PCI-DSS Compliant Gateway
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function PaymentPage() {
  const { bid } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      const token = localStorage.getItem("hotel_token");
      if (!token) return router.push("/auth/login");

      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/customer/${bid}`,
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
        alert("Failed to load booking");
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
      if (!token) return router.push("/auth/login");

      const res = await fetch(
        "http://localhost:5000/api/payments/stripe/create-checkout-session",
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

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Stripe payment error");
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Initializing secure checkout environment...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
            <p className="text-slate-500 mt-2 mb-6">We couldn't retrieve the details for this booking session.</p>
            <button onClick={() => router.push('/user/bookings')} className="bg-slate-800 text-white px-6 py-2 rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-12 px-4">
        
        {/* PROGRESS STEPPER (Professional UI addition) */}
        <div className="flex items-center justify-center mb-12">
            <div className="flex items-center text-indigo-600 font-semibold">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full mr-2">✓</span> Review
            </div>
            <div className="w-16 h-1 bg-indigo-600 mx-4 rounded"></div>
            <div className="flex items-center text-indigo-600 font-semibold">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full mr-2">2</span> Payment
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-4 rounded"></div>
            <div className="flex items-center text-gray-400 font-medium">
                <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full mr-2">3</span> Confirm
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: BOOKING DETAILS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Reservation Details</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Pending Payment</span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Reference</label>
                            <p className="text-slate-800 font-semibold">#{booking.booking_id}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stay Dates</label>
                            <p className="text-slate-700 font-medium italic">
                                {new Date(booking.check_in).toDateString()} — {new Date(booking.check_out).toDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room Selection</label>
                            <p className="text-slate-800 font-semibold">{booking.type_name}</p>
                            <p className="text-sm text-slate-500 italic">Room Number: {booking.room_number}</p>
                        </div>
                    </div>
                </div>

                <div className="mx-6 mb-6 bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
                    <span className="text-xl">🛡️</span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Payment Security</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Your payment is being processed through Stripe's encrypted gateway. We never store your full card details on our servers.
                        </p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY & STRIPE BUTTON */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Order Total</h3>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-slate-500">
                        <span>Base Amount</span>
                        <span>PKR {booking.total_price}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                        <span>Taxes & Fees</span>
                        <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded">Included</span>
                    </div>
                    <div className="h-px bg-slate-100 w-full pt-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-800">Total</span>
                        <span className="text-2xl font-black text-indigo-600">PKR {booking.total_price}</span>
                    </div>
                </div>

                <button
                    onClick={payNow}
                    disabled={busy}
                    className={`w-full relative group py-4 rounded-xl text-white font-bold text-lg overflow-hidden transition-all shadow-lg ${
                        busy 
                        ? "bg-slate-400 cursor-not-allowed" 
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
                    }`}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {busy ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <>
                                <span>Pay with Card</span>
                                <span className="text-xl">💳</span>
                            </>
                        )}
                    </div>
                </button>

                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 opacity-60">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-5" alt="Stripe" />
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        🔒 Fully Encrypted Checkout
                    </p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
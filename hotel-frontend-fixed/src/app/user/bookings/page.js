"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// =======================================================
// 1. HELPER COMPONENTS & LOGIC
// =======================================================

const CountdownTimer = ({ createdAt, onExpiry }) => {
  const expiryTime = new Date(createdAt).getTime() + 2 * 60 * 60 * 1000;

  const calculateRemaining = () => {
    const remainingMs = expiryTime - Date.now();
    if (remainingMs <= 0) {
      onExpiry();
      return "Expired";
    }
    const mins = Math.floor((remainingMs / 1000 / 60) % 60);
    const secs = Math.floor((remainingMs / 1000) % 60);
    return `${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateRemaining();
      setTimeLeft(updated);
      if (updated === "Expired") clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="font-mono font-bold text-red-600">{timeLeft}</span>;
};

// =======================================================
// 2. MAIN COMPONENT
// =======================================================

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("upcoming");
  const [refreshKey, setRefreshKey] = useState(0); // Forcing re-renders on expiry
  const router = useRouter();

  useEffect(() => {
    const loadBookings = async () => {
      const token = localStorage.getItem("hotel_token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_URL}/api/bookings/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setBookings(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, [router, refreshKey]);

  const cancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    const token = localStorage.getItem("hotel_token");

    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Booking cancelled successfully.");
        setRefreshKey((prev) => prev + 1);
      } else {
        const err = await res.json();
        alert(err.message || "Cancellation failed");
      }
    } catch (err) {
      alert("System error during cancellation");
    }
  };

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter((b) => {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      if (view === "upcoming") return checkIn >= now && b.booking_status !== "cancelled";
      if (view === "past") return checkOut < now && b.booking_status !== "cancelled";
      if (view === "cancelled") return b.booking_status === "cancelled";
      return true;
    });
  }, [bookings, view]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Retrieving your stays...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <Navbar />

      <div className="bg-slate-900 text-white py-12 shadow-inner">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
          <p className="text-slate-400 mt-1">View your reservation history and active stays.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">
        {/* TABS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex mb-8 overflow-x-auto">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`flex-1 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                view === tab ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <span className="text-4xl">🏨</span>
              <h3 className="text-lg font-bold text-slate-800 mt-4">No {view} stays found</h3>
              <button onClick={() => router.push("/")} className="mt-4 text-indigo-600 font-bold hover:underline">Book a room now →</button>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const hoursSinceCreation = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60);
              const canCancel = b.booking_status === "pending" && hoursSinceCreation <= 2;

              return (
                <div key={b.booking_id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-6 w-full">
                    <div className="hidden sm:flex w-20 h-20 bg-slate-100 rounded-xl items-center justify-center text-3xl">🛏️</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{b.type_name} — <span className="text-indigo-600">Room #{b.room_number}</span></h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 font-medium">
                        <p>📅 <span className="text-slate-700">{new Date(b.check_in).toDateString()}</span></p>
                        <p>—</p>
                        <p><span className="text-slate-700">{new Date(b.check_out).toDateString()}</span></p>
                      </div>
                      <p className="mt-3 text-lg font-black text-slate-900">PKR {Number(b.total_price).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      b.booking_status === 'paid' ? 'bg-green-50 text-green-700 border-green-100' :
                      b.booking_status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {b.booking_status}
                    </span>

                    <div className="flex gap-2">
                      {b.booking_status === "pending" && (
                        <button onClick={() => router.push(`/payment/${b.booking_id}`)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">Pay Now</button>
                      )}
                      {canCancel && (
                        <div className="flex flex-col items-center">
                          <button onClick={() => cancelBooking(b.booking_id)} className="border border-red-200 text-red-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50">Cancel Stay</button>
                          <div className="text-[10px] mt-1 text-slate-400">Ends in: <CountdownTimer createdAt={b.created_at} onExpiry={() => setRefreshKey(k => k + 1)} /></div>
                        </div>
                      )}
                      {b.booking_status === "paid" && (
                        <button onClick={() => router.push(`/invoice/${b.booking_id}`)} className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-bold">Invoice</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
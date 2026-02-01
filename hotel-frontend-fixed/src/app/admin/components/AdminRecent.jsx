"use client";

import { useEffect, useState } from "react";

// Dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function AdminRecent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
    if (!token) return;

    const load = async () => {
      try {
        // Updated from localhost:5000 to production API_URL
        const res = await fetch(`${API_URL}/api/admin/stats/recent-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setBookings(json?.data ?? []);
      } catch (err) {
        console.error("Recent bookings load error:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="h-6 w-32 bg-slate-100 rounded mb-4 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Bookings</h3>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
          Live Updates
        </span>
      </div>

      <div className="overflow-hidden">
        <ul className="divide-y divide-slate-50">
          {bookings.length === 0 ? (
            <li className="py-8 text-center">
               <p className="text-slate-400 text-sm">No recent bookings found.</p>
            </li>
          ) : (
            bookings.map((b) => (
              <li key={b.booking_id} className="py-4 first:pt-0 last:pb-0 group transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* User Initials Circle */}
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {(b.first_name?.[0] || b.type_name?.[0] || "G").toUpperCase()}
                    </div>
                    
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {b.first_name ? `${b.first_name} ${b.last_name ?? ""}` : (b.type_name ?? "Guest")}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {b.type_name ?? "Standard"} <span className="mx-1 text-slate-300">•</span> Room {b.room_number ?? "TBD"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">
                      {b.check_in ? new Date(b.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ""}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                      Check-In
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      
      <button className="w-full mt-6 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-all">
        View All Transactions
      </button>
    </div>
  );
}
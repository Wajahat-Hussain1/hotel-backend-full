"use client";

import { useEffect, useState } from "react";

export default function AdminRecent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats/recent-bookings", {
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
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="h-48 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Recent Bookings</h3>
      <ul className="space-y-2">
        {bookings.length === 0 && <li className="text-gray-500">No recent bookings.</li>}
        {bookings.map((b) => (
          <li key={b.booking_id} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">
                {b.first_name ? `${b.first_name} ${b.last_name ?? ""}` : (b.type_name ?? "Guest")}
              </div>
              <div className="text-sm text-gray-500">{b.type_name ?? ""} · Room {b.room_number ?? "-"}</div>
            </div>
            <div className="text-sm text-gray-500">{b.check_in ? new Date(b.check_in).toLocaleDateString() : ""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

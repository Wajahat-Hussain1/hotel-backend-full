"use client";

import { useEffect, useState } from "react";

export default function AdminStats() {
  const [stats, setStats] = useState({
    total_bookings: 0,
    total_customers: 0,
    revenue: 0,
    total_staff: 0,
    available_rooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
    if (!token) return;

    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setStats({
          total_bookings: json?.data?.total_bookings ?? 0,
          total_customers: json?.data?.total_customers ?? 0,
          revenue: json?.data?.revenue ?? 0,
          total_staff: json?.data?.total_staff ?? 0,
          available_rooms: json?.data?.available_rooms ?? 0,
        });
      } catch (err) {
        console.error("AdminStats load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">Total Bookings</div>
        <div className="mt-2 text-2xl font-bold">{stats.total_bookings}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">Total Customers</div>
        <div className="mt-2 text-2xl font-bold">{stats.total_customers}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">Revenue</div>
        <div className="mt-2 text-2xl font-bold">PKR {Number(stats.revenue || 0).toLocaleString()}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">Staff Count</div>
        <div className="mt-2 text-2xl font-bold">{stats.total_staff}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-500">Available Rooms</div>
        <div className="mt-2 text-2xl font-bold">{stats.available_rooms}</div>
      </div>
    </div>
  );
}

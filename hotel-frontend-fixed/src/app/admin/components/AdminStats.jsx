"use client";

import { useEffect, useState } from "react";

// Dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

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
        // Updated from localhost to production API_URL
        const res = await fetch(`${API_URL}/api/admin/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const json = await res.json();
        
        if (res.ok) {
          setStats({
            total_bookings: json?.data?.total_bookings ?? 0,
            total_customers: json?.data?.total_customers ?? 0,
            revenue: json?.data?.revenue ?? 0,
            total_staff: json?.data?.total_staff ?? 0,
            available_rooms: json?.data?.available_rooms ?? 0,
          });
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  const statCards = [
    { label: "Total Bookings", value: stats.total_bookings, color: "text-blue-600", icon: "📅" },
    { label: "Total Customers", value: stats.total_customers, color: "text-indigo-600", icon: "👥" },
    { label: "Revenue", value: `PKR ${Number(stats.revenue || 0).toLocaleString()}`, color: "text-emerald-600", icon: "💰" },
    { label: "Staff Count", value: stats.total_staff, color: "text-amber-600", icon: "👔" },
    { label: "Available Rooms", value: stats.available_rooms, color: "text-rose-600", icon: "🔑" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
            <span className="text-xl">{card.icon}</span>
          </div>
          <div className={`text-2xl font-black ${card.color} tracking-tight`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
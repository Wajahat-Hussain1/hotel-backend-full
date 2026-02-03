"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --- REUSABLE INPUT FIELD ---
function InputField({ label, value, onChange, placeholder, iconPath, type = "text" }) {
    return (
        <div>
            <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {iconPath}
                </svg>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-xl bg-white focus:border-indigo-500 focus:ring-0 outline-none transition-all text-slate-700 font-bold"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}

export default function AddRoomPage() {
  const router = useRouter();

  const [roomNumber, setRoomNumber] = useState("");
  const [typeName, setTypeName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("available");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Initial Validation
    if (!roomNumber.trim()) {
        toast.error("Room number is required");
        setIsSubmitting(false);
        return;
    }

    try {
      // 1️⃣ Step One: Create or Get Room Type
      const typeRes = await fetch(`${API_URL}/api/room-types/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type_name: typeName.trim(),
          base_price: Number(basePrice),
          capacity: capacity ? Number(capacity) : 1,
        }),
      });

      const typeJson = await typeRes.json();
      if (!typeRes.ok) throw new Error(typeJson.message || "Failed creating room type");

      const typeId = typeJson?.data?.id;
      if (!typeId) throw new Error("Server failed to return Type ID.");

      // 2️⃣ Step Two: Create Physical Room
      const roomRes = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_number: roomNumber.trim(),
          type_id: typeId,
          status,
        }),
      });

      const roomJson = await roomRes.json();
      if (!roomRes.ok) throw new Error(roomJson.message || "Failed creating room");

      toast.success("New room added to inventory!");
      setTimeout(() => router.push("/admin/rooms"), 1200); 

    } catch (err) {
      toast.error(err.message || "Internal Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar active="rooms" />
      <Toaster position="top-right" />

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Inventory <span className="text-indigo-600">Expansion</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Add a new unit to the hotel's bookable assets.</p>
                </div>
                <Link
                    href="/admin/rooms"
                    className="px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                    Back to List
                </Link>
            </div>

            {/* Form */}
            <form
              onSubmit={submitForm}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8 md:p-12"
            >
                <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                    Room Specification
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField
                        label="Room Identification"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. 302-B"
                        iconPath={<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m-1 4h1" />} 
                    />

                    <InputField
                        label="Room Category"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="Penthouse Suite"
                        iconPath={<path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />} 
                    />

                    <InputField
                        label="Base Rate (PKR)"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="12500"
                        iconPath={<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />} 
                    />

                    <InputField
                        label="Maximum Guests"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="4"
                        iconPath={<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />} 
                    />

                    <div className="md:col-span-2">
                        <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Availability</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl font-bold text-slate-700 bg-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="available">🟢 Available for Booking</option>
                            <option value="occupied">🔵 Currently Occupied</option>
                            <option value="maintenance">🟠 Under Maintenance</option>
                        </select>
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-12 py-4 flex items-center justify-center gap-3 font-black rounded-2xl transition-all shadow-lg ${
                        isSubmitting
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200 hover:-translate-y-1"
                    }`}
                >
                    {isSubmitting ? "Provisioning..." : "Add to Inventory"}
                </button>
            </form>
        </div>
      </main>
    </div>
  );
}
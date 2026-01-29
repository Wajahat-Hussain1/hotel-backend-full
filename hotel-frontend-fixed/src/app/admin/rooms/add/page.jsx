"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- CUSTOM TOAST / ALERT COMPONENT ---
// Ye component screen ke top-center mein message display karega
function CustomToast({ message, type, onClose }) {
  if (!message) return null;

  const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3 transition-all duration-300 animate-slide-down";
  let classes = "";
  let iconPath = "";

  if (type === "success") {
    classes = "bg-green-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />; // Check circle
  } else if (type === "error") {
    classes = "bg-red-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />; // X circle
  } else {
    // Default or warning
    classes = "bg-amber-500 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" />; // Exclamation
  }

  return (
    // Tailwind Custom Animation (requires adding keyframes to your global CSS)
    // Agar aap Tailwind config use nahi kar rahe, toh 'fixed' class hi kafi hai.
    <div className={`${baseClasses} ${classes}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{iconPath}</svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}
// ------------------------------------------

// --- REUSABLE INPUT FIELD (for completeness) ---
function InputField({ label, value, onChange, placeholder, iconPath, type = "text" }) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {iconPath}
                </svg>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-700 font-medium"
                    placeholder={placeholder}
                    required={label.includes("Required")}
                />
            </div>
        </div>
    );
}
// ------------------------------------------


export default function AddRoomPage() {
  const router = useRouter();

  const [roomNumber, setRoomNumber] = useState("");
  const [typeName, setTypeName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("available");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state for custom alerts
  const [toast, setToast] = useState({ message: "", type: "" });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  // Custom Toast Handler Function
  const displayToast = (message, type = "error") => {
    setToast({ message, type });
    // Automatically close toast after 5 seconds
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast({ message: "", type: "" }); // Clear previous toast

    // VALIDATION: Now using custom toast
    if (!roomNumber.trim()) return displayToast("Room number is required");
    if (!typeName.trim()) return displayToast("Room type name is required");
    if (!basePrice || Number(basePrice) <= 0)
      return displayToast("Price must be valid and positive");

    const typePayload = {
      type_name: typeName.trim(),
      base_price: Number(basePrice),
      capacity: capacity ? Number(capacity) : 1,
    };

    try {
      // 1️⃣ CREATE ROOM TYPE FIRST
      const typeRes = await fetch("http://localhost:5000/api/room-types/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(typePayload),
      });

      const typeJson = await typeRes.json();

      if (!typeRes.ok) {
        return displayToast(typeJson.message || "Failed creating room type", "error");
      }

      const typeId = typeJson?.data?.id;

      if (!typeId) {
        return displayToast("Room type created but ID missing from server!", "error");
      }

      // 2️⃣ CREATE ROOM USING NEW TYPE_ID
      const roomPayload = {
        room_number: roomNumber.trim(),
        type_id: typeId,
        status,
      };

      const roomRes = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomPayload),
      });

      const roomJson = await roomRes.json();

      if (!roomRes.ok) {
        return displayToast(roomJson.message || "Failed creating room", "error");
      }

      // SUCCESS! Show toast and redirect
      displayToast("Room successfully created!", "success");
      
      // Wait for a moment to let the user see the success message before redirecting
      setTimeout(() => router.push("/admin/rooms"), 1000); 

    } catch (err) {
      displayToast("Something went wrong while adding room.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f5f8ff] p-8 lg:p-12">
      
      {/* --- RENDER CUSTOM TOAST HERE --- */}
      <CustomToast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "" })} 
      />
      {/* ---------------------------------- */}

      <main className="max-w-[1200px] mx-auto w-full">
        
        {/* --- Header Section --- (Same as before) */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    New Room Creation
                </h1>
                <p className="text-base text-slate-500 mt-1">
                    Define the room details and associated room type.
                </p>
            </div>
            <Link
                href="/admin/rooms"
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Rooms
            </Link>
        </div>

        {/* --- Form Container --- (Same as before) */}
        <form
          onSubmit={submitForm}
          className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-3 border-b border-slate-100">
                Room & Pricing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* 1. Room Number */}
                <InputField
                    label="Room Number (Required)"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 101, 20A"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m-1 4h1m-4 0h1m-4 0h1" />} 
                />

                {/* 2. Room Type Name */}
                <InputField
                    label="Room Type Name (e.g., Deluxe, Suite)"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="Standard Double, Executive Suite"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} 
                />

                {/* 3. Base Price */}
                <InputField
                    label="Base Price (PKR)"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="8000.00"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m4-2h4m-4-2v4m-5 3v-5a2 2 0 012-2h2a2 2 0 012 2v5M8 10h.01M16 10h.01" />} 
                />

                {/* 4. Capacity */}
                <InputField
                    label="Capacity (Number of Guests)"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 2"
                    iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />} 
                />

                {/* 5. Status (Full Width) */}
                <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Initial Status</label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.24a2 2 0 00-2.83 0L3.5 16.27a2 2 0 00-.5.98V20a1 1 0 001 1h2.75a2 2 0 00.98-.5L18.39 5.618a2 2 0 000-2.828z" /></svg>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all text-slate-700 font-medium bg-white appearance-none"
                        >
                            <option value="available">Available (Ready for Booking)</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance (Out of Service)</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

            </div>
            
            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-10 py-3 flex items-center justify-center gap-3 font-extrabold rounded-xl transition-all duration-300 shadow-lg 
                    ${isSubmitting
                        ? "bg-indigo-400 text-white cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300/60 hover:-translate-y-0.5"
                    }`
                }
            >
                {isSubmitting ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white border-t-indigo-200 rounded-full animate-spin"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Confirm & Add Room
                    </>
                )}
            </button>
        </form>
      </main>
    </div>
  );
}
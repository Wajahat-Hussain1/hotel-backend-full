"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
// Assuming AdminSidebar is handled by a parent layout or imported

// --- CUSTOM TOAST / ALERT COMPONENT (Reused) ---
function CustomToast({ message, type, onClose }) {
  if (!message) return null;

  const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] p-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3 transition-all duration-300";
  let classes = "";
  let iconPath = "";

  if (type === "success") {
    classes = "bg-green-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />; // Check circle
  } else if (type === "error") {
    classes = "bg-red-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />; // X circle
  }

  return (
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

// --- REUSABLE INPUT FIELD (Adapted from previous component) ---
function InputField({ label, value, onChange, placeholder, iconPath, type = "text", disabled = false }) {
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-all text-slate-700 font-medium ${
                        disabled 
                        ? "bg-slate-100 border-slate-300 cursor-not-allowed" 
                        : "bg-white border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    }`}
                    placeholder={placeholder}
                    required
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
// ------------------------------------------


export default function EditRoomPage() {
    const router = useRouter();
    const { id: roomId } = useParams();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Custom Toast State
    const [toast, setToast] = useState({ message: "", type: "" });

    const [roomNumber, setRoomNumber] = useState("");
    const [status, setStatus] = useState("available");

    const [typeName, setTypeName] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [capacity, setCapacity] = useState("");

    const token =
        typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    // Toast Handler
    const displayToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 5000);
    };

    // --------------------------
    // LOAD ROOM DETAILS
    // --------------------------
    const loadRoom = useCallback(async () => {
        if (!roomId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`);
            const json = await res.json();

            if (!res.ok) {
                displayToast(json.message || "Failed to load room details.", "error");
                // Delay redirect to allow user to read the toast
                setTimeout(() => router.push("/admin/rooms"), 1500);
                return;
            }

            const r = json.data;

            setRoomNumber(r.room_number || "");
            setStatus(r.status || "available");
            setTypeName(r.type_name || "");
            setBasePrice(r.base_price || 0);
            setCapacity(r.capacity || 1);
        } catch (err) {
            console.error(err);
            displayToast("Network error while loading room data.", "error");
        } finally {
            setLoading(false);
        }
    }, [roomId, router]);

    useEffect(() => {
        loadRoom();
    }, [loadRoom]);


    // --------------------------
    // UPDATE ROOM
    // --------------------------
    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setToast({ message: "", type: "" }); 

        // VALIDATION
        if (!roomNumber.trim()) return displayToast("Room number is required");
        if (!typeName.trim()) return displayToast("Room type name is required");
        if (Number(basePrice) <= 0) return displayToast("Base Price must be positive");
        if (Number(capacity) <= 0) return displayToast("Capacity must be at least 1");

        let typeId = null;

        // 1️⃣ CREATE/UPDATE ROOM TYPE (The current API design seems to re-create or find the type)
        try {
            const typeRes = await fetch("http://localhost:5000/api/room-types/custom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type_name: typeName.trim(),
                    base_price: Number(basePrice),
                    capacity: Number(capacity),
                }),
            });

            const typeJson = await typeRes.json();

            if (!typeRes.ok) {
                return displayToast(typeJson.message || "Failed creating/updating room type", "error");
            }
            if (!typeJson.data?.id) {
                return displayToast("Room type operation failed: ID missing from server.", "error");
            }

            typeId = typeJson.data.id;
        } catch (err) {
            console.error(err);
            return displayToast("Error during Room Type update.", "error");
        }

        // 2️⃣ UPDATE ROOM
        try {
            const roomRes = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
                method: "PUT",
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

            if (!roomRes.ok) {
                return displayToast(roomJson.message || "Failed to update room data.", "error");
            }

            displayToast("Room updated successfully!", "success");
            // Delay redirect to allow user to read the success toast
            setTimeout(() => router.push("/admin/rooms"), 1000);
        } catch (err) {
            console.error(err);
            displayToast("Failed to connect to the server for room update.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };


    // --- LOADING STATE RENDER ---
    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f5f8ff]">
                <div className="text-2xl font-semibold text-indigo-600 flex items-center gap-4 p-10 bg-white rounded-xl shadow-lg">
                    <span className="w-6 h-6 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></span>
                    Fetching Room Details...
                </div>
            </div>
        );

    return (
        <div className="flex-1 min-h-screen bg-[#f5f8ff] p-8 lg:p-12">
            
            {/* --- CUSTOM TOAST RENDER --- */}
            <CustomToast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: "", type: "" })} 
            />
            {/* --------------------------- */}

            <main className="max-w-[1200px] mx-auto w-full">
                
                {/* --- Header Section --- */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Edit Room #{roomNumber}
                        </h1>
                        <p className="text-base text-slate-500 mt-1">
                            Update room information and associated room type details.
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

                {/* --- Form Container --- */}
                <form
                    onSubmit={submitForm}
                    className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto"
                >
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-3 border-b border-slate-100">
                        Room & Pricing Update
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* 1. Room Number (Sometimes locked/disabled for existing rooms) */}
                        <InputField
                            label="Room Number"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            placeholder="e.g. 101"
                            iconPath={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m-1 4h1m-4 0h1m-4 0h1" />}
                            // Keeping it enabled, but highlighting its importance
                        />

                        {/* 2. Room Type Name */}
                        <InputField
                            label="Room Type Name (e.g., Deluxe, Suite)"
                            value={typeName}
                            onChange={(e) => setTypeName(e.target.value)}
                            placeholder="Standard Double"
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
                            <label className="block mb-2 text-sm font-semibold text-slate-700">Current Status</label>
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
                                    <option value="inactive">Inactive (Permanently Disabled)</option>
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
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-indigo-200 rounded-full animate-spin"></span>
                                Updating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v8" /></svg>
                                Save Changes for Room #{roomNumber}
                            </>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "../../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

// --- REUSABLE INPUT FIELD ---
function InputField({ label, value, onChange, placeholder, iconPath, type = "text", disabled = false }) {
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
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all text-slate-700 font-bold ${
                        disabled 
                        ? "bg-slate-50 border-slate-100 cursor-not-allowed opacity-60" 
                        : "bg-white border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none"
                    }`}
                    placeholder={placeholder}
                    required
                    disabled={disabled}
                />
            </div>
        </div>
    );
}

export default function EditRoomPage() {
    const router = useRouter();
    const { id: roomId } = useParams();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [roomNumber, setRoomNumber] = useState("");
    const [status, setStatus] = useState("available");
    const [typeName, setTypeName] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [capacity, setCapacity] = useState("");

    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    const loadRoom = useCallback(async () => {
        if (!roomId) return;
        try {
            const res = await fetch(`${API_URL}/api/rooms/${roomId}`);
            const json = await res.json();

            if (!res.ok) {
                toast.error(json.message || "Room not found.");
                return router.push("/admin/rooms");
            }

            const r = json.data;
            setRoomNumber(r.room_number || "");
            setStatus(r.status || "available");
            setTypeName(r.type_name || "");
            setBasePrice(r.base_price || 0);
            setCapacity(r.capacity || 1);
        } catch (err) {
            console.error(err);
            toast.error("Network error loading room data.");
        } finally {
            setLoading(false);
        }
    }, [roomId, router]);

    useEffect(() => {
        loadRoom();
    }, [loadRoom]);

    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1️⃣ Update/Create Room Type Meta
        let typeId = null;
        try {
            const typeRes = await fetch(`${API_URL}/api/room-types/custom`, {
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
            if (!typeRes.ok) throw new Error(typeJson.message || "Type update failed");
            typeId = typeJson.data.id;
        } catch (err) {
            toast.error(err.message);
            setIsSubmitting(false);
            return;
        }

        // 2️⃣ Update Primary Room Record
        try {
            const roomRes = await fetch(`${API_URL}/api/rooms/${roomId}`, {
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

            if (!roomRes.ok) throw new Error("Failed to update room parameters.");

            toast.success("Room configuration synchronized!");
            setTimeout(() => router.push("/admin/rooms"), 1200);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar active="rooms" />
            <Toaster position="top-right" />
            
            <main className="flex-1 p-6 lg:p-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                                Edit Room <span className="text-indigo-600">#{roomNumber}</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Modify physical properties and pricing tiers.</p>
                        </div>
                        <Link
                            href="/admin/rooms"
                            className="px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-bold text-xs hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                        >
                            Cancel
                        </Link>
                    </div>

                    <form onSubmit={submitForm} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField
                                label="Inventory Number"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                placeholder="101"
                                iconPath={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
                            />

                            <InputField
                                label="Classification"
                                value={typeName}
                                onChange={(e) => setTypeName(e.target.value)}
                                placeholder="Executive Suite"
                                iconPath={<path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />}
                            />

                            <InputField
                                label="Price Per Night (PKR)"
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                placeholder="15000"
                                iconPath={<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                            />

                            <InputField
                                label="Occupancy Limit"
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="2"
                                iconPath={<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                            />

                            <div className="md:col-span-2">
                                <label className="block mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl font-bold text-slate-700 bg-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="available">🟢 Available</option>
                                    <option value="occupied">🔵 Occupied</option>
                                    <option value="maintenance">🟠 Maintenance</option>
                                    <option value="inactive">🔴 Inactive</option>
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
                            {isSubmitting ? "Syncing..." : "Update Room Configuration"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
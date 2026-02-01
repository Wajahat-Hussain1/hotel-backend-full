"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

// --- MINIMALIST STATUS BADGE ---
function StatusBadge({ text }) {
    const statusStyles = {
        available: "bg-emerald-50 text-emerald-700 border-emerald-100",
        occupied: "bg-blue-50 text-blue-700 border-blue-100",
        maintenance: "bg-amber-50 text-amber-700 border-amber-100",
        inactive: "bg-rose-50 text-rose-700 border-rose-100",
    };

    return (
        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${statusStyles[text] || statusStyles.maintenance}`}>
            {text}
        </span>
    );
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("active"); 
    const [confirmAction, setConfirmAction] = useState(null); 

    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/rooms`);
            const json = await res.json();
            setRooms(json.data || []);
        } catch (err) {
            toast.error("Network error: Could not load rooms.");
        } finally {
            setLoading(false);
        }
    };

    const toggleRoomStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'inactive' ? 'available' : 'inactive';
        const actionText = newStatus === 'inactive' ? 'disabled' : 'enabled';

        try {
            const res = await fetch(`${API_URL}/api/rooms/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Room ${actionText} successfully!`);
            setRooms(prev => prev.map(r => r.room_id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setConfirmAction(null);
        }
    };

    const filtered = rooms.filter((r) => {
        if (view === "inactive" && r.status !== "inactive") return false;
        if (view === "active" && r.status === "inactive") return false;
        return `${r.room_number} ${r.type_name}`.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Toaster position="top-right" />
            <AdminSidebar active="rooms" />

            <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
                
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            Room <span className="text-indigo-600">Inventory</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Monitor and manage property assets.</p>
                    </div>
                    <Link
                        href="/admin/rooms/add"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24 font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Create Room
                    </Link>
                </div>

                {/* --- Search & Filters --- */}
                <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                        {["active", "inactive", "all"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setView(tab)}
                                className={`flex-1 md:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                                    view === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by number or type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>

                {/* --- Table --- */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Info</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Availability</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-slate-400 font-bold text-sm">Syncing Inventory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map((r) => (
                                <tr key={r.room_id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-slate-800">Room {r.room_number}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">ID: {r.room_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-600">{r.type_name}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <StatusBadge text={r.status} />
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/rooms/${r.room_id}/edit`}
                                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l4-4m-9 9l4 4m-4-4l4-4m-9 9l4 4" /></svg>
                                            </Link>
                                            <button
                                                onClick={() => setConfirmAction(r)}
                                                className={`p-2.5 rounded-xl transition-all ${
                                                    r.status === 'inactive' 
                                                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" 
                                                    : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                                                }`}
                                            >
                                                {r.status === 'inactive' ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* --- Minimalist Confirmation Modal --- */}
            {confirmAction && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${confirmAction.status === 'inactive' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24 font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Update Asset?</h3>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                            Are you sure you want to {confirmAction.status === 'inactive' ? 'enable' : 'disable'} Room {confirmAction.room_number}?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setConfirmAction(null)}
                                className="py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => toggleRoomStatus(confirmAction.room_id, confirmAction.status)}
                                className={`py-3 text-white font-bold rounded-xl transition-all ${confirmAction.status === 'inactive' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

// --- DYNAMIC API URL ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

// --- REUSABLE COMPONENTS & HELPERS ---

function CustomToast({ message, type, onClose }) {
  if (!message) return null;

  const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] p-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3 transition-all duration-300";
  let classes = type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white";
  
  const icon = type === "success" ? (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ) : (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  );

  return (
    <div className={`${baseClasses} ${classes}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
    const statusMap = {
        pending: { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
        paid: { text: "Paid", color: "bg-green-100 text-green-800" },
        cancelled: { text: "Cancelled", color: "bg-red-100 text-red-800" },
        checked_in: { text: "Checked In", color: "bg-blue-100 text-blue-800" },
        checked_out: { text: "Completed", color: "bg-slate-100 text-slate-600" },
        active: { text: "Active", color: "bg-blue-100 text-blue-800" },
        past: { text: "Completed", color: "bg-slate-100 text-slate-600" },
    };

    const s = statusMap[status] || statusMap.pending;

    return (
        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md capitalize ${s.color}`}>
            {s.text}
        </span>
    );
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// --- MAIN COMPONENT ---

export default function AdminBookings() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState("active"); 
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [confirmAction, setConfirmAction] = useState(null);

    // Toast Handler
    const displayToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 5000);
    };

    const isBookingPast = (checkOutDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        return new Date(checkOutDate) < today;
    };

    const loadData = useCallback(async () => {
        const token = localStorage.getItem("hotel_token");
        if (!token) {
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `${API_URL}/api/bookings?tab=${tab}&search=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const json = await res.json();
            
            if (res.ok) {
                const processedBookings = (json.data || []).map(b => ({
                    ...b,
                    check_in_formatted: formatDate(b.check_in),
                    check_out_formatted: formatDate(b.check_out),
                    is_past: isBookingPast(b.check_out),
                }));
                setBookings(processedBookings);
            } else {
                 displayToast(json.message || "Failed to load bookings.", "error");
            }
        } catch (err) {
            console.error(err);
            displayToast("Network error: Failed to fetch bookings data.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [tab, search, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const executeAction = async () => {
        if (!confirmAction) return;
        const { id } = confirmAction;
        const token = localStorage.getItem("hotel_token");

        setConfirmAction(null);

        try {
            const res = await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();

            if (!res.ok) {
                return displayToast(json.message || `Failed to cancel booking.`, "error");
            }

            displayToast("Booking successfully cancelled!", "success");
            loadData(); 
        } catch (err) {
            displayToast(`Network error: Could not execute cancel action.`, "error");
        }
    };

    return (
        <div className="flex bg-[#f5f8ff] min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminNavbar />

                <div className="p-8 lg:p-12 max-w-[1800px] mx-auto w-full">

                    <CustomToast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast({ message: "", type: "" })} 
                    />

                    {confirmAction && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Cancellation</h3>
                                <p className="text-slate-600 mb-6">Are you sure? This action is irreversible.</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-slate-700 border rounded-lg">No</button>
                                    <button onClick={executeAction} className="px-4 py-2 text-white bg-red-600 rounded-lg">Yes, Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-8 pb-4 border-b">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-black">Bookings</h1>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border">
                            {["active", "cancelled", "past"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                                        tab === t ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder={`Search in ${tab}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && loadData()}
                                className="w-full pl-4 pr-4 py-2.5 border rounded-xl shadow-sm text-black"
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl border overflow-hidden">
                        <table className="min-w-full text-left">
                            <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b">
                                <tr>
                                    <th className="p-4 font-extrabold text-black">Customer</th>
                                    <th className="p-4 font-extrabold text-black">Room</th>
                                    <th className="p-4 font-extrabold text-black">Check In → Out</th>
                                    <th className="p-4 font-extrabold text-black">Status</th>
                                    <th className="p-4 font-extrabold text-center text-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td className="p-6 text-center text-indigo-600" colSpan={5}>Loading...</td></tr>
                                ) : bookings.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-10 text-gray-500 text-black">No bookings found.</td></tr>
                                ) : bookings.map((b) => (
                                    <tr key={b.booking_id} className="border-t hover:bg-slate-50">
                                        <td className="p-4 font-semibold text-black">{b.first_name} {b.last_name}</td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            {b.type_name} <span className="block text-xs text-slate-400">({b.room_number})</span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">
                                            <span className="text-indigo-600 font-bold">{b.check_in_formatted}</span> → <span className="text-indigo-600 font-bold">{b.check_out_formatted}</span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={tab === 'past' ? 'past' : b.booking_status} />
                                        </td>
                                        <td className="p-4 space-x-3 text-center">
                                            <Link href={`/admin/bookings/${b.booking_id}`} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">Details</Link>
                                            {tab === "active" && b.booking_status !== "cancelled" && !b.is_past && (
                                                <button onClick={() => setConfirmAction({id: b.booking_id})} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm">Cancel</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
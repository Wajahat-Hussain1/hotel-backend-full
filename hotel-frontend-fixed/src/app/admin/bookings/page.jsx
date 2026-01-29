"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

// --- REUSABLE COMPONENTS & HELPERS ---

// 1. Custom Toast Component (Reused for success/error messages)
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

// 2. Status Badge Component (Minimalist style)
function StatusBadge({ status }) {
    const statusMap = {
        pending: { text: "Pending", color: "yellow" },
        paid: { text: "Paid", color: "green" },
        cancelled: { text: "Cancelled", color: "red" },
        checked_in: { text: "Checked In", color: "blue" },
        checked_out: { text: "Completed", color: "slate" },
        // Fallback for logic-derived statuses
        active: { text: "Active", color: "blue" },
        past: { text: "Completed", color: "slate" },
    };

    const s = statusMap[status] || statusMap.pending;

    const styles = {
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800",
        yellow: "bg-yellow-100 text-yellow-800",
        blue: "bg-blue-100 text-blue-800",
        slate: "bg-slate-100 text-slate-600",
    };

    return (
        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md capitalize ${styles[s.color]}`}>
            {s.text}
        </span>
    );
}

// 3. Formatting Helpers
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// --- MAIN COMPONENT ---

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState("active"); // active | cancelled | past
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Custom Toast/Confirmation States
    const [toast, setToast] = useState({ message: "", type: "" });
    const [confirmAction, setConfirmAction] = useState(null); // { id, action }

    const token =
        typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;
    
    // Toast Handler
    const displayToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 5000);
    };

    // Date Logic Helper
    const isBookingPast = (checkOutDate) => {
        // If check_out is today or in the past, it's considered past.
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        return new Date(checkOutDate) < today;
    };

    // Load Data Function
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                // API call uses tab and search for server-side filtering
                `http://localhost:5000/api/bookings?tab=${tab}&search=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const json = await res.json();
            
            if (res.ok) {
                 // Format dates and attach calculated status fields for client-side logic
                const processedBookings = (json.data || []).map(b => ({
                    ...b,
                    check_in_formatted: formatDate(b.check_in),
                    check_out_formatted: formatDate(b.check_out),
                    is_past: isBookingPast(b.check_out), // Client-side check for action control
                }));
                setBookings(processedBookings);
            } else {
                 displayToast(json.message || "Failed to load bookings.", "error");
                 setBookings([]);
            }
           
        } catch (err) {
            console.error(err);
            displayToast("Network error: Failed to fetch bookings data.", "error");
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    }, [tab, search, token]);

    useEffect(() => {
        loadData();
    }, [loadData]); // useEffect runs when tab or search changes, thanks to loadData being wrapped in useCallback


    // Action Execution (after confirmation)
    const executeAction = async () => {
        if (!confirmAction) return;
        const { id, action } = confirmAction;

        // Clear confirmation modal and toast
        setConfirmAction(null);
        setToast({ message: "", type: "" });

        if (action !== 'cancel') return; // Only cancel action supported in this block

        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();

            if (!res.ok) {
                return displayToast(json.message || `Failed to cancel booking.`, "error");
            }

            displayToast("Booking successfully cancelled!", "success");
            loadData(); // Reload data to show updated status

        } catch (err) {
            displayToast(`Network error: Could not execute cancel action.`, "error");
        }
    };

    const showConfirmation = (id, action) => {
        setConfirmAction({ id, action });
    }
    
    const cancelBooking = (id) => showConfirmation(id, 'cancel');


    // --- RENDERING ---

    return (
        <div className="flex bg-[#f5f8ff] min-h-screen">
            <AdminSidebar />

            <div className="flex-1">
                <AdminNavbar /> {/* Assuming AdminNavbar exists */}

                <div className="p-8 lg:p-12 max-w-[1800px] mx-auto w-full">

                    {/* --- CUSTOM TOAST & CONFIRMATION MODAL --- */}
                    <CustomToast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast({ message: "", type: "" })} 
                    />

                    {confirmAction && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                                <svg className="w-12 h-12 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" /></svg>
                                <h3 className="text-xl font-bold text-slate-800 mb-2 capitalize">Confirm Cancellation</h3>
                                <p className="text-slate-600 mb-6">
                                    Are you sure you want to cancel this booking? This action is usually irreversible.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={() => setConfirmAction(null)}
                                        className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                                    >
                                        No, Keep it
                                    </button>
                                    <button 
                                        onClick={executeAction}
                                        className="px-4 py-2 text-white font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700"
                                    >
                                        Yes, Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ------------------------------------------- */}

                    {/* --- Header Section --- */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Booking
                            </h1>
                            <p className="text-base text-slate-500 mt-1">
                                Manage current, future, and past customer reservations.
                            </p>
                        </div>
                    </div>
                    
                    {/* --- TABS and SEARCH --- */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        
                        {/* Tabs */}
                        <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                            {["active", "cancelled", "past"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                                        tab === t
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder={`Search in ${tab} bookings...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && loadData()}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            {search && (
                                <button onClick={loadData} className="absolute right-0 top-1/2 -translate-y-1/2 text-sm px-3 py-1 mr-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">Search</button>
                            )}
                        </div>
                    </div>

                    {/* --- Main Data Table --- */}
                    <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                        <table className="min-w-full text-left">
                            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-xs border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-extrabold w-1/5">Customer</th>
                                    <th className="p-4 font-extrabold w-1/6">Room Type</th>
                                    <th className="p-4 font-extrabold w-1/5">Check In → Check Out</th>
                                    <th className="p-4 font-extrabold w-1/6">Status</th>
                                    <th className="p-4 font-extrabold text-center w-1/4">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Loading State */}
                                {isLoading && (
                                    <tr>
                                        <td className="p-6 text-center text-indigo-600 font-semibold" colSpan={5}>
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></span>
                                                Fetching Bookings...
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Data Rows */}
                                {!isLoading && bookings.map((b) => (
                                    <tr key={b.booking_id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                        
                                        {/* Customer Name */}
                                        <td className="p-4 text-slate-800 font-semibold">
                                            {b.first_name} {b.last_name}
                                        </td>
                                        
                                        {/* Room Type */}
                                        <td className="p-4 text-slate-600 text-sm">
                                            {b.type_name}
                                            <span className="block text-xs text-slate-400">({b.room_number})</span>
                                        </td>
                                        
                                        {/* Dates */}
                                        <td className="p-4 text-slate-600 font-medium text-sm">
                                            <span className="text-indigo-600 font-bold">{b.check_in_formatted}</span> 
                                            <span className="text-slate-400 mx-1">→</span>
                                            <span className="text-indigo-600 font-bold">{b.check_out_formatted}</span>
                                        </td>

                                        {/* Status */}
                                        <td className="p-4">
                                            {/* Logic: If tab is 'past', show 'past' status, otherwise show the database status */}
                                            {tab === 'past' ? <StatusBadge status="past" /> : <StatusBadge status={b.booking_status} />}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 space-x-3 text-center">
                                            <Link
                                                href={`/admin/bookings/${b.booking_id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors text-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                Details
                                            </Link>

                                            {/* CANCEL BUTTON LOGIC: Show ONLY if the booking is currently 'active' (in the active tab) AND has not been cancelled AND is NOT a past booking. */}
                                            {tab === "active" && b.booking_status !== "cancelled" && !b.is_past && (
                                                <button
                                                    onClick={() => cancelBooking(b.booking_id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm"
                                                    disabled={!!confirmAction || isLoading}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {/* No Data State */}
                                {!isLoading && bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-gray-500">
                                            <div className="p-8 bg-slate-50 rounded-xl max-w-lg mx-auto">
                                                <p className="text-lg font-semibold">No {tab} bookings found.</p>
                                                {search && <p className="text-sm mt-1">Try clearing the search query.</p>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
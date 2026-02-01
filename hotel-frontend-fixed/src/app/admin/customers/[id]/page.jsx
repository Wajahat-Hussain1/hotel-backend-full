"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";

// Dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ===============================
  // LOAD CUSTOMER DETAILS
  // ===============================
  useEffect(() => {
    const loadDetails = async () => {
      if (!token) return;
      try {
        // Updated to use the production Render API
        const res = await fetch(`${API_URL}/api/customers/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch");

        setCustomer(json.data.customer);
        setBookings(json.data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id, token]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Profile</h1>
            <p className="text-slate-500 text-sm">Reviewing history for Customer #{id}</p>
          </div>

          <button
            onClick={() => router.push("/admin/customers")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
             <p className="text-slate-500 font-medium">Fetching customer records...</p>
          </div>
        ) : !customer ? (
          <div className="p-10 bg-white rounded-3xl text-center shadow-sm">
             <p className="text-rose-500 font-bold">Customer record not found.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Customer Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100">
                  {customer.first_name?.[0]}{customer.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{customer.first_name} {customer.last_name}</h2>
                  <p className="text-indigo-600 font-semibold text-sm">{customer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration Date</p>
                  <p className="text-slate-900 font-bold">{formatDate(customer.created_at)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account ID</p>
                  <p className="text-slate-900 font-bold">#{customer.customer_id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                  <p className="text-slate-900 font-bold">{bookings.length}</p>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Reservation History</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Room</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Check In</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Check Out</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="p-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 text-sm font-medium">
                          This customer has no recorded bookings.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.booking_id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-700">#{b.booking_id}</td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900">{b.room_number}</span>
                            <div className="text-[10px] text-slate-500 font-medium">{b.type_name}</div>
                          </td>
                          <td className="p-4 text-sm text-slate-600 font-medium">{formatDate(b.check_in)}</td>
                          <td className="p-4 text-sm text-slate-600 font-medium">{formatDate(b.check_out)}</td>
                          <td className="p-4 font-black text-indigo-600 text-sm">PKR {Number(b.total_price).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                              b.booking_status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                              b.booking_status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {b.booking_status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => router.push(`/admin/invoice/${b.booking_id}`)}
                              className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
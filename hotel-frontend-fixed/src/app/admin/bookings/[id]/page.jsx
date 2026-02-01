"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";

// Get backend URL from environment or fallback to Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper for consistent date formatting
  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("hotel_token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!id) return;

    const loadData = async () => {
      try {
        // Fetch both booking and service orders in parallel using the production URL
        const [bRes, sRes] = await Promise.all([
          fetch(`${API_URL}/api/bookings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/service-orders/booking/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const bJson = await bRes.json();
        const sJson = await sRes.json();

        if (!bRes.ok) throw new Error(bJson.message || "Failed to load booking");
        
        setBooking(bJson.data);
        if (sRes.ok) setServices(sJson.data || []);
        
      } catch (err) {
        console.error("Admin Load Error:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  if (loading) return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar />
        <p className="p-10 text-center text-gray-500 italic">Loading booking details...</p>
      </div>
    </div>
  );

  if (!booking) return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1">
        <AdminNavbar />
        <p className="p-10 text-center text-red-500 font-bold">Booking not found.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <main className="p-8 max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                Booking Reference: #{booking.booking_id}
              </h1>
              <p className="text-gray-500">View and manage full booking details</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium"
            >
              ← Back to List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* BOOKING STATUS & DATES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">Reservation Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="font-bold uppercase text-gray-800">{booking.booking_status}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Check-in:</span>
                  <span className="font-bold text-gray-800">{fmtDate(booking.check_in)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out:</span>
                  <span className="font-bold text-gray-800">{fmtDate(booking.check_out)}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase">Total Revenue</p>
                <p className="text-2xl font-black text-gray-900">
                  PKR {Number(booking.total_price).toLocaleString()}
                </p>
              </div>
            </div>

            {/* CUSTOMER & ROOM */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">Guest Details</h2>
                <p className="text-lg font-bold text-gray-800">{booking.first_name} {booking.last_name}</p>
                <p className="text-gray-500">{booking.email}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-3">Room Assigned</h2>
                <p className="text-lg font-bold text-gray-800">
                  Room #{booking.room_number}
                </p>
                <p className="text-gray-500">{booking.type_name} Category</p>
              </div>
            </div>
          </div>

          {/* SERVICES TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Service Order History</h2>
            </div>

            {services.length === 0 ? (
              <div className="p-10 text-center text-gray-400 italic">
                No additional services recorded for this guest.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black">
                  <tr>
                    <th className="p-4">Service Description</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Unit Price</th>
                    <th className="p-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((s) => (
                    <tr key={s.order_id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-700">{s.service_name}</td>
                      <td className="p-4 text-center text-gray-600">{s.quantity}</td>
                      <td className="p-4 text-right text-gray-600">
                        PKR {Number(s.price).toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-black text-gray-900">
                        PKR {(s.quantity * s.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
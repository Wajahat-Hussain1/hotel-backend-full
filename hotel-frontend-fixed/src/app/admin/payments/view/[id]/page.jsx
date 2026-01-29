"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";

// ===================================
// HELPER FUNCTION FOR DATE/TIME FORMATTING
// ===================================
const formatDateTime = (d) => {
  if (!d) return { date: "N/A", time: "N/A" };
  
  const dateObj = new Date(d);
  
  if (isNaN(dateObj)) return { date: "Invalid Date", time: "Invalid Time" };

  const date = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("payment"); // payment | booking | customer | room
  const [error, setError] = useState(null); // Custom state for errors

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  // Function to format status text into a colored badge
  const getStatusBadge = (status, type) => {
    const s = status ? String(status).toLowerCase() : 'unknown';
    let colorClass = 'bg-gray-100 text-gray-700';

    if (type === 'payment') {
      if (s === 'paid') colorClass = 'bg-green-100 text-green-700';
      else if (s === 'refunded') colorClass = 'bg-yellow-100 text-yellow-700';
      else if (s === 'failed') colorClass = 'bg-red-100 text-red-700';
    } else if (type === 'booking' || type === 'room') {
      if (s === 'confirmed' || s === 'available') colorClass = 'bg-blue-100 text-blue-700';
      else if (s === 'checked_in' || s === 'occupied') colorClass = 'bg-indigo-100 text-indigo-700';
      else if (s === 'cancelled' || s === 'out_of_service') colorClass = 'bg-red-100 text-red-700';
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
        {status || 'N/A'}
      </span>
    );
  };


  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/view/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setError(json.message || "Failed to load details");
          return router.push("/admin/payments");
        }

        setData(json.data);
      } catch (err) {
        console.error(err);
        setError("Error connecting to server.");
      }
      setLoading(false);
    };

    load();
  }, [id, router, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-gray-500 animate-pulse text-xl font-medium">Loading full payment structure...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="p-10 text-red-600 font-semibold text-xl">Error: {error}</p>
      </div>
    );
  }

  const { payment, booking, customer, room } = data;
  
  // Format dates for display
  const checkIn = formatDateTime(booking.check_in);
  const checkOut = formatDateTime(booking.check_out);
  const customerCreated = formatDateTime(customer.created_at);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar active="payments" />

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
                Payment Record <span className="text-purple-600">#{id}</span>
            </h1>
            
            {/* ⬇ Back Button (Replaced Edit/Delete) */}
            <button
                onClick={() => router.push(`/admin/payments`)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Payments</span>
            </button>
            {/* ⬆ Back Button */}
        </div>

        {/* ⬇ Tabs Navigation */}
        <div className="flex gap-1 bg-white p-2 rounded-xl shadow-md mb-8 max-w-4xl mx-auto">
          {["Payment", "Booking", "Customer", "Room"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t.toLowerCase())}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition duration-200 
                ${tab === t.toLowerCase()
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t} Details
            </button>
          ))}
        </div>

        {/* ⬇ Tab Content Container */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-700">
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Information
            </h2>

            {/* =============== PAYMENT TAB =============== */}
            {tab === "payment" && (
                <div className="space-y-4">
                    <DetailRow label="Payment ID" value={payment.payment_id} />
                    <DetailRow label="Booking ID" value={payment.booking_id} />
                    <DetailRow label="Amount" value={<span className="font-extrabold text-lg text-green-700">PKR {payment.amount}</span>} />
                    <DetailRow label="Method" value={payment.payment_method} />
                    <DetailRow label="Status" value={getStatusBadge(payment.payment_status, 'payment')} isStatus={true} />
                    {/* Removed Cancel Until row */}
                </div>
            )}

            {/* =============== BOOKING TAB =============== */}
            {tab === "booking" && (
                <div className="space-y-4">
                    <DetailRow label="Booking ID" value={booking.booking_id} />
                    <DetailRow label="Check-in Date" value={checkIn.date} />
                    <DetailRow label="Check-in Time" value={checkIn.time} />
                    <DetailRow label="Check-out Date" value={checkOut.date} />
                    <DetailRow label="Check-out Time" value={checkOut.time} />
                    <DetailRow label="Total Price" value={`PKR ${booking.total_price}`} />
                    <DetailRow label="Status" value={getStatusBadge(booking.booking_status, 'booking')} isStatus={true} />
                    <DetailRow label="Room ID" value={booking.room_id} />
                </div>
            )}

            {/* =============== CUSTOMER TAB =============== */}
            {tab === "customer" && (
                <div className="space-y-4">
                    <DetailRow label="Customer ID" value={customer.customer_id} />
                    <DetailRow
                        label="Full Name"
                        value={`${customer.first_name} ${customer.last_name}`}
                    />
                    <DetailRow label="Email" value={customer.email} />
                    <DetailRow label="Account Created Date" value={customerCreated.date} />
                    <DetailRow label="Account Created Time" value={customerCreated.time} />
                    <DetailRow label="Status" value={customer.status} />
                </div>
            )}

            {/* =============== ROOM TAB =============== */}
            {tab === "room" && (
                <div className="space-y-4">
                    <DetailRow label="Room ID" value={room.room_id} />
                    <DetailRow label="Room Number" value={<span className="font-extrabold text-xl text-purple-700">{room.room_number}</span>} />
                    <DetailRow label="Room Status" value={getStatusBadge(room.room_status, 'room')} isStatus={true} />
                    <DetailRow label="Type" value={room.type_name} />
                    <DetailRow label="Base Price" value={`PKR ${room.base_price}`} />
                    <DetailRow label="Capacity" value={`${room.capacity} Guests`} />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

// Reusable row component with enhanced styling
function DetailRow({ label, value, isStatus = false }) {
  return (
    <div className={`flex justify-between items-center py-3 ${isStatus ? '' : 'border-b border-gray-100'}`}>
      <span className="font-semibold text-gray-500">{label}</span>
      <span className="text-gray-800">{value || "N/A"}</span>
    </div>
  );
}
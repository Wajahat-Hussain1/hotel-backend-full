"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ---------------- HELPERS ---------------- */

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date) ? "—" : date.toLocaleString("en-GB", {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

// ❗ DELETE WINDOW ONLY (10 minutes from when the service was ordered)
const canDeleteService = (ordered_at, minutes = 10) => {
  if (!ordered_at) return false;
  const ordered = new Date(ordered_at);
  if (isNaN(ordered)) return false;

  const diffMin = (Date.now() - ordered.getTime()) / (1000 * 60);
  return diffMin <= minutes;
};

/* ---------------- MAIN ---------------- */

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("hotel_token")}`,
    "Content-Type": "application/json",
  });

  /* -------- LOAD ORDERS -------- */

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-orders/booking/${id}`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      setOrders(json.data || []);
    } catch (err) {
      console.error("Order load error", err);
    }
  };

  /* -------- LOAD ALL DATA -------- */

  useEffect(() => {
    const token = localStorage.getItem("hotel_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [b, s] = await Promise.all([
          fetch(`${API_URL}/api/bookings/customer/${id}`, { headers: getHeaders() }),
          fetch(`${API_URL}/api/services`),
        ]);

        const bJson = await b.json();
        const sJson = await s.json();

        setBooking(bJson.data);
        setServices(sJson.data || []);
        await loadOrders();
      } catch (err) {
        console.error("Data load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  /* -------- ADD SERVICE -------- */

  const addService = async () => {
    if (!serviceId || qty < 1) {
      alert("Please select a service and quantity.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/service-orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          booking_id: booking.booking_id,
          service_id: serviceId,
          quantity: qty,
        }),
      });

      if (res.ok) {
        setServiceId("");
        setQty(1);
        await loadOrders();
      } else {
        const json = await res.json();
        alert(json.message || "Failed to add service");
      }
    } catch {
      alert("System error adding service");
    }
  };

  /* -------- DELETE SERVICE -------- */

  const deleteService = async (orderId) => {
    if (!confirm("Are you sure you want to remove this service?")) return;

    try {
      const res = await fetch(`${API_URL}/api/service-orders/${orderId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (res.ok) {
        await loadOrders();
      } else {
        alert("Removal window may have expired (10 mins).");
      }
    } catch {
      alert("Delete error");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex justify-center mt-40 italic text-slate-500">Loading details...</div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="text-center mt-40 font-bold text-red-500">Booking records not found.</div>
    </div>
  );

  const isPaid = booking.booking_status === "paid";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />

      {/* HEADER */}
      <div className="bg-slate-900 text-white py-14 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={() => router.back()} className="text-indigo-400 text-sm font-bold mb-4 flex items-center gap-1 hover:text-indigo-300">
            ← Back to List
          </button>
          <h1 className="text-3xl font-black">Room #{booking.room_number} <span className="text-slate-500 font-normal">|</span> {booking.type_name}</h1>
          <p className="text-slate-400 mt-1 font-medium tracking-wide">ID: BKN-{booking.booking_id}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 space-y-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase mb-2">Check In</p>
            <p className="text-slate-800 font-bold">{fmtDate(booking.check_in)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase mb-2">Check Out</p>
            <p className="text-slate-800 font-bold">{fmtDate(booking.check_out)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-black text-slate-400 uppercase mb-2">Total Amount</p>
            <p className="text-indigo-600 text-xl font-black">PKR {Number(booking.total_price).toLocaleString()}</p>
          </div>
        </div>

        {/* SERVICE ORDERS */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800">Additional Services</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${isPaid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
              Booking: {booking.booking_status}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-medium">
              No extra services ordered yet.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.order_id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{o.service_name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Quantity: {o.quantity}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="font-black text-slate-900">PKR {Number(o.total_price).toLocaleString()}</p>
                    {canDeleteService(o.ordered_at) && (
                      <button
                        onClick={() => deleteService(o.order_id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Remove service"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD SERVICE FORM (PAID ONLY) */}
        {isPaid && (
          <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
            <h2 className="text-lg font-black text-indigo-900 mb-4">Request a New Service</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="bg-white border-none shadow-sm p-4 rounded-xl flex-1 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">Select Service...</option>
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>
                    {s.service_name} — PKR {s.price}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="bg-white border-none shadow-sm p-4 rounded-xl w-full md:w-24 text-center font-bold focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={addService}
                className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                Order Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
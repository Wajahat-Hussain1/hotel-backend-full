"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

const formatDateTime = (d) => {
  if (!d) return { date: "N/A", time: "N/A" };
  const dateObj = new Date(d);
  if (isNaN(dateObj)) return { date: "Invalid Date", time: "Invalid Time" };

  const date = dateObj.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
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
  const [tab, setTab] = useState("payment");
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const getStatusBadge = (status, type) => {
    const s = status ? String(status).toLowerCase() : 'unknown';
    let colorClass = 'bg-slate-100 text-slate-700';

    if (type === 'payment') {
      if (s === 'paid') colorClass = 'bg-emerald-100 text-emerald-700';
      else if (s === 'refunded') colorClass = 'bg-amber-100 text-amber-700';
      else if (s === 'failed') colorClass = 'bg-rose-100 text-rose-700';
    } else {
      if (['confirmed', 'available', 'active'].includes(s)) colorClass = 'bg-blue-100 text-blue-700';
      else if (['checked_in', 'occupied'].includes(s)) colorClass = 'bg-indigo-100 text-indigo-700';
      else if (['cancelled', 'out_of_service'].includes(s)) colorClass = 'bg-rose-100 text-rose-700';
    }

    return (
      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${colorClass}`}>
        {status || 'N/A'}
      </span>
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments/view/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (!res.ok) {
          toast.error(json.message || "Failed to load details");
          return router.push("/admin/payments");
        }
        setData(json.data);
      } catch (err) {
        console.error(err);
        setError("Network connection failed.");
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [id, router, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling Record...</p>
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  const { payment, booking, customer, room } = data;
  const checkIn = formatDateTime(booking.check_in);
  const checkOut = formatDateTime(booking.check_out);
  const customerCreated = formatDateTime(customer.created_at);

  const tabsConfig = [
    { id: "payment", label: "Financials", icon: "💰" },
    { id: "booking", label: "Reservation", icon: "📅" },
    { id: "customer", label: "Guest Info", icon: "👤" },
    { id: "room", label: "Unit Stats", icon: "🔑" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar active="payments" />
      <Toaster position="top-right" />

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <button 
                onClick={() => router.push('/admin/payments')}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors mb-2 block"
              >
                ← Return to Ledger
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Audit Trail <span className="text-purple-600 font-mono text-3xl ml-2">#PAY-{id}</span>
              </h1>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => window.print()}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    title="Print Audit Log"
                >
                    🖨️
                </button>
                <div className="px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Record</span>
                </div>
            </div>
          </div>

          {/* Custom Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabsConfig.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 border-2 ${
                  tab === t.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105"
                    : "bg-white text-slate-500 border-transparent hover:border-slate-200"
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white overflow-hidden">
            <div className="p-10 md:p-14">
                <div className="flex justify-between items-end mb-10 border-b border-slate-50 pb-8">
                    <div>
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-1">Viewing Module</p>
                        <h2 className="text-3xl font-black text-slate-900 capitalize">{tab} Intelligence</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                        <p className="text-xs font-bold font-mono text-slate-600">ID: {id}-{tab.substring(0,3).toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* =============== PAYMENT TAB =============== */}
                    {tab === "payment" && (
                        <>
                            <DetailBox label="Transaction ID" value={`PAY-${payment.payment_id}`} />
                            <DetailBox label="Source Booking" value={`#${payment.booking_id}`} isLink />
                            <DetailBox 
                                label="Total Amount" 
                                value={`Rs. ${Number(payment.amount).toLocaleString()}`} 
                                highlight="text-emerald-600" 
                            />
                            <DetailBox label="Methodology" value={payment.payment_method} isCaps />
                            <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase">Verification Status</span>
                                {getStatusBadge(payment.payment_status, 'payment')}
                            </div>
                        </>
                    )}

                    {/* =============== BOOKING TAB =============== */}
                    {tab === "booking" && (
                        <>
                            <DetailBox label="System ID" value={booking.booking_id} />
                            <DetailBox label="Current Status" value={getStatusBadge(booking.booking_status, 'booking')} isRaw />
                            <DetailBox label="Arrival Date" value={checkIn.date} />
                            <DetailBox label="Arrival Time" value={checkIn.time} />
                            <DetailBox label="Departure Date" value={checkOut.date} />
                            <DetailBox label="Departure Time" value={checkOut.time} />
                            <DetailBox 
                                label="Contract Value" 
                                value={`Rs. ${Number(booking.total_price).toLocaleString()}`} 
                                highlight="text-indigo-600"
                            />
                        </>
                    )}

                    {/* =============== CUSTOMER TAB =============== */}
                    {tab === "customer" && (
                        <>
                            <DetailBox label="Profile ID" value={customer.customer_id} />
                            <DetailBox label="Guest Name" value={`${customer.first_name} ${customer.last_name}`} isCaps />
                            <DetailBox label="Email Address" value={customer.email} highlight="text-slate-900" />
                            <DetailBox label="Account Created" value={customerCreated.date} />
                            <DetailBox label="Registration Time" value={customerCreated.time} />
                            <DetailBox label="Privacy Status" value={customer.status} isCaps />
                        </>
                    )}

                    {/* =============== ROOM TAB =============== */}
                    {tab === "room" && (
                        <>
                            <DetailBox label="Physical Room" value={room.room_number} highlight="text-purple-600 text-2xl" />
                            <DetailBox label="Operational Status" value={getStatusBadge(room.room_status, 'room')} isRaw />
                            <DetailBox label="Category" value={room.type_name} isCaps />
                            <DetailBox label="Nightly Rate" value={`Rs. ${Number(room.base_price).toLocaleString()}`} />
                            <DetailBox label="Standard Capacity" value={`${room.capacity} Persons`} />
                        </>
                    )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailBox({ label, value, highlight = "text-slate-700", isCaps = false, isRaw = false, isLink = false }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-purple-500">
        {label}
      </label>
      <div className={`font-bold transition-all ${highlight} ${isCaps ? 'uppercase tracking-tighter' : ''}`}>
        {isRaw ? value : (
            <span className={isLink ? "underline decoration-slate-200 underline-offset-4 hover:decoration-purple-500 cursor-pointer" : ""}>
                {value || "—"}
            </span>
        )}
      </div>
    </div>
  );
}
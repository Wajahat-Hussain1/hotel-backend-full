"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function InvoicePage() {
  const { booking_id } = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  // ---------------- HELPERS ----------------
  const fmtDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fmtCurrency = (n) =>
    Number(n || 0).toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    });

  const balanceAmount = (total, paid) => Number(total) - Number(paid || 0);

  // ---------------- LOAD INVOICE ----------------
  useEffect(() => {
    const loadInvoice = async () => {
      if (!booking_id || !token) return;

      try {
        const res = await fetch(`${API_URL}/api/bookings/${booking_id}/invoice`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Fetch failed");

        setInvoice(json.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [booking_id, token]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <div className="print:hidden">
        <AdminSidebar />
      </div>

      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 print:hidden">
            <button
            onClick={() => router.back()}
            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm"
            >
            ← Back to Booking
            </button>
            <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Invoice
            </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-medium">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
             Generating Invoice...
          </div>
        ) : !invoice ? (
          <p className="text-center text-red-500 py-20 bg-white rounded-3xl border border-dashed border-red-200">Record not found or access denied.</p>
        ) : (
          <div
            id="invoice-print-area"
            className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-slate-100 relative overflow-hidden"
          >
            {/* Status Watermark */}
            {balanceAmount(invoice.grand_total, invoice.paid_amount) <= 0 && (
                <div className="absolute top-10 right-10 border-4 border-emerald-500/20 text-emerald-500/40 font-black text-5xl p-4 rounded-2xl rotate-12 pointer-events-none uppercase">
                    Paid In Full
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 pb-10 border-b border-slate-50">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic">V</div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">VELVET DOOR</span>
                </div>
                <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Official Receipt</h1>
                <p className="text-slate-600 text-sm mt-1">Invoice Issued: {fmtDate(new Date())}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">#{invoice.booking_id}</p>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${invoice.booking_status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    Status: {invoice.booking_status}
                </span>
              </div>
            </div>

            {/* ADDRESS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div className="bg-slate-50 p-6 rounded-2xl">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Billed To</p>
                <p className="font-black text-slate-900 text-lg uppercase">{invoice.customer_name}</p>
                <p className="text-slate-500 font-medium">{invoice.email}</p>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Stay Details</p>
                <p className="text-slate-900 font-bold mb-1">
                  Room {invoice.room_number} <span className="text-slate-400 font-medium">({invoice.type_name})</span>
                </p>
                <div className="flex gap-4 text-xs font-bold text-slate-500 mt-2">
                    <div>IN: {fmtDate(invoice.check_in)}</div>
                    <div className="text-slate-300">|</div>
                    <div>OUT: {fmtDate(invoice.check_out)}</div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mb-8">
                <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-slate-900">
                    <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest">Description</th>
                    <th className="py-4 px-4 text-xs font-black text-slate-900 uppercase tracking-widest text-center">Qty</th>
                    <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr className="group">
                    <td className="py-6">
                        <p className="font-bold text-slate-900">Room Accommodation</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Nights & Taxes Included</p>
                    </td>
                    <td className="py-6 px-4 text-center font-bold text-slate-600">—</td>
                    <td className="py-6 text-right font-bold text-slate-600">—</td>
                    <td className="py-6 text-right font-black text-slate-900">{fmtCurrency(invoice.room_total)}</td>
                    </tr>

                    {invoice.services.map((s) => (
                    <tr key={s.service_order_id}>
                        <td className="py-5 font-bold text-slate-700">{s.service_name}</td>
                        <td className="py-5 px-4 text-center font-bold text-slate-600">{s.quantity}</td>
                        <td className="py-5 text-right font-bold text-slate-600">{fmtCurrency(s.price)}</td>
                        <td className="py-5 text-right font-black text-slate-900">{fmtCurrency(s.total)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* TOTALS */}
            <div className="flex flex-col md:flex-row justify-between gap-8 pt-8 border-t-2 border-slate-50">
              <div className="md:w-1/3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    This is a computer-generated invoice. Payments are non-refundable after 24 hours of check-in. Thank you for choosing Velvet Door.
                 </p>
              </div>
              <div className="md:w-1/2 bg-slate-50 p-8 rounded-3xl space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Room Total</span>
                  <span>{fmtCurrency(invoice.room_total)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Services Subtotal</span>
                  <span>{fmtCurrency(invoice.services_total)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span>{fmtCurrency(invoice.grand_total)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-600">
                  <span>Payment Received</span>
                  <span>- {fmtCurrency(invoice.paid_amount)}</span>
                </div>
                <div
                    className={`flex justify-between pt-4 text-xl font-black ${
                    balanceAmount(invoice.grand_total, invoice.paid_amount) > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                >
                    <span className="uppercase tracking-tighter">Amount Due</span>
                    <span>{fmtCurrency(balanceAmount(invoice.grand_total, invoice.paid_amount))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @media print {
          @page { margin: 0; }
          body { background: white !important; padding: 0 !important; }
          nav, aside, button, footer { display: none !important; }
          #invoice-print-area {
            display: block !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 2cm !important;
          }
        }
      `}</style>
    </div>
  );
}
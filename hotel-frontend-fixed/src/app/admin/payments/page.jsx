"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load");

        setPayments(json.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Security clearance failed or server offline.");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadPayments();
  }, [token]);

  const filtered = payments.filter((p) => {
    const matchSearch = `${p.payment_id} ${p.payment_method} ${p.amount}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchTab = tab === "all" ? true : p.payment_status === tab;
    return matchSearch && matchTab;
  });

  const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase();
    const base = "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ";
    
    if (s === "paid") return <span className={`${base} bg-emerald-50 text-emerald-600 border-emerald-100`}>Paid</span>;
    if (s === "refunded") return <span className={`${base} bg-amber-50 text-amber-600 border-amber-100`}>Refunded</span>;
    if (s === "failed") return <span className={`${base} bg-rose-50 text-rose-600 border-rose-100`}>Failed</span>;
    
    return <span className={`${base} bg-slate-50 text-slate-500 border-slate-100`}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AdminSidebar active="payments" />
      <Toaster position="top-right" />

      <main className="flex-1 p-6 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Financial Ledger</h1>
            <p className="text-slate-500 font-medium text-sm">Monitor and audit all incoming transactions.</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            {["all", "paid", "refunded", "failed"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  tab === t ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-8 max-w-md group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          <input
            type="text"
            placeholder="Search by ID, method or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-purple-500 focus:ring-0 transition-all outline-none font-medium shadow-sm"
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Fetching Records...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <p className="text-slate-400 font-bold italic">No matching transactions found in the vault.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.payment_id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="p-6 font-mono font-bold text-slate-400 group-hover:text-purple-600 transition-colors text-xs">
                      #PAY-{p.payment_id}
                    </td>
                    <td className="p-6 font-bold text-slate-600 text-sm">BOK-{p.booking_id}</td>
                    <td className="p-6 font-black text-slate-900 text-sm">Rs. {Number(p.amount).toLocaleString()}</td>
                    <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            {p.payment_method}
                        </span>
                    </td>
                    <td className="p-6">
                      <StatusBadge status={p.payment_status} />
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/admin/payments/view/${p.payment_id}`}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="View Details"
                        >
                          👁️
                        </Link>
                        <Link
                          href={`/admin/payments/${p.payment_id}/edit`}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                          title="Modify Record"
                        >
                          ✏️
                        </Link>
                        <Link
                          href={`/admin/payments/delete/${p.payment_id}`}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove Entry"
                        >
                          🗑️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

// Dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
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
  // LOAD CUSTOMERS
  // ===============================
  useEffect(() => {
    const loadCustomers = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (res.ok) setCustomers(json.data || []);
      } catch (err) {
        console.error("Customer load error:", err);
        toast.error("Failed to sync customer database.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [token]);

  // ===============================
  // DELETE CUSTOMER
  // ===============================
  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure? This will permanently erase this customer and their history.")) return;

    const delToast = toast.loading("Erasing record...");
    try {
      const res = await fetch(`${API_URL}/api/customers/${id}/permanent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setCustomers((prev) => prev.filter((c) => c.customer_id !== id));
      toast.success("Customer removed successfully", { id: delToast });
    } catch (err) {
      toast.error("Could not delete customer.", { id: delToast });
    }
  };

  // ===============================
  // SEARCH FILTER
  // ===============================
  const filteredCustomers = customers.filter((c) =>
    `${c.customer_id} ${c.first_name} ${c.last_name} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <Toaster position="top-right" />

      <main className="flex-1 p-8 lg:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Guest Directory</h1>
            <p className="text-slate-500 font-medium">Manage and review your registered customers</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm font-medium"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="p-8"><div className="h-8 bg-slate-100 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-slate-400 font-bold italic">No guests found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {c.first_name?.[0]}{c.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {c.first_name} {c.last_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            ID: #{c.customer_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-sm font-semibold text-slate-600">{c.email}</td>
                    
                    <td className="p-5 text-sm font-medium text-slate-500">
                      {formatDate(c.created_at)}
                    </td>

                    <td className="p-5 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/customers/${c.customer_id}`)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        title="View Profile"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>

                      <button
                        onClick={() => router.push(`/admin/customers/edit/${c.customer_id}`)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Edit Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>

                      <button
                        onClick={() => deleteCustomer(c.customer_id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/AdminSidebar";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | paid | refunded | pending

  const token =
    typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) return alert(json.message);

        setPayments(json.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load payments");
      }
      setLoading(false);
    };

    loadPayments();
  }, []);

  // 🔍 FILTER (search + tab)
  const filtered = payments.filter((p) => {
    const matchSearch = `${p.payment_id} ${p.payment_method} ${p.amount} ${p.total_price}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchTab =
      tab === "all" ? true : p.payment_status === tab;

    return matchSearch && matchTab;
  });

  const StatusBadge = ({ status }) => {
    if (status === "paid")
      return (
        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
          Paid
        </span>
      );

    if (status === "refunded")
      return (
        <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
          Refunded
        </span>
      );

    return (
      <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active="payments" />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b">
          {["all", "paid", "refunded", "pending"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 px-2 capitalize ${
                tab === t
                  ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full md:w-80 px-4 py-2 border rounded-lg shadow-sm"
        />

        {/* TABLE */}
        <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.payment_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">{p.payment_id}</td>
                    <td className="p-4">{p.booking_id}</td>
                    <td className="p-4 font-semibold">PKR {p.amount}</td>
                    <td className="p-4 capitalize">{p.payment_method}</td>
                    <td className="p-4">
                      <StatusBadge status={p.payment_status} />
                    </td>

                    <td className="p-4 space-x-2">
                      <Link
                        href={`/admin/payments/view/${p.payment_id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/payments/${p.payment_id}/edit`}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/admin/payments/delete/${p.payment_id}`}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </Link>
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

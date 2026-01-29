"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";

export default function InvoicePage() {
  const { booking_id } = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

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

  const balance = (total, paid) => Number(total) - Number(paid || 0);

  // ---------------- LOAD INVOICE ----------------
  useEffect(() => {
    const loadInvoice = async () => {
      if (!booking_id || !token) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/${booking_id}/invoice`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (!res.ok) return alert(json.message);

        setInvoice(json.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [booking_id, token]);

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="print:hidden">
        <AdminSidebar />
      </div>

      <main className="flex-1 p-6 lg:p-10">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-700 text-white rounded print:hidden"
        >
          ← Back
        </button>

        {loading ? (
          <p className="text-center">Loading invoice...</p>
        ) : !invoice ? (
          <p className="text-center text-red-500">Invoice not found</p>
        ) : (
          <div
            id="invoice-print-area"
            className="bg-white max-w-4xl mx-auto shadow-xl rounded-lg p-8"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold">Invoice</h1>
                <p className="text-sm text-gray-500">
                  Date: {fmtDate(new Date())}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">INVOICE #{invoice.booking_id}</p>
                <p className="text-sm">{invoice.booking_status}</p>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="grid grid-cols-2 gap-6 text-sm mb-8">
              <div>
                <p className="font-semibold">Customer</p>
                <p>{invoice.customer_name}</p>
                <p>{invoice.email}</p>
              </div>
              <div className="text-right">
                <p>
                  Room: {invoice.room_number} ({invoice.type_name})
                </p>
                <p>Check-in: {fmtDate(invoice.check_in)}</p>
                <p>Check-out: {fmtDate(invoice.check_out)}</p>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table className="w-full text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* ROOM */}
                <tr className="border-b">
                  <td className="p-2 font-medium">
                    Room Charges ({invoice.type_name})
                  </td>
                  <td className="p-2 text-center">—</td>
                  <td className="p-2 text-right">—</td>
                  <td className="p-2 text-right">
                    {fmtCurrency(invoice.room_total)}
                  </td>
                </tr>

                {/* SERVICES */}
                {invoice.services.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-400">
                      No services added
                    </td>
                  </tr>
                ) : (
                  invoice.services.map((s) => (
                    <tr key={s.service_order_id} className="border-b">
                      <td className="p-2">{s.service_name}</td>
                      <td className="p-2 text-center">{s.quantity}</td>
                      <td className="p-2 text-right">
                        {fmtCurrency(s.price)}
                      </td>
                      <td className="p-2 text-right">
                        {fmtCurrency(s.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="mt-6 text-sm w-1/2 ml-auto">
              <div className="flex justify-between py-1">
                <span>Room Total</span>
                <span>{fmtCurrency(invoice.room_total)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Services Total</span>
                <span>{fmtCurrency(invoice.services_total)}</span>
              </div>
              <div className="flex justify-between py-1 font-bold border-t mt-2">
                <span>Grand Total</span>
                <span>{fmtCurrency(invoice.grand_total)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Paid</span>
                <span>{fmtCurrency(invoice.paid_amount)}</span>
              </div>
              <div
                className={`flex justify-between py-2 font-extrabold text-lg ${
                  balance(invoice.grand_total, invoice.paid_amount) > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                <span>Balance</span>
                <span>
                  {fmtCurrency(
                    balance(invoice.grand_total, invoice.paid_amount)
                  )}
                </span>
              </div>
            </div>

            {/* PRINT */}
            <div className="mt-8 text-center print:hidden">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-black text-white rounded"
              >
                Print Invoice
              </button>
            </div>
          </div>
        )}
      </main>

      {/* PRINT FIX */}
      <style jsx global>{`
        @media print {
          body > * {
            display: none !important;
          }
          #invoice-print-area {
            display: block !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

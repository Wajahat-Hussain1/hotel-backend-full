"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import QRCode from "qrcode";

// ✅ Point to Render Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ================= UTILITIES ================= */

function fmtDateIso(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtCurrency(num) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(Number(num || 0));
}

/* ================= COMPONENT ================= */

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= LOAD INVOICE ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("hotel_token");
        if (!token) return router.push("/login");

        // ✅ UPDATED: Fetch from Render API
        const res = await fetch(`${API_URL}/api/invoice/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Invoice not found");

        const json = await res.json();
        const invoiceData = json.data || json; // Handle different API response structures
        setData(invoiceData);

        const qr = await QRCode.toDataURL(
          JSON.stringify({
            booking_id: id,
            total: invoiceData.grand_total,
            status: invoiceData.booking_status,
          })
        );
        setQrDataUrl(qr);
      } catch (err) {
        console.error(err);
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, router]);

  /* ================= ACTIONS ================= */

  const handlePrint = () => window.print();

  const downloadPdf = async () => {
    try {
      const token = localStorage.getItem("hotel_token");
      // ✅ UPDATED: Fetch PDF from Render API
      const res = await fetch(
        `${API_URL}/api/invoice/${id}/pdf`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${id}.pdf`;
      document.body.appendChild(a); // Recommended for Firefox compatibility
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up memory
    } catch {
      alert("PDF download failed");
    }
  };

  /* ================= STATES ================= */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading invoice...
      </div>
    );

  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "Invoice data is missing"}
      </div>
    );

  const roomNo = String(data.room_number || "").replace("#", "");
  const isPaid = data.booking_status === "paid";

  /* ================= UI ================= */

  return (
    <div className="bg-gray-100 min-h-screen pb-10 print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl rounded-xl overflow-hidden border-t-8 border-blue-700 print:shadow-none">

        {/* HEADER */}
        <div className="p-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              THE VELVET DOOR
            </h1>
            <p className="text-sm text-gray-500">
              Karachi, Pakistan
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-700 uppercase">Invoice</h2>
            <p className="font-semibold text-gray-600">ID: #{data.booking_id}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {data.booking_status}
            </span>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="px-8 grid grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-bold mb-1 text-gray-900">Billed To</h3>
            <p className="text-base font-medium">{data.first_name} {data.last_name}</p>
            <p>{data.email}</p>
          </div>

          <div className="text-right">
            <h3 className="font-bold mb-1 text-gray-900">Stay Details</h3>
            <p>Room: {data.type_name} ({roomNo})</p>
            <p>Check-in: {fmtDateIso(data.check_in)}</p>
            <p>Check-out: {fmtDateIso(data.check_out)}</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-8 py-8 bg-gray-50 mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 font-bold text-gray-700">
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* ROOM */}
              <tr>
                <td className="py-4">
                  <span className="font-medium">Hotel Accommodation</span>
                  <p className="text-xs text-gray-500">{data.type_name} Room</p>
                </td>
                <td className="py-4 text-right">
                  {fmtCurrency(data.room_total)}
                </td>
              </tr>

              {/* SERVICES */}
              {Array.isArray(data.services) && data.services.length > 0 && (
                <>
                  {data.services.map((s) => (
                    <tr key={s.order_id || Math.random()}>
                      <td className="py-3">
                        {s.service_name} <span className="text-gray-400">× {s.quantity}</span>
                      </td>
                      <td className="py-3 text-right">
                        {fmtCurrency(s.total)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td className="pt-6 text-right text-gray-500">
                  Services Total
                </td>
                <td className="pt-6 text-right font-semibold">
                  {fmtCurrency(data.services_total)}
                </td>
              </tr>

              <tr>
                <td className="pt-2 text-right font-bold text-lg text-gray-800">
                  Grand Total
                </td>
                <td className="pt-2 text-right text-2xl font-extrabold text-blue-700">
                  {fmtCurrency(data.grand_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-8 flex justify-between items-center border-t border-gray-100">
          {qrDataUrl && (
            <div className="text-center">
                <img
                    src={qrDataUrl}
                    alt="Booking QR"
                    className="w-20 h-20 border p-1 rounded bg-white"
                />
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Verify Booking</p>
            </div>
          )}

          <p className="text-xs text-gray-400 italic">
            Thank you for choosing The Velvet Door. This is a system generated invoice.
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-3 print:hidden px-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition font-medium"
        >
          Back
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Print
        </button>

        <button
          onClick={downloadPdf}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download PDF
        </button>
      </div>
    </div>
  );
}
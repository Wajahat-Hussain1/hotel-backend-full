"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import QRCode from "qrcode";

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

        const res = await fetch(`http://localhost:5000/api/invoice/${id}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Invoice not found");

        const json = await res.json();
        setData(json.data);

        const qr = await QRCode.toDataURL(
          JSON.stringify({
            booking_id: id,
            total: json.data.grand_total,
            status: json.data.booking_status,
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
      const res = await fetch(
        `http://localhost:5000/api/invoice/${id}/pdf`,
        { headers: { Authorization: "Bearer " + token } }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${id}.pdf`;
      a.click();
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

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
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
            <h2 className="text-2xl font-bold text-blue-700">INVOICE</h2>
            <p className="font-semibold">#{data.booking_id}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
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
            <h3 className="font-bold mb-1">Billed To</h3>
            <p>{data.first_name} {data.last_name}</p>
            <p>{data.email}</p>
          </div>

          <div className="text-right">
            <h3 className="font-bold mb-1">Stay Details</h3>
            <p>Room: {data.type_name} ({roomNo})</p>
            <p>Check-in: {fmtDateIso(data.check_in)}</p>
            <p>Check-out: {fmtDateIso(data.check_out)}</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="px-8 py-8 bg-gray-50 mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-bold text-gray-700">
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {/* ROOM */}
              <tr className="border-b">
                <td className="py-3">
                  Hotel Accommodation ({data.type_name})
                </td>
                <td className="py-3 text-right">
                  {fmtCurrency(data.room_total)}
                </td>
              </tr>

              {/* SERVICES */}
              {Array.isArray(data.services) && data.services.length > 0 && (
                <>
                  <tr>
                    <td colSpan="2" className="pt-4 font-bold">
                      Additional Services
                    </td>
                  </tr>

                  {data.services.map((s) => (
                    <tr key={s.order_id} className="border-b">
                      <td className="py-2">
                        {s.service_name} × {s.quantity}
                      </td>
                      <td className="py-2 text-right">
                        {fmtCurrency(s.total)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td className="pt-4 text-right font-semibold">
                  Services Total
                </td>
                <td className="pt-4 text-right font-semibold">
                  {fmtCurrency(data.services_total)}
                </td>
              </tr>

              <tr>
                <td className="pt-4 text-right font-bold text-lg">
                  Grand Total
                </td>
                <td className="pt-4 text-right text-2xl font-extrabold text-blue-700">
                  {fmtCurrency(data.grand_total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-8 flex justify-between items-center">
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR"
              className="w-20 h-20 border rounded"
            />
          )}

          <p className="text-sm text-gray-500">
            This is a system generated invoice
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-3 print:hidden">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Print
        </button>

        <button
          onClick={downloadPdf}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

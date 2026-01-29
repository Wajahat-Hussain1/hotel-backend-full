"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // -------------------------
  // LOAD BOOKING + SERVICES
  // -------------------------
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const [bRes, sRes] = await Promise.all([
          fetch(`http://localhost:5000/api/bookings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `http://localhost:5000/api/service-orders/booking/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const bJson = await bRes.json();
        const sJson = await sRes.json();

        if (!bRes.ok) throw new Error(bJson.message);
        if (sRes.ok) setServices(sJson.data || []);

        setBooking(bJson.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load booking details");
      }
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (!booking) return <p className="p-10 text-red-500">Booking not found</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <main className="p-8 max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Booking #{booking.booking_id}
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              ← Back
            </button>
          </div>

          {/* BOOKING INFO */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Booking Info</h2>
            <p><b>Status:</b> {booking.booking_status}</p>
            <p><b>Check-in:</b> {fmtDate(booking.check_in)}</p>
            <p><b>Check-out:</b> {fmtDate(booking.check_out)}</p>
            <p className="font-semibold mt-2">
              Total Price: PKR{" "}
              {Number(booking.total_price).toLocaleString()}
            </p>
          </div>

          {/* CUSTOMER INFO */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Customer</h2>
            <p>
              {booking.first_name} {booking.last_name}
            </p>
            <p>{booking.email}</p>
          </div>

          {/* ROOM INFO */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Room</h2>
            <p>
              Room #{booking.room_number} ({booking.type_name})
            </p>
          </div>

          {/* SERVICES */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Services Used</h2>

            {services.length === 0 ? (
              <p className="text-gray-500">
                No services added for this booking.
              </p>
            ) : (
              <table className="w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.order_id} className="border-t">
                      <td className="p-3">{s.service_name}</td>
                      <td className="p-3 text-center">{s.quantity}</td>
                      <td className="p-3 text-right">
                        PKR {Number(s.price).toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-semibold">
                        PKR{" "}
                        {(s.quantity * s.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

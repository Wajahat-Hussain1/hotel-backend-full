"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

/* ---------------- HELPERS ---------------- */

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date) ? "—" : date.toLocaleString("en-GB");
};

// ❗ DELETE WINDOW ONLY (10 minutes)
const canDeleteService = (created_at, minutes = 10) => {
  if (!created_at) return false;
  const created = new Date(created_at);
  if (isNaN(created)) return false;

  const diffMin = (Date.now() - created.getTime()) / (1000 * 60);
  return diffMin <= minutes;
};

/* ---------------- MAIN ---------------- */

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  /* -------- LOAD ORDERS -------- */

  const loadOrders = async () => {
    const res = await fetch(
      `http://localhost:5000/api/service-orders/booking/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const json = await res.json();
    setOrders(json.data || []);
  };

  /* -------- LOAD ALL DATA -------- */

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const [b, s] = await Promise.all([
          fetch(`http://localhost:5000/api/bookings/customer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/services"),
        ]);

        const bJson = await b.json();
        const sJson = await s.json();

        setBooking(bJson.data);
        setServices(sJson.data || []);
        await loadOrders();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token, router]);

  /* -------- ADD SERVICE (NO TIME LIMIT) -------- */

  const addService = async () => {
    if (!serviceId || qty < 1) {
      alert("Invalid service or quantity");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/service-orders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: booking.booking_id,
            service_id: serviceId,
            quantity: qty,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Failed to add service");
        return;
      }

      setServiceId("");
      setQty(1);
      await loadOrders();
    } catch {
      alert("Service add failed");
    }
  };

  /* -------- DELETE SERVICE (10 MIN ONLY) -------- */

  const deleteService = async (orderId) => {
    if (!confirm("Delete this service?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/service-orders/${orderId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      await loadOrders();
    } catch {
      alert("Delete error");
    }
  };

  /* -------- UI STATES -------- */

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center mt-32">Loading booking…</div>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center mt-32">Booking not found</div>
      </div>
    );

  const isPaid = booking.booking_status === "paid";
  const allowDelete = isPaid && canDeleteService(booking.created_at);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <div className="bg-indigo-700 text-white py-14 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold">
            Booking #{booking.booking_id}
          </h1>
          <p className="text-indigo-200 mt-1">
            {booking.type_name} • Room #{booking.room_number}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8 pb-16">

        {/* BOOKING INFO */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Booking Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Check-in:</strong> {fmtDate(booking.check_in)}</p>
            <p><strong>Check-out:</strong> {fmtDate(booking.check_out)}</p>
            <p><strong>Status:</strong> {booking.booking_status}</p>
            <p className="text-indigo-600 font-bold">
              PKR {Number(booking.total_price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* SERVICE ORDERS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Ordered Services</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No services ordered.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.order_id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{o.service_name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {o.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-bold text-indigo-600">
                      PKR {Number(o.total_price).toLocaleString()}
                    </p>

                    {allowDelete && (
                      <button
                        onClick={() => deleteService(o.order_id)}
                        className="text-red-600 text-sm font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ADD SERVICE (PAID ONLY – NO TIME LIMIT) */}
        {isPaid && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Add Service</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="border p-3 rounded-lg flex-1"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                <option value="">Select service</option>
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>
                    {s.service_name} (PKR {s.price})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border p-3 rounded-lg w-28"
              />

              <button
                onClick={addService}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

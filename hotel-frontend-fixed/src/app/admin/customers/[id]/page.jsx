"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ===============================
  // LOAD CUSTOMER DETAILS
  // ===============================
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/customers/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (!res.ok) return alert(json.message);

        setCustomer(json.data.customer);
        setBookings(json.data.bookings || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer details");
      }
      setLoading(false);
    };

    loadDetails();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customer Details</h1>

          <button
            onClick={() => router.push("/admin/customers")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : !customer ? (
          <p className="text-red-500">Customer not found</p>
        ) : (
          <>
            {/* ===============================
                CUSTOMER INFO
            =============================== */}
            <div className="bg-white rounded-xl shadow border p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <span className="font-medium">ID:</span>{" "}
                  {customer.customer_id}
                </p>
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {customer.first_name} {customer.last_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {customer.email}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {formatDate(customer.created_at)}
                </p>
              </div>
            </div>

            {/* ===============================
                BOOKINGS TABLE
            =============================== */}
            <div className="bg-white rounded-xl shadow border overflow-hidden">
              <h2 className="text-xl font-semibold p-6 border-b">
                Bookings History
              </h2>

              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Room</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Check In</th>
                    <th className="p-4">Check Out</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-6 text-center text-gray-500"
                      >
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr
                        key={b.booking_id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-4">{b.booking_id}</td>
                        <td className="p-4">{b.room_number}</td>
                        <td className="p-4">{b.type_name}</td>
                        <td className="p-4">
                          {formatDate(b.check_in)}
                        </td>
                        <td className="p-4">
                          {formatDate(b.check_out)}
                        </td>
                        <td className="p-4">
                          PKR {Number(b.total_price).toLocaleString()}
                        </td>
                        <td className="p-4 capitalize">
                          {b.booking_status}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/invoice/${b.booking_id}`
                              )
                            }
                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

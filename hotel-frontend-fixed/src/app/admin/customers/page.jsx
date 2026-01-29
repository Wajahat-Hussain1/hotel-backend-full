"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===============================
  // LOAD CUSTOMERS
  // ===============================
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/customers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (res.ok) setCustomers(json.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadCustomers();
  }, [token]);

  // ===============================
  // DELETE CUSTOMER (HARD)
  // ===============================
  const deleteCustomer = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/${id}/permanent`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      setCustomers((prev) =>
        prev.filter((c) => c.customer_id !== id)
      );
    } catch (err) {
      console.error(err);
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
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full md:w-96 px-4 py-2 border rounded-lg shadow-sm"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.customer_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">{c.customer_id}</td>

                    <td className="p-4 font-medium">
                      {c.first_name} {c.last_name}
                    </td>

                    <td className="p-4">{c.email}</td>

                    <td className="p-4">
                      {formatDate(c.created_at)}
                    </td>

                    <td className="p-4 space-x-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/customers/${c.customer_id}`
                          )
                        }
                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/admin/customers/edit/${c.customer_id}`
                          )
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteCustomer(c.customer_id)
                        }
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
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
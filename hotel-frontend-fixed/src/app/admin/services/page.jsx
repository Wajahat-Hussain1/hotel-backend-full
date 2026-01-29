"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  // -------------------------
  // LOAD SERVICES
  // -------------------------
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) setServices(json.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  // -------------------------
  // OPEN MODAL
  // -------------------------
  const openAdd = () => {
    setEditing(null);
    setServiceName("");
    setPrice("");
    setDescription("");
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setServiceName(s.service_name);
    setPrice(s.price);
    setDescription(s.description || "");
    setShowModal(true);
  };

  // -------------------------
  // SAVE (ADD / UPDATE)
  // -------------------------
  const saveService = async () => {
    if (!serviceName || !price) {
      alert("Service name & price required");
      return;
    }

    try {
      const res = await fetch(
        editing
          ? `http://localhost:5000/api/services/${editing.service_id}`
          : "http://localhost:5000/api/services",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            service_name: serviceName,
            price,
            description,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) return alert(json.message);

      setShowModal(false);
      loadServices();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // -------------------------
  // DELETE
  // -------------------------
  const deleteService = async (id) => {
    if (!confirm("Delete this service?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/services/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (!res.ok) return alert(json.message);

      loadServices();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <main className="p-8 max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Services</h1>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              + Add Service
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-right">Price (PKR)</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.service_id} className="border-t">
                      <td className="p-4 font-medium">
                        {s.service_name}
                      </td>
                      <td className="p-4 text-right">
                        {Number(s.price).toLocaleString()}
                      </td>
                      <td className="p-4">
                        {s.description || "-"}
                      </td>
                      <td className="p-4 text-center space-x-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            deleteService(s.service_id)
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Service" : "Add Service"}
            </h2>

            <label className="block mb-2 font-semibold">
              Service Name
            </label>
            <input
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 font-semibold">
              Price (PKR)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <label className="block mb-2 font-semibold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form States
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) setServices(json.data || []);
    } catch (err) {
      toast.error("Failed to sync services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

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

  const saveService = async () => {
    if (!serviceName || !price) return toast.error("Name and price are required");

    const loadingToast = toast.loading(editing ? "Updating service..." : "Creating service...");
    try {
      const res = await fetch(
        editing ? `${API_URL}/api/services/${editing.service_id}` : `${API_URL}/api/services`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ service_name: serviceName, price, description }),
        }
      );

      if (res.ok) {
        toast.success(editing ? "Service updated!" : "Service created!", { id: loadingToast });
        setShowModal(false);
        loadServices();
      } else {
        const err = await res.json();
        toast.error(err.message, { id: loadingToast });
      }
    } catch (err) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  const deleteService = async (id) => {
    if (!confirm("Are you sure? This will permanently remove the service.")) return;

    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Service deleted");
        loadServices();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <AdminSidebar active="services" />

      <main className="flex-1 p-6 lg:p-12 max-w-[1400px] mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Hotel <span className="text-indigo-600">Services</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage add-ons, amenities, and extra charges.</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-slate-900 transition-all hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            New Service
          </button>
        </div>

        {/* SERVICES TABLE */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Price (PKR)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-bold text-sm">Syncing Catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 font-bold">No services found in database.</td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s.service_id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <span className="text-lg font-black text-slate-800">{s.service_name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-500 max-w-xs truncate">{s.description || "No description provided."}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-indigo-600">
                      Rs. {Number(s.price).toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={() => deleteService(s.service_id)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- SERVICE MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter">
              {editing ? "Update" : "Add"} <span className="text-indigo-600 text-2xl">Service</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Service Title</label>
                <input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Airport Pick & Drop"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Price (PKR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Notes / Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
              >
                {editing ? "Update Catalog" : "Add to List"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
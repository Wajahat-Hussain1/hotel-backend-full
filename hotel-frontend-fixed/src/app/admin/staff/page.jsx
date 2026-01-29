"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/AdminSidebar";
import { useRouter } from "next/navigation";

// === Custom Components ===

// Reusable Notification component
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  
  useEffect(() => {
      const timer = setTimeout(() => {
          onClose();
      }, 3000);
      return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg font-medium max-w-sm z-50 ${bgColor}`}>
      {message}
    </div>
  );
};

// Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
// === End Custom Components ===


export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active"); // active | inactive | all
  const [notification, setNotification] = useState({ message: null, type: null });
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    id: null, 
    status: null 
  });


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  // Load staff
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/staff", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (json.success !== false) setStaff(json.data || []);
      } catch (err) {
        console.error(err);
        setNotification({ message: "Failed to load staff list.", type: "error" });
      }
      setLoading(false);
    };

    load();
  }, [token]);

  // Filter Logic
  const filtered = staff.filter((s) => {
    if (view !== "all" && s.status !== view) return false;

    return `${s.staff_id} ${s.name} ${s.role} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // Toggle Active / Inactive
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setConfirmModal({
        isOpen: true,
        id: id,
        status: newStatus,
        title: `Confirm Status Change`,
        message: `Are you sure you want to change this staff member's status to '${newStatus}'?`
    });
  };

  const handleConfirmStatusChange = async () => {
    const { id, status: newStatus } = confirmModal;
    setConfirmModal({ isOpen: false, id: null, status: null });

    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok) {
        return setNotification({ message: json.message || "Status update failed", type: "error" });
      }

      setStaff((prev) =>
        prev.map((s) =>
          s.staff_id === id ? { ...s, status: newStatus } : s
        )
      );

      setNotification({ message: `Staff is now ${newStatus.toUpperCase()}!`, type: "success" });
    } catch (err) {
      console.error(err);
      setNotification({ message: "Status update failed due to connection error.", type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="staff" />
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: null, type: null })} />
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmModal({ isOpen: false, id: null, status: null })}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Staff Members</h1>

          <Link
            href="/admin/staff/add"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition font-semibold flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add New Staff</span>
          </Link>
        </div>

        {/* CONTROLS (SEARCH & TABS) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            {/* FILTER TABS */}
            <div className="flex bg-white p-1 rounded-xl shadow-md border border-gray-100">
                {["active", "inactive", "all"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setView(tab)}
                        className={`px-4 py-2 capitalize font-semibold rounded-lg transition duration-200 text-sm
                        ${view === tab
                            ? "bg-purple-600 text-white shadow-purple-300 shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search by ID, Name, Role, or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
            />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Salary (PKR)</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-lg text-gray-500 animate-pulse">
                    Loading staff data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-lg text-red-500">
                    No staff members match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.staff_id} className="border-t border-gray-100 hover:bg-gray-50 transition duration-150">
                    <td className="p-4 font-extrabold text-sm text-purple-600">{s.staff_id}</td>
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-sm">{s.email}</td>
                    <td className="p-4 capitalize text-sm">{s.role}</td>
                    <td className="p-4 text-sm">{s.phone}</td>

                    <td className="p-4 font-semibold text-sm text-green-700">
                      PKR {Number(s.salary).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {s.status === "active" ? (
                        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-bold">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/staff/${s.staff_id}/edit`}
                          className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
                          title="Edit Staff Details"
                        >
                            Edit
                        </Link>
                        
                        <Link
                            href={`/admin/staff/${s.staff_id}/delete`}
                            className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
                            title="Delete Staff Record"
                        >
                            Delete
                        </Link>

                        <button
                          onClick={() => toggleStatus(s.staff_id, s.status)}
                          className={`px-3 py-2 text-sm rounded-lg text-white font-semibold transition shadow-sm
                          ${
                            s.status === "active"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          title={s.status === "active" ? "Deactivate Staff" : "Activate Staff"}
                        >
                          {s.status === "active" ? "Deactivate" : "Activate"}
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
    </div>
  );
}
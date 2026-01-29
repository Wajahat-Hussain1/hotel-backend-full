"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";

// === Custom Notification Component ===
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    
    // Auto-close after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div 
            className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg font-medium max-w-sm z-50 transition-opacity duration-300 ease-in-out ${bgColor}`}
            role="alert"
        >
          <div className="flex justify-between items-start">
              {message}
              <button className="ml-4 font-bold text-lg leading-none" onClick={onClose}>&times;</button>
          </div>
        </div>
    );
};
// === End Custom Notification Component ===

export default function DeleteStaffPage() {
  const router = useRouter();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  // Load staff info to show in delete UI
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setNotification({ message: json.message || "Staff details failed to load.", type: "error" });
          // Redirect after showing error
          setTimeout(() => router.push("/admin/staff"), 1500);
          return;
        }

        setStaff(json.data);
      } catch (err) {
        console.error(err);
        setNotification({ message: "Network error: Failed to connect to server.", type: "error" });
      }

      setLoading(false);
    };

    loadStaff();
  }, [id, router, token]);


  // -------- DELETE STAFF FUNCTION --------
  const deleteStaff = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setNotification({ message: json.message || "Failed to delete staff member.", type: "error" });
        setDeleting(false);
        return;
      }

      setNotification({ message: "Staff member deleted successfully!", type: "success" });
      
      // Redirect to staff list after successful deletion
      setTimeout(() => {
        router.push("/admin/staff");
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ message: "Failed to delete staff due to network error.", type: "error" });
      setDeleting(false);
    }
  };


  if (loading) {
      return (
          <div className="flex min-h-screen bg-gray-50 items-center justify-center">
              <p className="text-gray-500 animate-pulse text-xl font-medium">Loading staff details...</p>
          </div>
      );
  }

  if (!staff) {
      return (
          <div className="flex min-h-screen bg-gray-50 text-gray-800">
              <Sidebar active="staff" />
              <main className="flex-1 p-10">
                  <p className="text-red-600 font-semibold text-xl">Staff member not found or error occurred.</p>
                  <button
                      onClick={() => router.push("/admin/staff")}
                      className="mt-4 px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                      Go Back
                  </button>
              </main>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar active="staff" />
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: null, type: null })} />

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
                Delete Staff Record <span className="text-red-600">#{id}</span>
            </h1>
            <button
                onClick={() => router.push(`/admin/staff`)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Staff List</span>
            </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-center">
            <svg className="mx-auto h-16 w-16 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.948 3.374c-.866-1.5-3.142-1.5-4.008 0L3.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>

            <h2 className="text-2xl font-bold mb-4 text-red-700">Permanent Deletion Warning</h2>

            <p className="text-gray-600 mb-6 font-medium">
                You are about to **permanently delete** the following staff member. This action cannot be undone.
            </p>

            <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-left mb-8">
                <p className="text-sm text-red-800 font-bold mb-2">Staff Details:</p>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                    <p><strong>ID:</strong></p> <p className="font-semibold">{staff.staff_id}</p>
                    <p><strong>Name:</strong></p> <p className="font-semibold">{staff.name}</p>
                    <p><strong>Role:</strong></p> <p className="font-semibold capitalize">{staff.role}</p>
                    <p><strong>Email:</strong></p> <p className="font-semibold">{staff.email}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={deleteStaff}
                    disabled={deleting}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-lg disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {deleting ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Yes, Delete Permanently'
                    )}
                </button>

                <button
                    onClick={() => router.push("/admin/staff")}
                    disabled={deleting}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition shadow-lg disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";

// === Custom Notification Component (copied for consistency) ===
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


// Convert DB timestamp → HTML (YYYY-MM-DD)
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function EditStaffPage() {
  const router = useRouter();
  const { id } = useParams();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  // List of all staff roles for the dropdown
  const staffRoles = [
      "manager", 
      "receptionist", 
      "security", 
      "driver", 
      "chef", 
      "cleaner", 
      "technician",
      "housekeeping"
  ];


  // Load staff details
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          setNotification({ message: json.message || "Failed to load staff data.", type: "error" });
          return router.push("/admin/staff");
        }

        // FIX: convert hired_date before storing
        const fixedData = {
          ...json.data,
          hired_date: formatDate(json.data.hired_date),
        };

        setStaff(fixedData);
      } catch (err) {
        console.error(err);
        setNotification({ message: "Network error: Failed to load staff data.", type: "error" });
      }

      setLoading(false);
    };

    load();
  }, [id, router, token]);

  const updateField = (key, value) => {
    setStaff({ ...staff, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Frontend validation check
    if (!staff.name || !staff.email || !staff.role) {
        setNotification({ message: "Name, Email, and Role are required fields.", type: "error" });
        setUpdating(false);
        return;
    }


    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Send only the required fields, including optional password if present
        body: JSON.stringify({
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            salary: staff.salary,
            hired_date: staff.hired_date,
            role: staff.role,
            // Only include password if the user entered a new one
            ...(staff.password && { password: staff.password })
        }),
      });

      const json = await res.json();

      if (!res.ok) {
          setNotification({ message: json.message || "Staff update failed.", type: "error" });
          setUpdating(false);
          return;
      }

      setNotification({ message: "Staff details updated successfully!", type: "success" });
      
      // Redirect after showing success notification
      setTimeout(() => {
        router.push("/admin/staff");
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ message: "Network error: Update failed.", type: "error" });
      setUpdating(false);
    }
  };

  if (loading || !staff) {
      return (
          <div className="flex min-h-screen bg-gray-50 items-center justify-center">
              <p className="text-gray-500 animate-pulse text-xl font-medium">Loading staff data...</p>
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
                Edit Staff Member <span className="text-purple-600">#{id}</span>
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

        <form
          onSubmit={submitForm}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto"
        >
          {/* BASIC FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {[
              { label: "Full Name", key: "name", type: "text", required: true },
              { label: "Email Address", key: "email", type: "email", required: true },
              { label: "Phone Number", key: "phone", type: "text", required: false },
              { label: "Salary (PKR)", key: "salary", type: "number", required: false },
              { label: "Hired Date", key: "hired_date", type: "date", required: false },
            ].map((item) => (
              <div className="space-y-1" key={item.key}>
                <label className="block text-sm font-medium text-gray-700">
                    {item.label} 
                    {item.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={item.type}
                  value={staff[item.key] || ""}
                  onChange={(e) => updateField(item.key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                  required={item.required}
                  // Added key check for salary to prevent minus sign
                  {...(item.key === 'salary' && { min: "0" })}
                />
              </div>
            ))}
          </div>
          
          {/* ROLE - Full width */}
          <div className="mt-5 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
            </label>
            <select
              value={staff.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition bg-white appearance-none"
              required
            >
              {staffRoles.map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
              ))}
            </select>
          </div>

          {/* PASSWORD OPTIONAL - Full width */}
          <div className="mt-5 space-y-1">
            <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
            <input
              type="password"
              placeholder="Enter new password to change, leave empty to keep old one"
              // Note: We intentionally don't set 'value' here for security reasons.
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={updating}
            className="w-full mt-8 py-3 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition shadow-md disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {updating ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : "Update Staff Details"}
          </button>
        </form>
      </main>
    </div>
  );
}
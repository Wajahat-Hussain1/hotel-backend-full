"use client";

import { useState } from "react";
import Sidebar from "../../components/AdminSidebar";
import { useRouter } from "next/navigation";

// === Custom Notification Component (copied from previous response for consistency) ===
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    
    // Auto-close after 3 seconds
    // Note: useEffect dependency is omitted here, assuming this is a simple static utility component
    // In a real application, you might want a proper useEffect here if this component were used frequently.

    return (
        <div 
            className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg font-medium max-w-sm z-50 transition-opacity duration-300 ease-in-out ${bgColor}`}
            // Adding a simple button to manually close
            onClick={onClose}
        >
          <div className="flex justify-between items-start">
              {message}
              <button className="ml-4 font-bold text-lg leading-none" onClick={onClose}>&times;</button>
          </div>
        </div>
    );
};
// === End Custom Notification Component ===


export default function AddStaffPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    salary: "",
    hired_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: null, type: null });


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name || !form.email || !form.password || !form.role) {
        setNotification({ message: "Name, Email, Password & Role are required!", type: "error" });
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setNotification({ message: json.message || "Failed to create staff.", type: "error" });
        setLoading(false);
        return;
      }

      setNotification({ message: "Staff member added successfully!", type: "success" });
      
      // Wait a moment for notification to show, then redirect
      setTimeout(() => {
        router.push("/admin/staff");
      }, 1500);

    } catch (err) {
      console.error(err);
      setNotification({ message: "Network error: Failed to connect to server.", type: "error" });
    }
    setLoading(false);
  };

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


  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar active="staff" />
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: null, type: null })} />

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
                Add New Staff Member
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {[
              { label: "Full Name", key: "name", type: "text", required: true, placeholder: "e.g., Ali Khan" },
              { label: "Email Address", key: "email", type: "email", required: true, placeholder: "e.g., ali@hotel.com" },
              { label: "Password", key: "password", type: "password", required: true, placeholder: "Must be secure" },
              { label: "Phone Number", key: "phone", type: "text", required: false, placeholder: "+92 3XX XXXXXXX" },
              { label: "Salary (PKR)", key: "salary", type: "number", required: false, placeholder: "50000" },
              { label: "Hired Date", key: "hired_date", type: "date", required: false },
            ].map((item) => (
              <div className="space-y-1" key={item.key}>
                <label className="block text-sm font-medium text-gray-700">
                    {item.label} 
                    {item.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={item.type}
                  value={form[item.key]}
                  onChange={(e) => updateField(item.key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition"
                  required={item.required}
                  placeholder={item.placeholder}
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
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition bg-white appearance-none"
              required
            >
              <option value="">--- Select Staff Role ---</option>
              {staffRoles.map(role => (
                  <option key={role} value={role} className="capitalize">{role}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-3 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition shadow-md disabled:bg-purple-300 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Staff..." : "Add Staff Member"}
          </button>
        </form>
      </main>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast"; // 💡 react-hot-toast import kiya gaya

export default function EditCustomerPage() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("hotel_token")
            : null;

    // ===============================
    // LOAD CUSTOMER (Replaced alert with toast)
    // ===============================
    useEffect(() => {
        const loadCustomer = async () => {
            if (!id) return;

            const loadingId = toast.loading("Loading customer data...");
            try {
                const res = await fetch(
                    `http://localhost:5000/api/customers/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const json = await res.json();
                toast.dismiss(loadingId);
                
                if (!res.ok) {
                    toast.error(json.message || "Failed to load customer details.");
                    // router.push("/admin/customers"); // Redirect if failed
                    return;
                }

                setForm({
                    first_name: json.data.first_name || "",
                    last_name: json.data.last_name || "",
                    email: json.data.email || "",
                    password: "", // blank on purpose
                });
            } catch (err) {
                toast.dismiss(loadingId);
                toast.error("Network error: Failed to load customer.");
            }
            setLoading(false);
        };

        loadCustomer();
    }, [id, token]);

    // ===============================
    // HANDLE CHANGE
    // ===============================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ===============================
    // SAVE CHANGES (Replaced alert with toast)
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...form };
        if (!payload.password) delete payload.password; // Agar password blank hai to send na karein

        const updateToastId = toast.loading("Saving changes...");
        
        try {
            const res = await fetch(
                `http://localhost:5000/api/customers/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();
            toast.dismiss(updateToastId);
            
            if (!res.ok) {
                return toast.error(json.message || "Customer update failed.");
            }

            toast.success("Customer updated successfully!");
            // Success hone par customer detail page ya list page par redirect
            router.push(`/admin/customers/${id}`); 
        } catch (err) {
            toast.dismiss(updateToastId);
            toast.error("Update failed due to network error.");
        }
    };

    // ===============================
    // JSX RETURN (Professional Design)
    // ===============================
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <Toaster position="bottom-right" reverseOrder={false} />

            <main className="flex-1 p-8 lg:p-10">
                
                {/* Header and Back Button */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-800">Edit Customer (ID: {id})</h1>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
                    >
                        ← Back to Details
                    </button>
                </div>
                
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        <p>Loading customer profile...</p>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-8 rounded-xl shadow-2xl border border-indigo-100 w-full max-w-2xl"
                        >
                            <h2 className="text-xl font-semibold text-indigo-700 mb-6 border-b pb-2">Customer Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div className="mt-6 space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                                    required
                                />
                            </div>

                            {/* New Password */}
                            <div className="mt-6 space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Only fill this field if you want to change the customer's password.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8 pt-4 border-t justify-end">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition font-semibold"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
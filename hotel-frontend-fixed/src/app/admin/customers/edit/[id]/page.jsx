"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "../../../components/AdminSidebar";
import toast, { Toaster } from "react-hot-toast";

// Dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hotel-backend-full.onrender.com";

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

    const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

    // ===============================
    // LOAD CUSTOMER
    // ===============================
    useEffect(() => {
        const loadCustomer = async () => {
            if (!id || !token) return;

            try {
                // Updated to use production API_URL
                const res = await fetch(`${API_URL}/api/customers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const json = await res.json();
                
                if (!res.ok) {
                    toast.error(json.message || "Failed to load customer details.");
                    return;
                }

                setForm({
                    first_name: json.data.first_name || "",
                    last_name: json.data.last_name || "",
                    email: json.data.email || "",
                    password: "", // blank on purpose
                });
            } catch (err) {
                toast.error("Network error: Failed to load customer.");
            } finally {
                setLoading(false);
            }
        };

        loadCustomer();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ===============================
    // SAVE CHANGES
    // ===============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...form };
        if (!payload.password) delete payload.password;

        const updateToastId = toast.loading("Saving changes...");
        
        try {
            // Updated to use production API_URL
            const res = await fetch(`${API_URL}/api/customers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            toast.dismiss(updateToastId);
            
            if (!res.ok) {
                return toast.error(json.message || "Customer update failed.");
            }

            toast.success("Customer updated successfully!");
            router.push(`/admin/customers/${id}`); 
        } catch (err) {
            toast.dismiss(updateToastId);
            toast.error("Update failed due to network error.");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <Toaster position="top-center" reverseOrder={false} />

            <main className="flex-1 p-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modify Customer</h1>
                        <p className="text-slate-500 text-sm font-medium">Updating Profile for ID: {id}</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Discard Changes
                    </button>
                </div>
                
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                         <p className="text-slate-400 font-medium tracking-tight">Syncing with server...</p>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 w-full max-w-2xl"
                        >
                            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                                    required
                                />
                            </div>

                            <div className="mt-8 space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Security: Update Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-slate-700"
                                />
                                <p className="text-[10px] text-slate-400 font-medium ml-1">
                                    Leave blank to maintain current security settings.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-12 pt-8 border-t border-slate-50">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition font-black tracking-tight"
                                >
                                    Save Profile Updates
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
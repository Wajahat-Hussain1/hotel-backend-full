"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Point to Render Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Login() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      // ✅ UPDATED: Dynamic API URL
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error || "Login failed");
        setBusy(false);
        return;
      }

      // ⭐ Correct token extraction
      const token = data?.data?.token || data?.token || null;

      // ⭐ Role extraction (Backend usually nests user inside 'data')
      const role = data?.data?.user?.role || data?.user?.role || data?.role || null;

      if (!token) {
        alert("No token received from server");
        setBusy(false);
        return;
      }

      // ⭐ Store token & role for session persistence
      localStorage.setItem("hotel_token", token);
      localStorage.setItem("hotel_role", role);

      // ⭐ Role-Based Navigation
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert("Network error. Please check if the server is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Brand/Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
               <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email or Username</label>
              <input
                id="user-id"
                placeholder="Enter your email"
                type="text"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center ${
                busy ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {busy ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              New to The Velvet Door?{" "}
              <a href="/register" className="text-blue-600 font-bold hover:text-blue-800 transition">
                Create an account
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
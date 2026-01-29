"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// 1. We move the logic into a sub-component
function SuccessPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const booking_id = params.get("booking_id");

  const [status, setStatus] = useState("Confirming your payment...");

  useEffect(() => {
    if (!booking_id) {
      setStatus("Invalid payment session.");
      return;
    }

    const token = localStorage.getItem("hotel_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // --- CRITICAL FIX: Replace localhost with Environment Variable ---
    // This uses the URL you set in the Vercel Dashboard
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${API_URL}/api/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ booking_id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("✅ Payment Successful! Booking Confirmed.");
        } else {
          setStatus("❌ Error confirming booking.");
        }
      })
      .catch(() => {
        setStatus("❌ Error contacting server.");
      });
  }, [booking_id, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-3xl font-bold">{status}</h1>

      <button
        onClick={() => router.push("/user/bookings")}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
      >
        Go to My Bookings
      </button>
    </div>
  );
}

// 2. The main exported page wraps the content in Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
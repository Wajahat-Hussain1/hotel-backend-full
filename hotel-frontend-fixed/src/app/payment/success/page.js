"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
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

    fetch("http://localhost:5000/api/payments/confirm", {
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

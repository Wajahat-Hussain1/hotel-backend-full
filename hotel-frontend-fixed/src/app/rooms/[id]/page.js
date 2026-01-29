"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

// Get the API URL from environment variables, fallback to localhost for local dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getRoomImageUrl = (typeName) => {
  const t = typeName?.toLowerCase() || "";
  if (t.includes("suite")) return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("deluxe") || t.includes("king")) return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("double") || t.includes("twin")) return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("single") || t.includes("standard")) return "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=1500&q=80";
  return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=80";
};

const todayDate = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  // FETCH ROOM - FIXED URL
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rooms/${id}`);
        const json = await res.json();
        let data = json?.data || null;
        if (data && !data.image) {
          data.image = getRoomImageUrl(data.type_name);
        }
        setRoom(data);
      } catch (e) {
        console.error("Fetch Room Error:", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
  }, [id]);

  // AVAILABILITY CHECK - FIXED URL
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert("Select both dates");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-out must be after check-in");
      return;
    }

    setChecking(true);
    setAvailable(null);

    try {
      const res = await fetch(`${API_URL}/api/bookings/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: id,
          check_in: checkIn,
          check_out: checkOut,
        }),
      });

      const data = await res.json();
      setAvailable(data.available === true);
    } catch (err) {
      console.error("Availability Check Error:", err);
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleBookNow = () => {
    const token = localStorage.getItem("hotel_token");
    if (!token) {
      window.location.href = `/login?redirect=/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
      return;
    }
    window.location.href = `/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!room) return <div className="text-center mt-20">Room not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 mt-8 grid md:grid-cols-2 gap-10">
        <div>
          <div className="h-96 rounded-xl overflow-hidden shadow-lg bg-gray-200">
            <img 
              src={room.image} 
              alt={room.type_name}
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1500&q=80";
              }}
            />
          </div>
          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Room Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-700"><span>📶</span><span className="text-sm font-medium">Free Wi-Fi</span></div>
              <div className="flex items-center gap-2 text-gray-700"><span>❄️</span><span className="text-sm font-medium">AC</span></div>
              <div className="flex items-center gap-2 text-gray-700"><span>📺</span><span className="text-sm font-medium">Smart TV</span></div>
              <div className="flex items-center gap-2 text-gray-700"><span>☕</span><span className="text-sm font-medium">Coffee Maker</span></div>
              <div className="flex items-center gap-2 text-gray-700"><span>🚿</span><span className="text-sm font-medium">Hot Shower</span></div>
              <div className="flex items-center gap-2 text-gray-700"><span>🍳</span><span className="text-sm font-medium">Breakfast</span></div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{room.type_name}</h1>
          <p className="text-xl text-indigo-600 font-bold mt-2">PKR {room.base_price}/night</p>
          <div className="mt-6 bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input type="date" min={todayDate()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setAvailable(null); }} className="w-full border p-2 rounded mb-3 outline-none" />
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input type="date" min={checkIn || todayDate()} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setAvailable(null); }} className="w-full border p-2 rounded mb-4 outline-none" />
            <button onClick={checkAvailability} disabled={checking} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold">
              {checking ? "Checking..." : "Check Availability"}
            </button>
            {available === true && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 font-bold text-center">✓ Room is AVAILABLE</div>}
            {available === false && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 font-bold text-center">✕ Room is ALREADY BOOKED</div>}
            {available === true && <button onClick={handleBookNow} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-bold shadow-md">Book Now</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
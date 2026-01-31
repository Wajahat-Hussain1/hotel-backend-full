"use client";

import { useState } from "react";

// Define API_URL to point to Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DateSearchBar({ onResults }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0]; 

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED: Now fetching from Render instead of localhost
      const res = await fetch(`${API_URL}/api/rooms`);
      const json = await res.json();

      const rooms = json.data ? json.data : json;

      // Filter rooms that are ready for booking
      const available = Array.isArray(rooms) 
        ? rooms.filter((r) => r.status !== "occupied" && r.status !== "maintenance")
        : [];

      onResults(available);
    } catch (err) {
      console.error("Error fetching available rooms:", err);
      onResults([]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-2xl p-5 rounded-2xl max-w-4xl mx-auto -mt-10 relative z-10 space-y-3 border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
      
      <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Check Availability
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* 1. Check-in date */}
        <div>
          <label className="font-medium text-gray-600 block mb-1 text-sm">Check-in</label>
          <div className="relative">
             <input
                type="date"
                className="w-full border-gray-300 border-2 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 cursor-pointer" 
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </span>
          </div>
        </div>

        {/* 2. Check-out date */}
        <div>
          <label className="font-medium text-gray-600 block mb-1 text-sm">Check-out</label>
          <div className="relative">
            <input
              type="date"
              className="w-full border-gray-300 border-2 px-3 py-2.5 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150 cursor-pointer"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </span>
          </div>
        </div>

        {/* 3. Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className={`w-full text-white py-2.5 rounded-xl transition duration-150 font-semibold shadow-lg text-sm ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Checking...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Search Rooms
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
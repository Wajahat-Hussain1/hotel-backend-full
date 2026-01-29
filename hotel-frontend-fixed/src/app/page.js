"use client";

import Navbar from "./components/Navbar";
import DateSearchBar from "./components/DateSearchBar";
import RoomCard from "./components/RoomCard";
import { useState, useEffect } from "react";

// ✅ FIXED: Use Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        // ✅ FIXED: Use API_URL constant
        const res = await fetch(`${API_URL}/api/rooms`);
        const json = await res.json();

        const roomList = Array.isArray(json)
          ? json
          : json.data
          ? json.data
          : [];

        setRooms(roomList);
        setFilteredRooms(roomList);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleSearchResults = (availableRooms) => {
    setFilteredRooms(Array.isArray(availableRooms) ? availableRooms : []);
  };

  return (
    <div>
      <Navbar />
      <header 
        className="text-white py-24 bg-cover bg-center shadow-lg"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop')`,
          minHeight: '40vh' 
        }}
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="bg-black bg-opacity-30 p-4 inline-block rounded-lg backdrop-blur-sm"> 
            <h2 className="text-4xl font-extrabold tracking-tight">Welcome to THE VELVET DOOR</h2> 
            <p className="mt-2 text-xl font-light">Luxury. Comfort. Your perfect stay.</p>
          </div>
        </div>
      </header>
      
      <DateSearchBar onResults={handleSearchResults} />

      <main className="max-w-6xl mx-auto px-4 py-10" id="rooms">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Available Rooms</h3>

        {loading && (
          <p className="text-blue-600 mt-4 text-center text-lg">
            Loading room details...
          </p>
        )}
        
        {!loading && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.room_id} room={room} />
            ))}
          </div>
        )}

        {!loading && filteredRooms.length === 0 && (
          <p className="text-gray-600 mt-8 text-center border p-6 rounded-xl bg-yellow-50 shadow-sm text-lg">
            ⚠️ No rooms found. Please adjust your search dates or check back later.
          </p>
        )}
      </main>
    </div>
  );
}
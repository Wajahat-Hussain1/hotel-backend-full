// "use client";

// import Navbar from "./components/Navbar";
// import DateSearchBar from "./components/DateSearchBar";
// import RoomCard from "./components/RoomCard";
// import { useState, useEffect } from "react";

// export default function Home() {
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);

//   // ⭐ FIXED: Load rooms from backend properly
//   useEffect(() => {
//     const loadRooms = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/rooms");
//         const json = await res.json();

//         // backend returns { success, data }
//         const roomList = Array.isArray(json)
//           ? json
//           : json.data
//           ? json.data
//           : [];

//         setRooms(roomList);
//         setFilteredRooms(roomList);
//       } catch (error) {
//         console.error("Failed to load rooms:", error);
//       }
//     };

//     loadRooms();
//   }, []);

//   // ⭐ When DateSearchBar returns available rooms
//   const handleSearchResults = (availableRooms) => {
//     // Always ensure it's an array
//     setFilteredRooms(Array.isArray(availableRooms) ? availableRooms : []);
//   };

//   return (
//     <div>
//       <Navbar />

//       <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
//         <div className="max-w-6xl mx-auto px-4">
//           <h2 className="text-3xl font-bold">Welcome to FlashBoy Hotel</h2>
//           <p className="mt-2 text-gray-200">
//             Best rates. Easy booking. Friendly stays.
//           </p>
//         </div>
//       </header>

//       <DateSearchBar onResults={handleSearchResults} />

//       <main className="max-w-6xl mx-auto px-4 py-10" id="rooms">
//         <h3 className="text-2xl font-semibold mb-6">Available Rooms</h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRooms.map((room) => (
//             <RoomCard key={room.room_id} room={room} />
//           ))}
//         </div>

//         {filteredRooms.length === 0 && (
//           <p className="text-gray-600 mt-4">
//             No rooms available for selected dates.
//           </p>
//         )}
//       </main>
//     </div>
//   );
// }
 
// File: Home.js (Image Fetching Removed & Header Background Image Added)

"use client";

import Navbar from "./components/Navbar";
import DateSearchBar from "./components/DateSearchBar";
import RoomCard from "./components/RoomCard";
import { useState, useEffect } from "react";

// --- REMOVED: Utility function to map room type to a fresh placeholder image URL ---
// getRoomImageUrl function ko yahan se hata diya gaya hai.
// -----------------------------------------------------------------------------------


export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ LOAD ROOMS: Image logic removed
  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/rooms");
        const json = await res.json();

        const roomList = Array.isArray(json)
          ? json
          : json.data
          ? json.data
          : [];

        // --- REMOVED: MAP IMAGES TO ROOMS LOGIC ---
        // roomsWithImages mapping ko hata diya gaya hai.
        setRooms(roomList);
        setFilteredRooms(roomList);
        // ------------------------------------------

      } catch (error) {
        console.error("Failed to load rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // ⭐ HANDLE SEARCH RESULTS: Image logic removed
  const handleSearchResults = (availableRooms) => {
    // --- REMOVED: Image injection logic ---
    setFilteredRooms(Array.isArray(availableRooms) ? availableRooms : []);
    // ---------------------------------------
  };

  return (
    <div>
      <Navbar />

      {/* ⭐ HEADER FIX: Background image added instead of blue gradient */}
      <header 
        className="text-white py-24 bg-cover bg-center shadow-lg"
        style={{ 
          // Beautiful Hotel View Background Image URL
          backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop')`,
          minHeight: '40vh' // To make sure image is clearly visible
        }}
      >
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Background overlay for text visibility */}
          <div className="bg-black bg-opacity-30 p-4 inline-block rounded-lg backdrop-blur-sm"> 
            <h2 className="text-4xl font-extrabold tracking-tight">Welcome to THE VELVET DOOR</h2> 
            <p className="mt-2 text-xl font-light">
              Luxury. Comfort. Your perfect stay.
            </p>
          </div>
        </div>
      </header>
      
      <DateSearchBar onResults={handleSearchResults} />

      <main className="max-w-6xl mx-auto px-4 py-10" id="rooms">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">Available Rooms</h3>

        {loading && (
          <p className="text-blue-600 mt-4 text-center text-lg">
            <svg className="animate-spin h-6 w-6 mr-3 inline-block text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading room details...
          </p>
        )}
        
        {!loading && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              // RoomCard will now rely solely on 'room.image' field from backend
              <RoomCard key={room.room_id} room={room} />
            ))}
          </div>
        )}

        {!loading && filteredRooms.length === 0 && (
          <p className="text-gray-600 mt-8 text-center border p-6 rounded-xl bg-yellow-50 shadow-sm text-lg">
            ⚠️ **No rooms found.** Please adjust your search dates or check back later.
          </p>
        )}
      </main>
    </div>
  );
}
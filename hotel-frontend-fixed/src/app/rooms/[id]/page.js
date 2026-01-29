// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams } from "next/navigation";
// // import Navbar from "../../components/Navbar";

// // // IMAGE HELPER (UNCHANGED)
// // const getRoomImageUrl = (typeName) => {
// //   const t = typeName?.toLowerCase() || "";
// //   if (t.includes("suite"))
// //     return "https://images.unsplash.com/photo-1595562799309-8d77e0d3765e?q=80&w=1500&auto=format&fit=crop";
// //   if (t.includes("deluxe") || t.includes("king"))
// //     return "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1500&auto=format&fit=crop";
// //   if (t.includes("double") || t.includes("twin"))
// //     return "https://images.unsplash.com/photo-1560662657-22cc26372134?q=80&w=1500&auto=format&fit=crop";
// //   if (t.includes("single") || t.includes("standard"))
// //     return "https://images.unsplash.com/photo-1588667355106-96b5a76c8e31?q=80&w=1500&auto=format&fit=crop";

// //   return "https://images.unsplash.com/photo-1571896349141-93d6995641c2?q=80&w=1500&auto=format&fit=crop";
// // };

// // // TODAY DATE
// // const todayDate = () => {
// //   const d = new Date();
// //   return d.toISOString().split("T")[0];
// // };

// // export default function RoomDetails() {
// //   const { id } = useParams();

// //   const [room, setRoom] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const [checkIn, setCheckIn] = useState("");
// //   const [checkOut, setCheckOut] = useState("");
// //   const [available, setAvailable] = useState(null);
// //   const [checking, setChecking] = useState(false);

// //   // FETCH ROOM
// //   useEffect(() => {
// //     const fetchRoom = async () => {
// //       try {
// //         const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
// //         const json = await res.json();
// //         let data = json?.data || null;

// //         if (data && !data.image) {
// //           data.image = getRoomImageUrl(data.type_name);
// //         }

// //         setRoom(data);
// //       } catch (e) {
// //         console.error(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (id) fetchRoom();
// //   }, [id]);

// //   // ✅ CORRECT AVAILABILITY CHECK
// //   const checkAvailability = async () => {
// //     if (!checkIn || !checkOut) {
// //       alert("Select both dates");
// //       return;
// //     }

// //     if (new Date(checkOut) <= new Date(checkIn)) {
// //       alert("Check-out must be after check-in");
// //       return;
// //     }

// //     setChecking(true);
// //     setAvailable(null);

// //     try {
// //       const res = await fetch(
// //         "http://localhost:5000/api/bookings/check-availability",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             room_id: id,
// //             check_in: checkIn,
// //             check_out: checkOut,
// //           }),
// //         }
// //       );

// //       const data = await res.json();
// //       setAvailable(data.available === true);
// //     } catch (err) {
// //       console.error(err);
// //       setAvailable(false);
// //     } finally {
// //       setChecking(false);
// //     }
// //   };

// //   const handleBookNow = () => {
// //     const token = localStorage.getItem("hotel_token");
// //     if (!token) {
// //       window.location.href = `/login?redirect=/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
// //       return;
// //     }
// //     window.location.href = `/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
// //   };

// //   if (loading) return <div className="text-center mt-20">Loading...</div>;
// //   if (!room) return <div className="text-center mt-20">Room not found</div>;

// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       <Navbar />

// //       <div className="max-w-6xl mx-auto p-4 mt-8 grid md:grid-cols-2 gap-10">

// //         {/* LEFT */}
// //         <div>
// //           <div className="h-96 rounded-xl overflow-hidden shadow">
// //             <img src={room.image} className="w-full h-full object-cover" />
// //           </div>
// //         </div>

// //         {/* RIGHT */}
// //         <div>
// //           <h1 className="text-3xl font-bold">{room.type_name}</h1>
// //           <p className="text-xl text-indigo-600 font-bold mt-2">
// //             PKR {room.base_price}/night
// //           </p>

// //           <div className="mt-6 bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
// //             <label>Check-in</label>
// //             <input
// //               type="date"
// //               min={todayDate()}
// //               value={checkIn}
// //               onChange={(e) => {
// //                 setCheckIn(e.target.value);
// //                 setAvailable(null);
// //               }}
// //               className="w-full border p-2 rounded mb-3"
// //             />

// //             <label>Check-out</label>
// //             <input
// //               type="date"
// //               min={checkIn || todayDate()}
// //               value={checkOut}
// //               onChange={(e) => {
// //                 setCheckOut(e.target.value);
// //                 setAvailable(null);
// //               }}
// //               className="w-full border p-2 rounded mb-4"
// //             />

// //             <button
// //               onClick={checkAvailability}
// //               disabled={checking}
// //               className="w-full bg-indigo-600 text-white py-2 rounded"
// //             >
// //               {checking ? "Checking..." : "Check Availability"}
// //             </button>

// //             {available === true && (
// //               <p className="mt-4 text-green-600 font-bold">
// //                 Room is AVAILABLE
// //               </p>
// //             )}

// //             {available === false && (
// //               <p className="mt-4 text-red-600 font-bold">
// //                 Room is ALREADY BOOKED
// //               </p>
// //             )}

// //             {available === true && (
// //               <button
// //                 onClick={handleBookNow}
// //                 className="w-full mt-4 bg-green-600 text-white py-3 rounded text-lg font-bold"
// //               >
// //                 Book Now
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Navbar from "../../components/Navbar";

// // --- UPDATED IMAGE HELPER WITH RELIABLE LINKS ---
// const getRoomImageUrl = (typeName) => {
//   const t = typeName?.toLowerCase() || "";
  
//   // Using the same reliable high-res URLs from the RoomCard
//   if (t.includes("suite"))
//     return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80";
//   if (t.includes("deluxe") || t.includes("king"))
//     return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1500&q=80";
//   if (t.includes("double") || t.includes("twin"))
//     return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1500&q=80";
//   if (t.includes("single") || t.includes("standard"))
//     return "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=1500&q=80";

//   // Default fallback
//   return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=80";
// };

// // TODAY DATE
// const todayDate = () => {
//   const d = new Date();
//   return d.toISOString().split("T")[0];
// };

// export default function RoomDetails() {
//   const { id } = useParams();

//   const [room, setRoom] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [checkIn, setCheckIn] = useState("");
//   const [checkOut, setCheckOut] = useState("");
//   const [available, setAvailable] = useState(null);
//   const [checking, setChecking] = useState(false);

//   // FETCH ROOM
//   useEffect(() => {
//     const fetchRoom = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
//         const json = await res.json();
//         let data = json?.data || null;

//         // Priority logic: If API doesn't provide image, use our helper
//         if (data && !data.image) {
//           data.image = getRoomImageUrl(data.type_name);
//         }

//         setRoom(data);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchRoom();
//   }, [id]);

//   // ✅ AVAILABILITY CHECK
//   const checkAvailability = async () => {
//     if (!checkIn || !checkOut) {
//       alert("Select both dates");
//       return;
//     }

//     if (new Date(checkOut) <= new Date(checkIn)) {
//       alert("Check-out must be after check-in");
//       return;
//     }

//     setChecking(true);
//     setAvailable(null);

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/bookings/check-availability",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             room_id: id,
//             check_in: checkIn,
//             check_out: checkOut,
//           }),
//         }
//       );

//       const data = await res.json();
//       setAvailable(data.available === true);
//     } catch (err) {
//       console.error(err);
//       setAvailable(false);
//     } finally {
//       setChecking(false);
//     }
//   };

//   const handleBookNow = () => {
//     const token = localStorage.getItem("hotel_token");
//     if (!token) {
//       window.location.href = `/login?redirect=/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
//       return;
//     }
//     window.location.href = `/booking/${id}?check_in=${checkIn}&check_out=${checkOut}`;
//   };

//   if (loading) return <div className="text-center mt-20">Loading...</div>;
//   if (!room) return <div className="text-center mt-20">Room not found</div>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       <div className="max-w-6xl mx-auto p-4 mt-8 grid md:grid-cols-2 gap-10">

//         {/* LEFT */}
//         <div>
//           <div className="h-96 rounded-xl overflow-hidden shadow-lg bg-gray-200">
//             <img 
//               src={room.image} 
//               alt={room.type_name}
//               className="w-full h-full object-cover" 
//               onError={(e) => {
//                 e.target.onerror = null;
//                 // Safety fallback URL
//                 e.target.src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1500&q=80";
//               }}
//             />
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">{room.type_name}</h1>
//           <p className="text-xl text-indigo-600 font-bold mt-2">
//             PKR {room.base_price}/night
//           </p>

//           <div className="mt-6 bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
//             <input
//               type="date"
//               min={todayDate()}
//               value={checkIn}
//               onChange={(e) => {
//                 setCheckIn(e.target.value);
//                 setAvailable(null);
//               }}
//               className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
//             />

//             <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
//             <input
//               type="date"
//               min={checkIn || todayDate()}
//               value={checkOut}
//               onChange={(e) => {
//                 setCheckOut(e.target.value);
//                 setAvailable(null);
//               }}
//               className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
//             />

//             <button
//               onClick={checkAvailability}
//               disabled={checking}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-colors font-semibold"
//             >
//               {checking ? "Checking..." : "Check Availability"}
//             </button>

//             {available === true && (
//               <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
//                 <p className="text-green-700 font-bold text-center">
//                   ✓ Room is AVAILABLE
//                 </p>
//               </div>
//             )}

//             {available === false && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
//                 <p className="text-red-700 font-bold text-center">
//                   ✕ Room is ALREADY BOOKED
//                 </p>
//               </div>
//             )}

//             {available === true && (
//               <button
//                 onClick={handleBookNow}
//                 className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-bold shadow-md transition-all active:scale-95"
//               >
//                 Book Now
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

// --- UPDATED IMAGE HELPER WITH RELIABLE LINKS ---
const getRoomImageUrl = (typeName) => {
  const t = typeName?.toLowerCase() || "";
  
  if (t.includes("suite"))
    return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("deluxe") || t.includes("king"))
    return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("double") || t.includes("twin"))
    return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1500&q=80";
  if (t.includes("single") || t.includes("standard"))
    return "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=1500&q=80";

  return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1500&q=80";
};

// TODAY DATE
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

  // FETCH ROOM
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const json = await res.json();
        let data = json?.data || null;

        if (data && !data.image) {
          data.image = getRoomImageUrl(data.type_name);
        }

        setRoom(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id]);

  // ✅ AVAILABILITY CHECK
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
      const res = await fetch(
        "http://localhost:5000/api/bookings/check-availability",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: id,
            check_in: checkIn,
            check_out: checkOut,
          }),
        }
      );

      const data = await res.json();
      setAvailable(data.available === true);
    } catch (err) {
      console.error(err);
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

        {/* LEFT SECTION */}
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

          {/* ⭐ ADDED: AMENITIES SECTION BELOW IMAGE */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Room Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">📶</span>
                <span className="text-sm font-medium">Free High-Speed Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">❄️</span>
                <span className="text-sm font-medium">Air Conditioning</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">📺</span>
                <span className="text-sm font-medium">Smart TV with Netflix</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">☕</span>
                <span className="text-sm font-medium">Coffee & Tea Maker</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">🚿</span>
                <span className="text-sm font-medium">Hot & Cold Shower</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">🍳</span>
                <span className="text-sm font-medium">Free Breakfast</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{room.type_name}</h1>
          <p className="text-xl text-indigo-600 font-bold mt-2">
            PKR {room.base_price}/night
          </p>

          <div className="mt-6 bg-white p-6 rounded-xl shadow border-t-4 border-indigo-500">
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              type="date"
              min={todayDate()}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setAvailable(null);
              }}
              className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              type="date"
              min={checkIn || todayDate()}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setAvailable(null);
              }}
              className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              onClick={checkAvailability}
              disabled={checking}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-colors font-semibold"
            >
              {checking ? "Checking..." : "Check Availability"}
            </button>

            {available === true && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-green-700 font-bold text-center">
                  ✓ Room is AVAILABLE
                </p>
              </div>
            )}

            {available === false && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 font-bold text-center">
                  ✕ Room is ALREADY BOOKED
                </p>
              </div>
            )}

            {available === true && (
              <button
                onClick={handleBookNow}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-bold shadow-md transition-all active:scale-95"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
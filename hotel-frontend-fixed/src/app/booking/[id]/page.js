

// // File: BookingPage.jsx (Pro Design)

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import Navbar from "../../components/Navbar";

// // --- UI Helper: Get Image based on room type (Visual Enhancement Only) ---
// const getRoomImageUrl = (typeName) => {
//     const lowerCaseType = typeName ? typeName.toLowerCase() : "";
//     if (lowerCaseType.includes("suite")) return "https://images.unsplash.com/photo-1595562799309-8d77e0d3765e?q=80&w=1000&auto=format&fit=crop"; 
//     if (lowerCaseType.includes("deluxe") || lowerCaseType.includes("king")) return "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1000&auto=format&fit=crop";
//     return "https://images.unsplash.com/photo-1560662657-22cc26372134?q=80&w=1000&auto=format&fit=crop";
// };

// export default function BookingPage() {
//   const { id } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const check_in = searchParams.get("check_in");
//   const check_out = searchParams.get("check_out");

//   const [room, setRoom] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [dateError, setDateError] = useState("");

//   const today = new Date().toISOString().split("T")[0];

//   const maxDateObj = new Date();
//   maxDateObj.setMonth(maxDateObj.getMonth() + 4);
//   const maxAllowed = maxDateObj.toISOString().split("T")[0];

//   // LOGIC: Validate dates (UNCHANGED)
//   const validateDates = () => {
//     if (!check_in || !check_out) return "Invalid dates";
//     if (check_in < today) return "❌ Cannot book past dates";
//     if (check_out <= check_in) return "❌ Checkout must be after checkin";
//     if (check_out > maxAllowed) return `❌ Max booking allowed: ${maxAllowed}`;
//     return "";
//   };

//   useEffect(() => {
//     setDateError(validateDates());
//   }, [check_in, check_out]);

//   // LOGIC: Load room (UNCHANGED)
//   useEffect(() => {
//     if (!id) return;
//     const loadRoom = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
//         const json = await res.json();

//         const roomData = json.data || json;
        
//         // UI Fix: Add image if missing
//         if(roomData && !roomData.image) {
//             roomData.image = getRoomImageUrl(roomData.type_name);
//         }

//         setRoom(roomData);

//         const days =
//           (new Date(check_out) - new Date(check_in)) /
//           (1000 * 60 * 60 * 24);

//         setTotalPrice(days * roomData.base_price);
//       } catch (err) {
//         console.error(err);
//       }
//       setLoading(false);
//     };
//     loadRoom();
//   }, [id]);

//   // LOGIC: CREATE BOOKING (UNCHANGED)
//   const handleBooking = async () => {
//     if (dateError) return alert(dateError);

//     const token = localStorage.getItem("hotel_token");
//     if (!token) {
//       alert("Please login to continue");
//       return router.push("/login");
//     }

//     const res = await fetch("http://localhost:5000/api/bookings", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify({
//         room_id: id,
//         check_in,
//         check_out,
//       }),
//     });

//     const json = await res.json();

//     if (!res.ok) {
//       alert(json.message || "Booking failed");
//       return;
//     }

//     alert("Booking created successfully");
//     router.push(`/payment/${json.data.id}`);
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex items-center justify-center text-slate-500 font-medium text-lg">
//             <svg className="animate-spin h-6 w-6 mr-3 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//             Preparing your booking...
//         </div>
//     </div>
//   );

//   // Calculate nights for display
//   const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-4 py-12">
        
//         <div className="text-center mb-10">
//             <h1 className="text-3xl font-extrabold text-slate-800">Review & Confirm Booking</h1>
//             <p className="text-slate-500 mt-2">You are just one step away from your stay.</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
//             {/* LEFT SIDE: ROOM DETAILS CARD */}
//             <div className="lg:col-span-2 space-y-6">
                
//                 {/* Room Info Card */}
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
//                     <div className="h-56 w-full relative">
//                         <img 
//                             src={room.image} 
//                             alt={room.type_name} 
//                             className="w-full h-full object-cover"
//                         />
//                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase">
//                             Room #{room.room_number}
//                         </div>
//                     </div>
                    
//                     <div className="p-6">
//                         <h2 className="text-2xl font-bold text-slate-800 mb-2">{room.type_name}</h2>
//                         <p className="text-slate-600 leading-relaxed">
//                             {room.description || "Experience luxury and comfort with our premium room services and amenities."}
//                         </p>
                        
//                         <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
//                             <span className="flex items-center gap-1">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-2m2 0h-2m0 0H9m1.447 5.447C10.74 21.05 12 21 12 21h7.5M4 8v10h12V8a4 4 0 00-4-4H8a4 4 0 00-4 4z"></path></svg>
//                                 {room.capacity} Guests
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
//                                 Free Wi-Fi
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//             </div>

//             {/* RIGHT SIDE: BOOKING SUMMARY CARD */}
//             <div className="lg:col-span-1">
//                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-24">
//                     <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Booking Summary</h3>

//                     {/* Dates Display */}
//                     <div className="flex justify-between items-center mb-6 text-sm">
//                         <div>
//                             <p className="text-gray-500 mb-1">Check-in</p>
//                             <p className="font-semibold text-slate-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
//                                 {check_in}
//                             </p>
//                         </div>
//                         <div className="text-gray-400 mt-4">➝</div>
//                         <div className="text-right">
//                             <p className="text-gray-500 mb-1">Check-out</p>
//                             <p className="font-semibold text-slate-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
//                                 {check_out}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Error Message */}
//                     {dateError && (
//                         <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                             {dateError}
//                         </div>
//                     )}

//                     {/* Price Breakdown */}
//                     <div className="space-y-3 pt-2">
//                         <div className="flex justify-between text-slate-600">
//                             <span>Price per night</span>
//                             <span>PKR {room.base_price}</span>
//                         </div>
//                         <div className="flex justify-between text-slate-600">
//                             <span>Duration</span>
//                             <span>{nights} Nights</span>
//                         </div>
                        
//                         <div className="border-t pt-4 mt-4 flex justify-between items-center">
//                             <span className="font-bold text-lg text-slate-800">Total Price</span>
//                             <span className="font-extrabold text-2xl text-blue-600">
//                                 PKR {totalPrice}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Confirm Button */}
//                     <button
//                         onClick={handleBooking}
//                         disabled={!!dateError}
//                         className={`w-full py-4 mt-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
//                             dateError 
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
//                         }`}
//                     >
//                         Confirm Booking
//                     </button>
                    
//                     <p className="text-xs text-center text-gray-400 mt-4">
//                         Secure payment processing on the next step.
//                     </p>
//                 </div>
//             </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// File: BookingPage.jsx (Pro Design)

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

// --- UI Helper: Updated with reliable high-res URLs from previous pages ---
const getRoomImageUrl = (typeName) => {
    const t = typeName?.toLowerCase() || "";
    
    if (t.includes("suite"))
      return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80";
    if (t.includes("deluxe") || t.includes("king"))
      return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80";
    if (t.includes("double") || t.includes("twin"))
      return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80";
    if (t.includes("single") || t.includes("standard"))
      return "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=1000&q=80";

    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80";
};

export default function BookingPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const check_in = searchParams.get("check_in");
  const check_out = searchParams.get("check_out");

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateError, setDateError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 4);
  const maxAllowed = maxDateObj.toISOString().split("T")[0];

  // LOGIC: Validate dates (UNCHANGED)
  const validateDates = () => {
    if (!check_in || !check_out) return "Invalid dates";
    if (check_in < today) return "❌ Cannot book past dates";
    if (check_out <= check_in) return "❌ Checkout must be after checkin";
    if (check_out > maxAllowed) return `❌ Max booking allowed: ${maxAllowed}`;
    return "";
  };

  useEffect(() => {
    setDateError(validateDates());
  }, [check_in, check_out]);

  // LOGIC: Load room (UNCHANGED)
  useEffect(() => {
    if (!id) return;
    const loadRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const json = await res.json();

        const roomData = json.data || json;
        
        // UI Fix: Use the updated helper for consistency
        if(roomData && !roomData.image) {
            roomData.image = getRoomImageUrl(roomData.type_name);
        }

        setRoom(roomData);

        const days =
          (new Date(check_out) - new Date(check_in)) /
          (1000 * 60 * 60 * 24);

        setTotalPrice(days * roomData.base_price);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadRoom();
  }, [id]);

  // LOGIC: CREATE BOOKING (UNCHANGED)
  const handleBooking = async () => {
    if (dateError) return alert(dateError);

    const token = localStorage.getItem("hotel_token");
    if (!token) {
      alert("Please login to continue");
      return router.push("/login");
    }

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        room_id: id,
        check_in,
        check_out,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.message || "Booking failed");
      return;
    }

    alert("Booking created successfully");
    router.push(`/payment/${json.data.id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 font-medium text-lg">
            <svg className="animate-spin h-6 w-6 mr-3 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Preparing your booking...
        </div>
    </div>
  );

  const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        
        <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800">Review & Confirm Booking</h1>
            <p className="text-slate-500 mt-2">You are just one step away from your stay.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT SIDE: ROOM DETAILS CARD */}
            <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="h-56 w-full relative bg-gray-200">
                        <img 
                            src={room.image} 
                            alt={room.type_name} 
                            className="w-full h-full object-cover"
                            // Adding the safety fallback if the link fails
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80";
                            }}
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm uppercase">
                            Room #{room.room_number}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{room.type_name}</h2>
                        <p className="text-slate-600 leading-relaxed">
                            {room.description || "Experience luxury and comfort with our premium room services and amenities."}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-2m2 0h-2m0 0H9m1.447 5.447C10.74 21.05 12 21 12 21h7.5M4 8v10h12V8a4 4 0 00-4-4H8a4 4 0 00-4 4z"></path></svg>
                                {room.capacity} Guests
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                                Free Wi-Fi
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT SIDE: BOOKING SUMMARY CARD */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 sticky top-24">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Booking Summary</h3>

                    <div className="flex justify-between items-center mb-6 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Check-in</p>
                            <p className="font-semibold text-slate-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                {check_in}
                            </p>
                        </div>
                        <div className="text-gray-400 mt-4">➝</div>
                        <div className="text-right">
                            <p className="text-gray-500 mb-1">Check-out</p>
                            <p className="font-semibold text-slate-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                {check_out}
                            </p>
                        </div>
                    </div>

                    {dateError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {dateError}
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-slate-600">
                            <span>Price per night</span>
                            <span>PKR {room.base_price}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Duration</span>
                            <span>{nights} Nights</span>
                        </div>
                        
                        <div className="border-t pt-4 mt-4 flex justify-between items-center">
                            <span className="font-bold text-lg text-slate-800">Total Price</span>
                            <span className="font-extrabold text-2xl text-blue-600">
                                PKR {totalPrice}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={!!dateError}
                        className={`w-full py-4 mt-8 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] ${
                            dateError 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30"
                        }`}
                    >
                        Confirm Booking
                    </button>
                    
                    <p className="text-xs text-center text-gray-400 mt-4">
                        Secure payment processing on the next step.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}




// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import Navbar from "../../components/Navbar";

// // // // export default function MyBookings() {
// // // //   const [bookings, setBookings] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [filter, setFilter] = useState("all");

// // // //   const token =
// // // //     typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

// // // //   // LOAD BOOKINGS
// // // //   useEffect(() => {
// // // //     const load = async () => {
// // // //       if (!token) {
// // // //         alert("Please login to continue.");
// // // //         window.location.href = "/login";
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const res = await fetch(
// // // //           "http://localhost:5000/api/bookings/customer",
// // // //           {
// // // //             headers: { Authorization: `Bearer ${token}` },
// // // //           }
// // // //         );

// // // //         const json = await res.json();
// // // //         setBookings(json.data || []);
// // // //         setLoading(false);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         alert("Error loading bookings");
// // // //       }
// // // //     };

// // // //     load();
// // // //   }, []);

// // // //   // CANCEL BOOKING
// // // //   const cancelBooking = async (id) => {
// // // //     if (!confirm("Cancel this booking?")) return;

// // // //     try {
// // // //       const res = await fetch(
// // // //         `http://localhost:5000/api/bookings/${id}/cancel`,
// // // //         {
// // // //           method: "POST",
// // // //           headers: { Authorization: `Bearer ${token}` },
// // // //         }
// // // //       );

// // // //       const json = await res.json();

// // // //       if (!res.ok) {
// // // //         alert(json.message || "Cancel failed");
// // // //         return;
// // // //       }

// // // //       alert("Booking cancelled successfully.");

// // // //       setBookings((prev) =>
// // // //         prev.map((b) =>
// // // //           b.booking_id === id ? { ...b, booking_status: "cancelled" } : b
// // // //         )
// // // //       );
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       alert("Cancellation error");
// // // //     }
// // // //   };

// // // //   // FILTER LOGIC
// // // //   const filtered =
// // // //     filter === "upcoming"
// // // //       ? bookings.filter((b) => new Date(b.check_in) >= new Date())
// // // //       : filter === "past"
// // // //       ? bookings.filter((b) => new Date(b.check_out) < new Date())
// // // //       : bookings;

// // // //   // TIME CHECK FUNCTION — (disable cancel after 2 hours)
// // // //   const isWithinCancelTime = (created_at) => {
// // // //     const created = new Date(created_at);
// // // //     const diffHours =
// // // //       (Date.now() - created.getTime()) / (1000 * 60 * 60);

// // // //     return diffHours <= 2; // true → can cancel
// // // //   };

// // // //   if (loading)
// // // //     return (
// // // //       <div>
// // // //         <Navbar />
// // // //         <p className="text-center mt-10 text-gray-600">Loading...</p>
// // // //       </div>
// // // //     );

// // // //   return (
// // // //     <div>
// // // //       <Navbar />

// // // //       {/* HEADER */}
// // // //       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 mb-8">
// // // //         <div className="max-w-6xl mx-auto px-4">
// // // //           <h1 className="text-3xl font-bold">My Bookings</h1>
// // // //           <p className="text-gray-200 mt-1">Manage all your reservations.</p>
// // // //         </div>
// // // //       </div>

// // // //       <div className="max-w-6xl mx-auto px-4">
// // // //         {/* FILTER BUTTONS */}
// // // //         <div className="mb-6 flex gap-3">
// // // //           <button
// // // //             className={`px-4 py-2 rounded ${
// // // //               filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
// // // //             }`}
// // // //             onClick={() => setFilter("all")}
// // // //           >
// // // //             All
// // // //           </button>

// // // //           <button
// // // //             className={`px-4 py-2 rounded ${
// // // //               filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"
// // // //             }`}
// // // //             onClick={() => setFilter("upcoming")}
// // // //           >
// // // //             Upcoming
// // // //           </button>

// // // //           <button
// // // //             className={`px-4 py-2 rounded ${
// // // //               filter === "past" ? "bg-blue-600 text-white" : "bg-gray-200"
// // // //             }`}
// // // //             onClick={() => setFilter("past")}
// // // //           >
// // // //             Past
// // // //           </button>
// // // //         </div>

// // // //         {/* BOOKINGS LIST */}
// // // //         <div className="space-y-6">
// // // //           {filtered.map((b) => (
// // // //             <div
// // // //               key={b.booking_id}
// // // //               className="bg-white shadow-md p-5 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border"
// // // //             >
// // // //               {/* LEFT SIDE */}
// // // //               <div className="flex gap-4 items-center">
// // // //                 <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
// // // //                   IMG
// // // //                 </div>

// // // //                 <div>
// // // //                   <h3 className="text-xl font-semibold">
// // // //                     {b.type_name} – Room #{b.room_number}
// // // //                   </h3>

// // // //                   <p className="text-gray-600">
// // // //                     <strong>Check-in:</strong> {b.check_in}
// // // //                   </p>
// // // //                   <p className="text-gray-600">
// // // //                     <strong>Check-out:</strong> {b.check_out}
// // // //                   </p>

// // // //                   <p className="text-gray-700 font-medium mt-1">
// // // //                     💰 PKR {b.total_price}
// // // //                   </p>
// // // //                 </div>
// // // //               </div>

// // // //               {/* RIGHT SIDE */}
// // // //               <div className="text-right w-full md:w-auto">

// // // //                 {/* STATUS */}
// // // //                 <span
// // // //                   className={`px-3 py-1 rounded text-white text-sm ${
// // // //                     b.booking_status === "paid"
// // // //                       ? "bg-green-600"
// // // //                       : b.booking_status === "cancelled"
// // // //                       ? "bg-red-600"
// // // //                       : "bg-orange-500"
// // // //                   }`}
// // // //                 >
// // // //                   {b.booking_status}
// // // //                 </span>

// // // //                 <div className="mt-3 space-x-2">

// // // //                   {/* Pay Now */}
// // // //                   {b.booking_status === "pending" && (
// // // //                     <a
// // // //                       href={`/payment/${b.booking_id}`}
// // // //                       className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm"
// // // //                     >
// // // //                       Pay Now
// // // //                     </a>
// // // //                   )}

// // // //                   {/* Invoice */}
// // // //                   {b.booking_status === "paid" && (
// // // //                     <a
// // // //                       href={`/invoice/${b.booking_id}`}
// // // //                       className="inline-block bg-gray-800 text-white px-3 py-1 rounded text-sm"
// // // //                     >
// // // //                       Invoice
// // // //                     </a>
// // // //                   )}

// // // //                   {/* Cancel Button — ONLY IF PENDING AND WITHIN 2 HOURS */}
// // // //                   {b.booking_status === "pending" &&
// // // //                     isWithinCancelTime(b.created_at) && (
// // // //                       <button
// // // //                         onClick={() => cancelBooking(b.booking_id)}
// // // //                         className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm"
// // // //                       >
// // // //                         Cancel
// // // //                       </button>
// // // //                     )}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }


// // // // File: MyBookings.jsx (Pro-Level Design)

// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import Navbar from "../../components/Navbar";

// // // export default function MyBookings() {
// // //   const [bookings, setBookings] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [filter, setFilter] = useState("all");

// // //   const token =
// // //     typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

// // //   // LOGIC: LOAD BOOKINGS (Unchanged)
// // //   useEffect(() => {
// // //     const load = async () => {
// // //       if (!token) {
// // //         alert("Please login to continue.");
// // //         window.location.href = "/login";
// // //         return;
// // //       }

// // //       try {
// // //         const res = await fetch(
// // //           "http://localhost:5000/api/bookings/customer",
// // //           {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }
// // //         );

// // //         const json = await res.json();
// // //         setBookings(json.data || []);
// // //         setLoading(false);
// // //       } catch (err) {
// // //         console.error(err);
// // //         alert("Error loading bookings");
// // //       }
// // //     };

// // //     load();
// // //   }, []);

// // //   // LOGIC: CANCEL BOOKING (Unchanged)
// // //   const cancelBooking = async (id) => {
// // //     if (!confirm("Cancel this booking?")) return;

// // //     try {
// // //       const res = await fetch(
// // //         `http://localhost:5000/api/bookings/${id}/cancel`,
// // //         {
// // //           method: "POST",
// // //           headers: { Authorization: `Bearer ${token}` },
// // //         }
// // //       );

// // //       const json = await res.json();

// // //       if (!res.ok) {
// // //         alert(json.message || "Cancel failed");
// // //         return;
// // //       }

// // //       alert("Booking cancelled successfully.");

// // //       setBookings((prev) =>
// // //         prev.map((b) =>
// // //           b.booking_id === id ? { ...b, booking_status: "cancelled" } : b
// // //         )
// // //       );
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Cancellation error");
// // //     }
// // //   };

// // //   // LOGIC: FILTER & TIME CHECK (Unchanged)
// // //   const filtered =
// // //     filter === "upcoming"
// // //       ? bookings.filter((b) => new Date(b.check_in) >= new Date())
// // //       : filter === "past"
// // //       ? bookings.filter((b) => new Date(b.check_out) < new Date())
// // //       : bookings;

// // //   const isWithinCancelTime = (created_at) => {
// // //     const created = new Date(created_at);
// // //     const diffHours =
// // //       (Date.now() - created.getTime()) / (1000 * 60 * 60);

// // //     return diffHours <= 2; // true → can cancel
// // //   };

// // //   if (loading)
// // //     return (
// // //       <div>
// // //         <Navbar />
// // //         <div className="text-center mt-20 p-4">
// // //             <svg className="animate-spin h-8 w-8 text-blue-600 inline-block mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
// // //             <p className="text-lg text-gray-700 font-medium">Loading your reservations...</p>
// // //         </div>
// // //       </div>
// // //     );

// // //   return (
// // //     <div>
// // //       <Navbar />

// // //       {/* ⭐ PRO HEADER DESIGN */}
// // //       <div className="bg-slate-800 text-white py-16 mb-10 shadow-xl">
// // //         <div className="max-w-6xl mx-auto px-4">
// // //           <h1 className="text-4xl font-extrabold tracking-tight">Your Reservations</h1>
// // //           <p className="text-gray-300 mt-2 text-lg">Manage all your upcoming and past bookings in one place.</p>
// // //         </div>
// // //       </div>

// // //       <div className="max-w-6xl mx-auto px-4">
// // //         {/* ⭐ FILTER BUTTONS DESIGN */}
// // //         <div className="mb-8 flex gap-4 border-b border-gray-200 pb-3">
// // //           {["all", "upcoming", "past"].map((f) => (
// // //             <button
// // //               key={f}
// // //               className={`
// // //                 px-5 py-2 text-sm font-semibold rounded-full transition duration-200
// // //                 ${
// // //                   filter === f
// // //                     ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
// // //                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
// // //                 }
// // //               `}
// // //               onClick={() => setFilter(f)}
// // //             >
// // //               {f.charAt(0).toUpperCase() + f.slice(1)} Bookings
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* ⭐ BOOKINGS LIST */}
// // //         <div className="space-y-6">
// // //           {filtered.length === 0 ? (
// // //              <p className="text-center text-lg text-gray-500 p-8 border rounded-lg bg-gray-50">
// // //                 You have no {filter} bookings.
// // //             </p>
// // //           ) : (
// // //             filtered.map((b) => (
// // //               // ⭐ PRO BOOKING CARD DESIGN
// // //               <div
// // //                 key={b.booking_id}
// // //                 className="bg-white shadow-lg p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100 transition duration-300 hover:shadow-xl hover:border-blue-500/30"
// // //               >
// // //                 {/* LEFT SIDE: Details */}
// // //                 <div className="flex gap-6 items-start">
                  
// // //                   {/* Image Placeholder */}
// // //                   <div className="w-28 h-28 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-sm font-semibold flex-shrink-0 border border-blue-200">
// // //                     {/* Yahan Room ki Image lag sakti hai */}
// // //                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3h3v3m-3 0h3"></path></svg>
// // //                   </div>

// // //                   <div>
// // //                     <h3 className="text-2xl font-bold text-slate-800 mb-1">
// // //                       {b.type_name} – Room #{b.room_number}
// // //                     </h3>

// // //                     <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
// // //                         <p className="text-gray-600">
// // //                             <span className="font-semibold text-slate-700">Check-in:</span> {b.check_in}
// // //                         </p>
// // //                         <p className="text-gray-600">
// // //                             <span className="font-semibold text-slate-700">Check-out:</span> {b.check_out}
// // //                         </p>
// // //                     </div>

// // //                     <p className="text-xl text-green-600 font-extrabold mt-3">
// // //                       💰 PKR {b.total_price}
// // //                     </p>
// // //                   </div>
// // //                 </div>

// // //                 {/* RIGHT SIDE: Status & Actions */}
// // //                 <div className="flex flex-col items-start md:items-end w-full md:w-auto space-y-3">

// // //                   {/* ⭐ STATUS BADGE DESIGN */}
// // //                   <span
// // //                     className={`
// // //                       px-3 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md
// // //                       ${
// // //                         b.booking_status === "paid"
// // //                           ? "bg-green-600"
// // //                           : b.booking_status === "cancelled"
// // //                           ? "bg-red-600"
// // //                           : "bg-orange-500" // pending
// // //                       }
// // //                     `}
// // //                   >
// // //                     {b.booking_status}
// // //                   </span>

// // //                   {/* ⭐ ACTION BUTTONS DESIGN */}
// // //                   <div className="flex space-x-2">

// // //                     {/* Pay Now */}
// // //                     {b.booking_status === "pending" && (
// // //                       <a
// // //                         href={`/payment/${b.booking_id}`}
// // //                         className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition duration-150 shadow-md"
// // //                       >
// // //                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0l-1-1m1 1l1-1m-1 1v4a2 2 0 002 2h10a2 2 0 002-2v-4m-6 4l-1-1m1 1l1-1"></path></svg>
// // //                         Pay Now
// // //                       </a>
// // //                     )}

// // //                     {/* Invoice */}
// // //                     {b.booking_status === "paid" && (
// // //                       <a
// // //                         href={`/invoice/${b.booking_id}`}
// // //                         className="inline-flex items-center bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition duration-150 shadow-md"
// // //                       >
// // //                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
// // //                         Invoice
// // //                       </a>
// // //                     )}

// // //                     {/* Cancel Button — ONLY IF PENDING AND WITHIN 2 HOURS */}
// // //                     {b.booking_status === "pending" &&
// // //                       isWithinCancelTime(b.created_at) && (
// // //                         <button
// // //                           onClick={() => cancelBooking(b.booking_id)}
// // //                           className="inline-flex items-center border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition duration-150"
// // //                         >
// // //                           <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
// // //                           Cancel
// // //                         </button>
// // //                       )}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // // File: MyBookings.jsx (Pro Design with Live Countdown)

// // "use client";

// // import { useEffect, useState, useMemo } from "react";
// // import Navbar from "../../../app/components/Navbar";

// // // =======================================================
// // // 1. HELPER FUNCTIONS
// // // =======================================================

// // // Helper function for user-friendly date formatting
// // const formatDate = (dateString, includeTime = true) => {
// //   if (!dateString) return "N/A";
// //   return new Date(dateString).toLocaleDateString("en-US", {
// //     year: "numeric",
// //     month: "short",
// //     day: "numeric",
// //     ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
// //   });
// // };

// // // TIME CHECK FUNCTION — (disable cancel after 2 hours)
// // const isWithinCancelTime = (created_at) => {
// //   const created = new Date(created_at);
// //   const diffHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
// //   return diffHours <= 2; // true → can cancel
// // };

// // // =======================================================
// // // 2. NEW COUNTDOWN TIMER COMPONENT
// // // =======================================================

// // const CountdownTimer = ({ created_at, onExpiry }) => {
// //   const expiryTime = new Date(created_at).getTime() + (2 * 60 * 60 * 1000); // 2 hours in ms
  
// //   const calculateRemainingTime = () => {
// //     const remainingMs = expiryTime - Date.now();
// //     if (remainingMs <= 0) {
// //       onExpiry();
// //       return "00m 00s";
// //     }

// //     const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
// //     const seconds = Math.floor((remainingMs / 1000) % 60);

// //     const format = (num) => String(num).padStart(2, '0');
// //     return `${format(minutes)}m ${format(seconds)}s`;
// //   };

// //   const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime());

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setTimeRemaining(calculateRemainingTime());
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   }, []); // expiryTime dependency ki zaroorat nahi kyunki calculateRemainingTime() mein Date.now() hai

// //   return <span className="font-extrabold text-lg">{timeRemaining}</span>;
// // };


// // // =======================================================
// // // 3. MAIN MyBookings COMPONENT
// // // =======================================================

// // export default function MyBookings() {
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [view, setView] = useState("upcoming");
  
// //   // State to track if any timer expired to force a re-render/re-filter
// //   const [timerExpiredCount, setTimerExpiredCount] = useState(0); 

// //   const token =
// //     typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

// //   // LOAD BOOKINGS (No change in logic)
// //   useEffect(() => {
// //     const load = async () => {
// //       if (!token) {
// //         alert("Please login to continue.");
// //         window.location.href = "/login"; 
// //         return;
// //       }

// //       try {
// //         const res = await fetch(
// //           "http://localhost:5000/api/bookings/customer",
// //           {
// //             headers: { Authorization: `Bearer ${token}` },
// //           }
// //         );

// //         const json = await res.json();
// //         setBookings(json.data || []);
// //         setLoading(false);
// //       } catch (err) {
// //         console.error(err);
// //         alert("Error loading bookings");
// //       }
// //     };

// //     load();
// //     // Added timerExpiredCount to dependency array to re-load if a cancellation timer expires
// //   }, [token, timerExpiredCount]); 

// //   // CANCEL BOOKING (No change in logic)
// //   const cancelBooking = async (id, price) => {
// //     if (!confirm(`Are you sure you want to cancel this booking (PKR ${price})? This action is irreversible.`)) return;

// //     try {
// //       // NOTE: Here you might want to check the server response to see if cancellation was successful
// //       const res = await fetch(
// //         `http://localhost:5000/api/bookings/${id}/cancel`,
// //         {
// //           method: "POST",
// //           headers: { Authorization: `Bearer ${token}` },
// //         }
// //       );

// //       const json = await res.json();

// //       if (!res.ok) {
// //         alert(json.message || "Cancellation failed");
// //         return;
// //       }

// //       alert("Booking successfully cancelled. Your potential credit amount is: PKR " + price);

// //       setBookings((prev) =>
// //         prev.map((b) =>
// //           b.booking_id === id 
// //             ? { ...b, booking_status: "cancelled", refund_due: true }
// //             : b
// //         )
// //       );
// //     } catch (err) {
// //       console.error(err);
// //       alert("Cancellation error");
// //     }
// //   };

// //   // --- FILTERED AND REFUND LOGIC ---

// //   // Filter bookings based on the current view (Added timerExpiredCount to re-calculate on expiry)
// //   const filteredBookings = useMemo(() => {
// //     const now = new Date();
    
// //     switch (view) {
// //       case "upcoming":
// //         // Upcoming = Check-in date is >= today AND not cancelled
// //         return bookings.filter((b) => new Date(b.check_in) >= now && b.booking_status !== 'cancelled');
// //       case "past":
// //         // Past = Check-out date is < today AND not cancelled
// //         return bookings.filter((b) => new Date(b.check_out) < now && b.booking_status !== 'cancelled');
// //       case "cancelled":
// //         return bookings.filter((b) => b.booking_status === 'cancelled');
// //       default:
// //         return bookings;
// //     }
// //   }, [bookings, view, timerExpiredCount]); // Added dependency

// //   const totalCreditDue = useMemo(() => {
// //     return bookings
// //       .filter(b => b.booking_status === 'cancelled' && b.refund_due !== false)
// //       .reduce((sum, b) => sum + (b.total_price || 0), 0)
// //       .toLocaleString('en-US');
// //   }, [bookings]);


// //   if (loading)
// //     return (
// //       <div className="bg-gray-50 min-h-screen">
// //         <Navbar />
// //         <div className="max-w-6xl mx-auto px-4 py-20 text-center">
// //             <svg className="animate-spin mx-auto h-8 w-8 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
// //             <p className="mt-3 text-lg text-gray-600">Loading your reservations...</p>
// //         </div>
// //       </div>
// //     );

// //   // --- RENDER START ---
// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       <Navbar />

// //       {/* HEADER SECTION */}
// //       <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 mb-8 shadow-xl">
// //         <div className="max-w-6xl mx-auto px-4">
// //           <h1 className="text-4xl font-extrabold flex items-center gap-3">
// //             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
// //             My Reservations
// //           </h1>
// //           <p className="text-blue-200 mt-2 text-lg">Your portal to manage all past and upcoming stays.</p>
// //         </div>
// //       </div>
// //       {/* --------------------- */}

// //       <div className="max-w-6xl mx-auto px-4">
        
// //         {/* VIEW/FILTER TABS */}
// //         <div className="mb-8 border-b border-gray-200">
// //           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
// //             {['upcoming', 'past', 'cancelled', 'credit'].map((tab) => (
// //               <button
// //                 key={tab}
// //                 onClick={() => setView(tab)}
// //                 className={`
// //                   ${view === tab
// //                     ? 'border-blue-600 text-blue-600 font-bold'
// //                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
// //                   }
// //                   whitespace-nowrap py-4 px-1 border-b-2 text-lg transition duration-200 capitalize
// //                 `}
// //               >
// //                 {tab === 'credit' ? 'Refund/Credit' : tab}
// //               </button>
// //             ))}
// //           </nav>
// //         </div>
        
// //         {/* --- MAIN CONTENT AREA --- */}

// //         {view !== 'credit' ? (
// //           /* BOOKINGS LIST VIEW */
// //           <div className="space-y-6">
// //             {filteredBookings.length === 0 ? (
// //                 <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
// //                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
// //                     <h3 className="mt-2 text-xl font-medium text-gray-900">No {view} bookings found.</h3>
// //                     <p className="mt-1 text-gray-500">Time to plan your next luxurious stay!</p>
// //                 </div>
// //             ) : (
// //                 filteredBookings.map((b) => {
// //                     const statusColor = 
// //                         b.booking_status === "paid" ? "bg-green-100 text-green-800 border-green-200" :
// //                         b.booking_status === "cancelled" ? "bg-red-100 text-red-800 border-red-200" :
// //                         "bg-orange-100 text-orange-800 border-orange-200";

// //                     const canCancel = b.booking_status === "pending" && isWithinCancelTime(b.created_at);
                    
// //                     return (
// //                         <div
// //                             key={b.booking_id}
// //                             className="bg-white shadow-xl hover:shadow-2xl transition duration-300 p-6 rounded-xl flex flex-col lg:flex-row justify-between items-start border border-gray-200"
// //                         >
// //                             {/* LEFT/MAIN INFO */}
// //                             <div className="flex gap-6 items-start w-full lg:w-3/4">
// //                                 <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 border border-gray-300 shadow-inner">
                                    
// //                                 </div>

// //                                 <div>
// //                                     <h3 className="text-2xl font-bold text-gray-900">
// //                                         {b.type_name} <span className="text-gray-500 font-medium text-lg">| Room #{b.room_number}</span>
// //                                     </h3>
                                    
// //                                     <div className="grid grid-cols-2 mt-2 gap-y-1 text-sm text-gray-600">
// //                                         <p><strong>Check-in:</strong> {formatDate(b.check_in, false)}</p>
// //                                         <p><strong>Check-out:</strong> {formatDate(b.check_out, false)}</p>
// //                                         <p className="col-span-2"><strong>Booked On:</strong> {formatDate(b.created_at)}</p>
// //                                     </div>

// //                                     {/* PRICE */}
// //                                     <p className="text-2xl font-extrabold text-blue-600 mt-3">
// //                                         PKR {b.total_price.toLocaleString('en-US')}
// //                                     </p>
// //                                 </div>
// //                             </div>

// //                             {/* RIGHT/ACTIONS & STATUS */}
// //                             <div className="w-full lg:w-1/4 pt-4 lg:pt-0 text-left lg:text-right space-y-3">

// //                                 {/* STATUS TAG */}
// //                                 <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wider ${statusColor}`}>
// //                                     {b.booking_status}
// //                                 </span>

// //                                 {/* ACTION BUTTONS */}
// //                                 <div className="space-x-2 flex lg:justify-end">
// //                                     {/* Pay Now */}
// //                                     {b.booking_status === "pending" && (
// //                                         <a
// //                                             href={`/payment/${b.booking_id}`}
// //                                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
// //                                         >
// //                                             Pay Now
// //                                         </a>
// //                                     )}

// //                                     {/* Invoice */}
// //                                     {b.booking_status === "paid" && (
// //                                         <a
// //                                             href={`/invoice/${b.booking_id}`}
// //                                             className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
// //                                         >
// //                                             View Invoice
// //                                         </a>
// //                                     )}
// //                                 </div>
                                
// //                                 {/* CANCELLATION INFO & BUTTON */}
// //                                 <div className="text-sm">
// //                                     {b.booking_status === "pending" && (
// //                                         <div className="mt-3 p-3 border border-red-300 rounded-lg bg-red-50 text-red-700">
// //                                             <p className="font-semibold flex items-center justify-between">
// //                                                 <span>Cancellation Window:</span>
// //                                                 {canCancel ? (
// //                                                     <CountdownTimer 
// //                                                         created_at={b.created_at} 
// //                                                         onExpiry={() => setTimerExpiredCount(prev => prev + 1)} // Timer expire hone par re-render/re-filter force karega
// //                                                     />
// //                                                 ) : (
// //                                                     <span className="font-extrabold text-lg">Expired</span>
// //                                                 )}
// //                                             </p>

// //                                             {canCancel && (
// //                                                 <div className="mt-2">
// //                                                     <button
// //                                                         onClick={() => cancelBooking(b.booking_id, b.total_price.toLocaleString('en-US'))}
// //                                                         className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
// //                                                     >
// //                                                         Cancel Booking
// //                                                     </button>
// //                                                 </div>
// //                                             )}
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     );
// //                 })
// //             )}
// //           </div>
// //         ) : (
          
// //           /* REFUND/CREDIT TAB VIEW (UNCHANGED) */
// //           <div className="space-y-8">
// //             <div className="bg-white p-6 rounded-xl shadow-xl border border-blue-200">
// //                 <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Refund & Credit Status</h3>
                
// //                 <p className="text-gray-700 mb-4">
// //                     Below is the potential credit amount due from your cancelled bookings. Please note that refunds are not automatic and require manual processing.
// //                 </p>

// //                 <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
// //                     <p className="text-lg font-bold text-blue-800">Total Credit Due:</p>
// //                     <p className="text-4xl font-extrabold text-blue-900 mt-1">PKR {totalCreditDue}</p>
// //                 </div>
                
// //                 <h4 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Next Steps for Refund Processing</h4>
// //                 <p className="text-gray-700">
// //                     To initiate the refund or apply the credit to a future booking, please **contact our Administration Team directly** using the details below. Provide your **Booking ID(s)** for faster assistance.
// //                 </p>

// //                 <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-2">
// //                     <p className="font-bold text-lg text-gray-800">Admin Contact Details:</p>
// //                     <p className="text-gray-700 flex items-center gap-2">
// //                         <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1.5 4-4 1.5 4 1.5-1.5 4H5a2 2 0 01-2-2v-3zm0 0l-1 1m0 0l1 1m0 0v-2m0 2l-1 1m0 0l1 1m0 0v-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m0-4a2 2 0 012-2h8a2 2 0 01-2 2v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"></path></svg>
// //                         <strong>Phone:</strong> +92 21 1234 567 (Available 9 AM - 5 PM PKT)
// //                     </p>
// //                     <p className="text-gray-700 flex items-center gap-2">
// //                         <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
// //                         <strong>Email:</strong> finance@thevelvetdoor.com
// //                     </p>
// //                 </div>
// //             </div>
            
// //             {/* List of Cancelled Bookings */}
// //             <h4 className="text-xl font-semibold text-gray-900">Cancelled Reservations</h4>
// //             <div className="space-y-4">
// //                 {bookings
// //                   .filter(b => b.booking_status === 'cancelled')
// //                   .map(b => (
// //                     <div key={b.booking_id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
// //                         <div>
// //                             <p className="font-semibold text-gray-900">{b.type_name} - ID: {b.booking_id}</p>
// //                             <p className="text-sm text-gray-500">Cancelled on: {formatDate(b.created_at)}</p>
// //                         </div>
// //                         <p className="text-xl font-extrabold text-red-600">PKR {b.total_price.toLocaleString('en-US')}</p>
// //                     </div>
// //                 ))}
// //                 {bookings.filter(b => b.booking_status === 'cancelled').length === 0 && (
// //                      <p className="text-center py-4 text-gray-500 bg-white rounded-lg border">No cancelled bookings available for credit.</p>
// //                 )}
// //             </div>

// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }













// // File: src/app/customer/my-bookings/page.jsx  (or wherever your MyBookings component lives)
// "use client";

// import { useEffect, useState, useMemo, useCallback } from "react";
// import Navbar from "../../../app/components/Navbar";

// /*
//   Updated MyBookings component
//   - Robust parsing of backend fields
//   - Safe checks for missing fields
//   - 2-hour cancel window with live countdown
//   - Filters: upcoming / past / cancelled / credit
//   - Cancel flow uses /api/bookings/:id/cancel (POST) and updates UI on success
//   - Uses localStorage token (hotel_token) — same as your project
// */

// // ---------- Helpers ----------
// const safeDate = (d) => {
//   // Accept Date, timestamp, or string. Return Date object or null.
//   if (!d) return null;
//   try {
//     const date = new Date(d);
//     if (isNaN(date.getTime())) return null;
//     return date;
//   } catch {
//     return null;
//   }
// };

// const formatDate = (dateInput, includeTime = true) => {
//   const date = safeDate(dateInput);
//   if (!date) return "N/A";
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
//   });
// };

// // Cancel window (2 hours) based on created_at
// const isWithinCancelTime = (created_at, windowHours = 2) => {
//   const created = safeDate(created_at);
//   if (!created) return false;
//   const diffHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
//   return diffHours <= windowHours;
// };

// // ---------- CountdownTimer ----------
// const CountdownTimer = ({ created_at, onExpiry }) => {
//   const created = safeDate(created_at);
//   if (!created) return <span className="font-extrabold text-lg">00m 00s</span>;

//   const expiryTime = created.getTime() + 2 * 60 * 60 * 1000; // 2 hours

//   const calc = () => {
//     const remainingMs = expiryTime - Date.now();
//     if (remainingMs <= 0) return { finished: true, text: "00m 00s" };

//     const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
//     const seconds = Math.floor((remainingMs / 1000) % 60);
//     const pad = (n) => String(n).padStart(2, "0");
//     return { finished: false, text: `${pad(minutes)}m ${pad(seconds)}s` };
//   };

//   const [{ text }, setState] = useState(calc);

//   useEffect(() => {
//     const t = setInterval(() => {
//       const next = calc();
//       setState(next);
//       if (next.finished) {
//         if (typeof onExpiry === "function") onExpiry();
//       }
//     }, 1000);

//     return () => clearInterval(t);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [created_at]);

//   return <span className="font-extrabold text-lg">{text}</span>;
// };

// // ---------- Main Component ----------
// export default function MyBookings() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("upcoming"); // upcoming | past | cancelled | credit
//   const [timerExpiredCount, setTimerExpiredCount] = useState(0);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

//   // Fetch bookings for the logged-in customer
//   const loadBookings = useCallback(async () => {
//     setLoading(true);
//     setErrorMsg(null);

//     if (!token) {
//       alert("Please login to continue.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/bookings/customer", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // If your backend returns success wrappers, handle gracefully
//       const json = await res.json();

//       // Prefer `data` property if present
//       const list = json?.data ?? json ?? [];

//       if (!Array.isArray(list)) {
//         // If backend returned single object, try to wrap
//         setBookings([]);
//         setErrorMsg("Unexpected bookings response from server.");
//         setLoading(false);
//         return;
//       }

//       // Normalize each booking item to ensure required fields exist & correct types
//       const normalized = list.map((b) => {
//         return {
//           booking_id: b.booking_id ?? b.id ?? b.bookingId ?? null,
//           room_id: b.room_id ?? b.roomId ?? null,
//           customer_id: b.customer_id ?? b.customerId ?? null,
//           check_in: b.check_in ?? b.checkIn ?? b.check_in_date ?? null,
//           check_out: b.check_out ?? b.checkOut ?? b.check_out_date ?? null,
//           total_price: Number(b.total_price ?? b.totalPrice ?? b.price ?? 0) || 0,
//           booking_status: (b.booking_status ?? b.status ?? "").toLowerCase() || "pending",
//           created_at: b.created_at ?? b.createdAt ?? b.created ?? null,
//           room_number: b.room_number ?? b.roomNumber ?? (b.room && b.room.number) ?? null,
//           type_name: b.type_name ?? b.typeName ?? (b.room_type && b.room_type.name) ?? null,
//           base_price: Number(b.base_price ?? b.basePrice ?? 0) || 0,
//           // keep original raw for debugging if needed
//           __raw: b,
//         };
//       });

//       setBookings(normalized);
//     } catch (err) {
//       console.error("Bookings load error:", err);
//       setErrorMsg("Error loading bookings. Check server.");
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     loadBookings();
//   }, [loadBookings, timerExpiredCount]);

//   // Cancel booking
//   const cancelBooking = async (id, price) => {
//     if (!confirm(`Are you sure you want to cancel this booking (PKR ${price})? This action is irreversible.`)) return;

//     if (!token) {
//       alert("Please login to continue.");
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         alert(json.message || json.error || "Cancellation failed");
//         return;
//       }

//       // Update local state to show cancelled & mark refund_due true
//       setBookings((prev) =>
//         prev.map((b) =>
//           b.booking_id === id ? { ...b, booking_status: "cancelled", refund_due: true, created_at: b.created_at ?? new Date().toISOString() } : b
//         )
//       );

//       alert("Booking successfully cancelled. Your potential credit amount is: PKR " + (Number(price) || 0).toLocaleString("en-US"));

//     } catch (err) {
//       console.error("Cancellation error:", err);
//       alert("Cancellation error. Try again later.");
//     }
//   };

//   // Filter logic
//   const filteredBookings = useMemo(() => {
//     const now = new Date();

//     // helper to determine compare dates safely
//     const parseDate = (d) => safeDate(d);

//     switch (view) {
//       case "upcoming":
//         return bookings.filter((b) => {
//           if (b.booking_status === "cancelled") return false;
//           const checkIn = parseDate(b.check_in);
//           if (!checkIn) return false;
//           // Keep bookings whose check-in is today or in future
//           // Compare only Date part for "today" behavior
//           return checkIn.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0);
//         });
//       case "past":
//         return bookings.filter((b) => {
//           if (b.booking_status === "cancelled") return false;
//           const checkOut = parseDate(b.check_out);
//           if (!checkOut) return false;
//           // Past = check-out before today
//           return checkOut.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
//         });
//       case "cancelled":
//         return bookings.filter((b) => (b.booking_status ?? "") === "cancelled");
//       case "credit":
//         // For credit view we still return cancelled bookings (handled separately in UI)
//         return bookings.filter((b) => (b.booking_status ?? "") === "cancelled");
//       default:
//         return bookings;
//     }
//   }, [bookings, view, timerExpiredCount]);

//   // Total credit due from cancelled bookings
//   const totalCreditDue = useMemo(() => {
//     const sum = bookings
//       .filter((b) => (b.booking_status ?? "") === "cancelled" && b.refund_due !== false)
//       .reduce((acc, b) => acc + (Number(b.total_price) || 0), 0);
//     return sum.toLocaleString("en-US");
//   }, [bookings]);

//   // Loading UI
//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Navbar />
//         <div className="max-w-6xl mx-auto px-4 py-20 text-center">
//           <svg className="animate-spin mx-auto h-8 w-8 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//           <p className="mt-3 text-lg text-gray-600">Loading your reservations...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error UI
//   if (errorMsg) {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-4 py-20 text-center">
//           <div className="bg-white p-8 rounded-lg shadow">
//             <h3 className="text-xl font-semibold mb-2">Unable to load bookings</h3>
//             <p className="text-gray-600 mb-4">{errorMsg}</p>
//             <button onClick={() => loadBookings()} className="px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main UI render
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 mb-8 shadow-xl">
//         <div className="max-w-6xl mx-auto px-4">
//           <h1 className="text-4xl font-extrabold flex items-center gap-3">
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
//             My Reservations
//           </h1>
//           <p className="text-blue-200 mt-2 text-lg">Your portal to manage all past and upcoming stays.</p>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4">
//         {/* Tabs */}
//         <div className="mb-8 border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
//             {["upcoming", "past", "cancelled", "credit"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setView(tab)}
//                 className={`${
//                   view === tab ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 } whitespace-nowrap py-4 px-1 border-b-2 text-lg transition duration-200 capitalize`}
//               >
//                 {tab === "credit" ? "Refund/Credit" : tab}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Content */}
//         {view !== "credit" ? (
//           <div className="space-y-6">
//             {filteredBookings.length === 0 ? (
//               <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
//                 <h3 className="mt-2 text-xl font-medium text-gray-900">No {view} bookings found.</h3>
//                 <p className="mt-1 text-gray-500">Time to plan your next luxurious stay!</p>
//               </div>
//             ) : (
//               filteredBookings.map((b) => {
//                 const status = (b.booking_status ?? "pending").toString();
//                 const statusColor =
//                   status === "paid"
//                     ? "bg-green-100 text-green-800 border-green-200"
//                     : status === "cancelled"
//                     ? "bg-red-100 text-red-800 border-red-200"
//                     : "bg-orange-100 text-orange-800 border-orange-200";

//                 const canCancel = status === "pending" && isWithinCancelTime(b.created_at);

//                 return (
//                   <div
//                     key={b.booking_id || Math.random()}
//                     className="bg-white shadow-xl hover:shadow-2xl transition duration-300 p-6 rounded-xl flex flex-col lg:flex-row justify-between items-start border border-gray-200"
//                   >
//                     {/* Left */}
//                     <div className="flex gap-6 items-start w-full lg:w-3/4">
//                       <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 border border-gray-300 shadow-inner">
//                         {/* optional image or icon */}
//                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2M7 7v10"></path></svg>
//                       </div>

//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900">
//                           {b.type_name ?? "Room"}{" "}
//                           <span className="text-gray-500 font-medium text-lg">| Room #{b.room_number ?? "—"}</span>
//                         </h3>

//                         <div className="grid grid-cols-2 mt-2 gap-y-1 text-sm text-gray-600">
//                           <p><strong>Check-in:</strong> {formatDate(b.check_in, false)}</p>
//                           <p><strong>Check-out:</strong> {formatDate(b.check_out, false)}</p>
//                           <p className="col-span-2"><strong>Booked On:</strong> {formatDate(b.created_at)}</p>
//                         </div>

//                         <p className="text-2xl font-extrabold text-blue-600 mt-3">
//                           PKR {(Number(b.total_price) || 0).toLocaleString("en-US")}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Right */}
//                     <div className="w-full lg:w-1/4 pt-4 lg:pt-0 text-left lg:text-right space-y-3">
//                       <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wider ${statusColor}`}>
//                         {status}
//                       </span>

//                       <div className="space-x-2 flex lg:justify-end">
//                         {status === "pending" && (
//                           <a href={`/payment/${b.booking_id}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md">
//                             Pay Now
//                           </a>
//                         )}

//                         {status === "paid" && (
//                           <a href={`/invoice/${b.booking_id}`} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md">
//                             View Invoice
//                           </a>
//                         )}
//                       </div>

//                       {/* Cancellation box */}
//                       <div className="text-sm">
//                         {status === "pending" && (
//                           <div className="mt-3 p-3 border border-red-300 rounded-lg bg-red-50 text-red-700">
//                             <p className="font-semibold flex items-center justify-between">
//                               <span>Cancellation Window:</span>
//                               {canCancel ? (
//                                 <CountdownTimer
//                                   created_at={b.created_at}
//                                   onExpiry={() => setTimerExpiredCount((p) => p + 1)}
//                                 />
//                               ) : (
//                                 <span className="font-extrabold text-lg">Expired</span>
//                               )}
//                             </p>

//                             {canCancel && (
//                               <div className="mt-2">
//                                 <button
//                                   onClick={() => cancelBooking(b.booking_id, b.total_price)}
//                                   className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md"
//                                 >
//                                   Cancel Booking
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         ) : (
//           /* Refund / Credit tab */
//           <div className="space-y-8">
//             <div className="bg-white p-6 rounded-xl shadow-xl border border-blue-200">
//               <h3 className="text-2xl font-bold text-blue-600 mb-4">💰 Refund & Credit Status</h3>

//               <p className="text-gray-700 mb-4">
//                 Below is the potential credit amount due from your cancelled bookings. Please note that refunds are not automatic and require manual processing.
//               </p>

//               <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
//                 <p className="text-lg font-bold text-blue-800">Total Credit Due:</p>
//                 <p className="text-4xl font-extrabold text-blue-900 mt-1">PKR {totalCreditDue}</p>
//               </div>

//               <h4 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">Next Steps for Refund Processing</h4>
//               <p className="text-gray-700">
//                 To initiate the refund or apply the credit to a future booking, please <strong>contact our Administration Team directly</strong> using the details below. Provide your <strong>Booking ID(s)</strong> for faster assistance.
//               </p>

//               <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-2">
//                 <p className="font-bold text-lg text-gray-800">Admin Contact Details:</p>
//                 <p className="text-gray-700 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1.5 4-4 1.5 4 1.5-1.5 4H5a2 2 0 01-2-2v-3zm0 0l-1 1m0 0l1 1m0 0v-2m0 2l-1 1m0 0l1 1m0 0v-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m0-4a2 2 0 012-2h8a2 2 0 01-2 2v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"></path></svg>
//                   <strong>Phone:</strong> +92 21 1234 567 (Available 9 AM - 5 PM PKT)
//                 </p>
//                 <p className="text-gray-700 flex items-center gap-2">
//                   <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
//                   <strong>Email:</strong> finance@thevelvetdoor.com
//                 </p>
//               </div>
//             </div>

//             <h4 className="text-xl font-semibold text-gray-900">Cancelled Reservations</h4>
//             <div className="space-y-4">
//               {bookings.filter((b) => (b.booking_status ?? "") === "cancelled").map((b) => (
//                 <div key={b.booking_id || Math.random()} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold text-gray-900">{b.type_name ?? "Room"} - ID: {b.booking_id}</p>
//                     <p className="text-sm text-gray-500">Cancelled on: {formatDate(b.created_at)}</p>
//                   </div>
//                   <p className="text-xl font-extrabold text-red-600">PKR {(Number(b.total_price) || 0).toLocaleString("en-US")}</p>
//                 </div>
//               ))}
//               {bookings.filter((b) => (b.booking_status ?? "") === "cancelled").length === 0 && (
//                 <p className="text-center py-4 text-gray-500 bg-white rounded-lg border">No cancelled bookings available for credit.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

/* ================== HELPERS ================== */

const ONE_HOUR_MS = 60 * 60 * 1000;

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isExpired = (created_at) => {
  if (!created_at) return true;
  return Date.now() - new Date(created_at).getTime() > ONE_HOUR_MS;
};

const remainingMs = (created_at) => {
  if (!created_at) return 0;
  return Math.max(
    0,
    ONE_HOUR_MS - (Date.now() - new Date(created_at).getTime())
  );
};

/* ================== COUNTDOWN ================== */

const Countdown = ({ created_at, onExpire }) => {
  const [ms, setMs] = useState(() => remainingMs(created_at));

  useEffect(() => {
    const t = setInterval(() => {
      const left = remainingMs(created_at);
      setMs(left);
      if (left <= 0 && onExpire) onExpire();
    }, 1000);

    return () => clearInterval(t);
  }, [created_at, onExpire]);

  if (ms <= 0) {
    return <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-xs border border-red-200">Expired</span>;
  }

  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return (
    <span className="text-orange-800 font-mono font-bold bg-orange-100 px-2 py-0.5 rounded border border-orange-300 text-xs">
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
};

/* ================== STATUS BADGE ================== */

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();

  const map = {
    paid: "bg-green-700 text-white border-green-800",
    cancelled: "bg-red-700 text-white border-red-800",
    pending: "bg-amber-600 text-white border-amber-700",
  };

  return (
    <span
      className={`px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border shadow-sm ${
        map[s] || map.pending
      }`}
    >
      {s}
    </span>
  );
};

/* ================== PAGE ================== */

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("hotel_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/bookings/customer",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        setBookings(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router, refreshKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="w-10 h-10 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-bold text-sm uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* COMPACT HEADER */}
      <div className="bg-slate-900 border-b-2 border-indigo-600">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-black text-white tracking-tight">
            MY <span className="text-indigo-400">BOOKINGS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Manage your stays and view transaction history.
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-6 -mt-5 pb-20">
        {bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow border border-gray-300 text-center">
            <h3 className="text-lg font-bold text-gray-800">No Reservations</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">You haven't made any bookings yet.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-2 rounded font-bold text-sm transition-all"
            >
              FIND A ROOM
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const expired =
                b.booking_status === "pending" &&
                isExpired(b.created_at);

              return (
                <div
                  key={b.booking_id}
                  className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all ${
                    expired ? "opacity-75 bg-gray-50" : "hover:border-indigo-400"
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* LEFT SECTION */}
                    <div className="p-5 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StatusBadge status={b.booking_status} />
                        {expired && (
                          <span className="text-[9px] font-black text-red-600 uppercase tracking-tighter">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        {b.type_name || "Room"} 
                        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          #{b.room_number}
                        </span>
                      </h3>

                      <div className="mt-4 flex gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check-In</p>
                          <p className="text-sm font-bold text-gray-800">{fmtDate(b.check_in)}</p>
                        </div>
                        <div className="border-l border-gray-200 pl-8">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check-Out</p>
                          <p className="text-sm font-bold text-gray-800">{fmtDate(b.check_out)}</p>
                        </div>
                      </div>

                      {b.booking_status === "pending" && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded text-[13px] font-medium text-orange-900">
                          <span>⏱ Pay within:</span>
                          <Countdown created_at={b.created_at} onExpire={() => setRefreshKey((k) => k + 1)} />
                        </div>
                      )}
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="bg-gray-50 md:w-72 p-5 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center">
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase text-right">Total Price</p>
                        <p className="text-2xl font-black text-slate-900 text-right leading-none">
                          <span className="text-xs mr-1 font-bold text-slate-500 uppercase">PKR</span>
                          {Number(b.total_price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {b.booking_status === "pending" && !expired && (
                          <button
                            onClick={() => router.push(`/payment/${b.booking_id}`)}
                            className="w-full py-2 rounded bg-green-700 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Pay Now
                          </button>
                        )}

                        {b.booking_status === "paid" && (
                          <button
                            onClick={() => router.push(`/invoice/${b.booking_id}`)}
                            className="w-full py-2 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Invoice
                          </button>
                        )}

                        <button
                          onClick={() => router.push(`/user/bookings/${b.booking_id}`)}
                          className="w-full py-2 rounded bg-slate-800 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
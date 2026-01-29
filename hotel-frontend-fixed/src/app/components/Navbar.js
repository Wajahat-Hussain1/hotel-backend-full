// "use client";
// import { useEffect, useState } from "react";
// import { getToken, logout } from "../lib/auth";

// export default function Navbar() {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     setToken(getToken());
//     const onStorage = () => setToken(getToken());
//     window.addEventListener("storage", onStorage);
//     return () => window.removeEventListener("storage", onStorage);
//   }, []);

//   return (
//     <nav className="w-full bg-white shadow-sm">
//       <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-bold text-gray-800">FlashBoy Hotel</h1>
//         </div>

//         <div className="flex items-center space-x-6">
//           <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
//           <a href="#rooms" className="text-gray-700 hover:text-gray-900">Rooms</a>
//           <a href="/contact" className="text-gray-700 hover:text-gray-900">Contact</a>

//           <div className="space-x-3">
//             {!token ? (
//               <>
//                 <a href="/login" className="px-3 py-1 rounded-md border border-blue-600 text-blue-600">Login</a>
//                 <a href="/register" className="px-3 py-1 rounded-md bg-blue-600 text-white">Signup</a>
//               </>
//             ) : (
//               <>
//                 <button onClick={logout} className="px-3 py-1 rounded-md border border-red-500 text-red-500">Logout</button>
//                 <a href="/user/bookings" className="px-3 py-1 rounded-md bg-gray-100">My Bookings</a>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";
import { useEffect, useState } from "react";
// Assuming these paths are correct in your project structure
import { getToken, logout } from "../lib/auth"; 

export default function Navbar() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get token on mount
    setToken(getToken());
    
    // Listen for storage changes (e.g., token removal in another tab)
    const onStorage = () => setToken(getToken());
    window.addEventListener("storage", onStorage);
    
    // Cleanup listener
    return () => window.removeEventListener("storage", onStorage);
  }, []); // Logic is unchanged

  return (
    // FIX: Shadow-md, sticky, slightly darker background for premium feel
    <nav className="w-full bg-white shadow-md sticky top-0 z-50 border-b border-gray-100"> 
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LOGO / BRANDING */}
        <div className="flex items-center">
          <svg className="w-7 h-7 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3h3v3m-3 0h3"></path></svg>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">VELVET <span className="text-blue-600">Hotel</span></h1>
        </div>

        {/* NAVIGATION LINKS & AUTH BUTTONS */}
        <div className="flex items-center space-x-8">
          
          {/* Main Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-slate-700 hover:text-blue-600 transition duration-150 font-medium">Home</a>
            {/* Smooth Scroll to Rooms section */}
            <a href="#rooms" className="text-slate-700 hover:text-blue-600 transition duration-150 font-medium">Rooms</a> 
            <a href="/contact" className="text-slate-700 hover:text-blue-600 transition duration-150 font-medium">Contact</a>
          </div>

          {/* Auth Links/Buttons */}
          <div className="space-x-3">
            {!token ? (
              // Not Logged In
              <>
                <a 
                  href="/login" 
                  // FIX: Button-like style, rounded-full
                  className="px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition duration-150 font-semibold text-sm"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  // FIX: Primary button, rounded-full, with shadow
                  className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-md font-semibold text-sm"
                >
                  Signup
                </a>
              </>
            ) : (
              // Logged In
              <>
                {/* My Bookings Button */}
                <a 
                  href="/user/bookings" 
                  className="px-4 py-2 rounded-full bg-gray-100 text-slate-700 hover:bg-gray-200 transition duration-150 font-medium text-sm"
                >
                  My Bookings
                </a>
                {/* Logout Button */}
                <button 
                  onClick={logout} 
                  // FIX: Danger button style, rounded-full
                  className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition duration-150 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

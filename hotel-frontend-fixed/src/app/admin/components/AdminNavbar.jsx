"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function AdminNavbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logout Logic - Clears all admin-related data
  function handleLogout() {
    localStorage.removeItem("hotel_token");
    localStorage.removeItem("hotel_role");
    localStorage.removeItem("hotel_admin_name");
    localStorage.removeItem("hotel_email");
    router.push("/login");
  }

  // Get Admin Data from LocalStorage safely
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@thevelvetdoor.com"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminData({
        name: localStorage.getItem("hotel_admin_name") || "Admin User",
        email: localStorage.getItem("hotel_email") || "admin@thevelvetdoor.com"
      });
    }
  }, []);
  
  const avatarLetter = adminData.name.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight hidden sm:block">
              The Velvet Door <span className="text-indigo-600 font-medium text-sm ml-1">Admin</span>
            </span>
          </div>
        </div>

        {/* Right Side: Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
              {avatarLetter}
            </div>
            
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{adminData.name}</p>
            </div>

            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200">
              
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 text-black">Current User</p>
                <p className="text-sm font-bold text-slate-900 text-black">{adminData.name}</p>
                <p className="text-xs text-slate-500 truncate text-black">{adminData.email}</p>
              </div>

              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Profile
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
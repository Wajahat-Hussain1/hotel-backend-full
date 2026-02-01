"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  // Sync with localStorage to remember user preference
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("admin_sidebar_open");
    if (saved !== null) {
      setOpen(saved === "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_sidebar_open", open ? "1" : "0");
    }
  }, [open]);

  // Sidebar Menu Configuration
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { name: "Rooms", path: "/admin/rooms", icon: <path d="M19 11H5a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2zm0 0V8a2 2 0 00-2-2H7a2 2 0 00-2 2v3" /> },
    { name: "Bookings", path: "/admin/bookings", icon: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { name: "Customers", path: "/admin/customers", icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { name: "Payments", path: "/admin/payments", icon: <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
    { name: "Staff", path: "/admin/staff", icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { name: "Services", path: "/admin/services", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed z-[60] left-4 top-3 p-2 bg-indigo-600 text-white rounded-xl shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
          ${open ? "w-72 translate-x-0" : "w-20 translate-x-0"}
          ${!open ? "max-md:-translate-x-full" : "max-md:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={`px-6 h-16 flex items-center border-b border-slate-50 ${open ? 'justify-between' : 'justify-center'}`}>
            {open && (
              <div className="flex items-center gap-2 animate-in fade-in duration-300">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                <span className="font-bold text-slate-800 tracking-tight">Velvet Admin</span>
              </div>
            )}
            
            <button
              onClick={() => setOpen(!open)}
              className="hidden md:flex p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${!open && "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menu.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${active 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}
                  `}
                >
                  <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </span>
                  
                  {open ? (
                    <span className="font-semibold text-sm tracking-wide">
                      {item.name}
                    </span>
                  ) : (
                    <div className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="p-4 border-t border-slate-50">
            <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-50 ${!open && 'justify-center'}`}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              {open && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Live</span>
                  <span className="text-[10px] text-slate-500">v2.1.0-stable</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Main Content Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${open ? "w-72" : "w-20"} flex-shrink-0`} />
    </>
  );
}
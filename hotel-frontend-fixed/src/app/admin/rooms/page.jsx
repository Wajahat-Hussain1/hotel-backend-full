"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "../components/AdminSidebar";

// --- CUSTOM TOAST / ALERT COMPONENT (Unchanged, remains for functional alerts) ---
function CustomToast({ message, type, onClose }) {
  if (!message) return null;

  const baseClasses = "fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] p-4 rounded-xl shadow-2xl font-semibold flex items-center gap-3 transition-all duration-300";
  let classes = "";
  let iconPath = "";

  if (type === "success") {
    classes = "bg-green-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />; // Check circle
  } else if (type === "error") {
    classes = "bg-red-600 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />; // X circle
  } else if (type === "confirm") {
    classes = "bg-yellow-500 text-white";
    iconPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" />; // Exclamation
  }

  return (
    <div className={`${baseClasses} ${classes}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{iconPath}</svg>
      <span>{message}</span>
      {type !== 'confirm' && (
          <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
      )}
    </div>
  );
}
// ------------------------------------------


// --- MINIMALIST STATUS BADGE COMPONENT (Redesigned) ---
// Now uses simple text with background padding, replacing the capsule style.
function StatusBadge({ text, color }) {
    // Defines the minimal style classes
    const styles = {
        green: "bg-green-50 text-green-700",
        red: "bg-red-50 text-red-700",
        yellow: "bg-yellow-50 text-yellow-700",
        blue: "bg-blue-50 text-blue-700", 
    };
    const normalizedColor = styles[color] ? color : 'yellow'; // Fallback
    
    return (
        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-md capitalize ${styles[normalizedColor]}`}>
            {text.toUpperCase()}
        </span>
    );
}
// ------------------------------------------


// --- MAIN COMPONENT ---
export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active"); // active | inactive | all
  
  const [toast, setToast] = useState({ message: "", type: "" });
  const [confirmAction, setConfirmAction] = useState(null); 

  const token = typeof window !== "undefined" ? localStorage.getItem("hotel_token") : null;

  const displayToast = (message, type = "error") => {
    setToast({ message, type });
    if (type !== 'confirm') {
        setTimeout(() => setToast({ message: "", type: "" }), 5000);
    }
  };

  const showConfirmation = (roomId, actionType) => {
    setConfirmAction({ id: roomId, action: actionType });
    // Using a separate modal for confirmation is better UX than toast
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    
    const { id, action } = confirmAction;
    
    setConfirmAction(null);
    setToast({ message: "", type: "" }); 

    const newStatus = action === 'disable' ? 'inactive' : 'available';

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
          return displayToast(json.message || `Failed to ${action} room`, "error");
      }
      
      displayToast(`Room successfully ${action === 'disable' ? 'disabled' : 'enabled'}!`, "success");
      
      setRooms((prev) =>
        prev.map((r) => (r.room_id === id ? { ...r, status: newStatus } : r))
      );
      
    } catch {
      displayToast(`Failed to ${action} room due to network error.`, "error");
    }
  };


  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rooms");
        const json = await res.json();
        setRooms(json.data || []);
      } catch {
        displayToast("Failed to load rooms from the server.", "error");
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = rooms.filter((r) => {
    if (view === "inactive" && r.status !== "inactive") return false;
    if (view === "active" && r.status === "inactive") return false;

    return `${r.room_number} ${r.type_name}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const disableRoom = (id) => showConfirmation(id, 'disable');
  const enableRoom = (id) => showConfirmation(id, 'enable');

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'green';
      case 'occupied': return 'blue'; 
      case 'maintenance': return 'yellow';
      case 'inactive': return 'red';
      default: return 'yellow';
    }
  }


  return (
    <div className="flex min-h-screen bg-[#f5f8ff]">
      
      {/* --- RENDER CUSTOM TOAST HERE --- */}
      <CustomToast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: "", type: "" })} 
      />
      
      {/* --- CONFIRMATION MODAL OVERLAY --- (Unchanged) */}
      {confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
              <svg className="w-12 h-12 mx-auto text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16a2 2 0 001.732 3z" /></svg>
              <h3 className="text-xl font-bold text-slate-800 mb-2 capitalize">Confirm Action</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to {confirmAction.action} Room #{rooms.find(r => r.room_id === confirmAction.id)?.room_number || confirmAction.id}?
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => {
                    setConfirmAction(null);
                    setToast({ message: "", type: "" });
                  }}
                  className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={`px-4 py-2 text-white font-medium rounded-lg transition-colors capitalize ${confirmAction.action === 'disable' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  Yes, {confirmAction.action}
                </button>
              </div>
            </div>
          </div>
      )}
      {/* ---------------------------------- */}


      <AdminSidebar />

      <main className="flex-1 p-8 lg:p-12 max-w-[1800px] mx-auto w-full">
        
        {/* --- Header and CTA --- */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Rooms
            </h1>
            <p className="text-base text-slate-500 mt-1">Manage, view, and update all hotel rooms.</p>
          </div>

          <Link
            href="/admin/rooms/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Room
          </Link>
        </div>

        {/* --- Controls Section: Tabs and Search --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          
          {/* Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {["active", "inactive", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                  view === tab
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search by Room ID or Type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* --- Main Data Table --- */}
        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4 font-extrabold w-1/12">ID</th>
                <th className="p-4 font-extrabold">Room Number</th>
                <th className="p-4 font-extrabold">Room Type</th>
                <th className="p-4 font-extrabold">Current Status</th>
                <th className="p-4 font-extrabold text-center w-1/4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading State */}
              {loading && (
                <tr>
                  <td className="p-6 text-center text-indigo-600 font-semibold" colSpan={5}>
                    <div className="flex items-center justify-center gap-3">
                      <span className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></span>
                      Fetching Room Data...
                    </div>
                  </td>
                </tr>
              )}
              
              {/* No Data State */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    <div className="p-8 bg-slate-50 rounded-xl">
                      No rooms found matching "{search}" in the {view} view.
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!loading && filtered.map((r) => (
                <tr key={r.room_id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  
                  {/* Room ID */}
                  <td className="pl-6 py-4 text-xs text-slate-400 font-bold">{r.room_id}</td>

                  {/* Room Number */}
                  <td className="py-4 text-lg font-extrabold text-slate-800">{r.room_number}</td>
                  
                  {/* Room Type */}
                  <td className="py-4 capitalize font-medium text-slate-600">{r.type_name}</td>

                  {/* Status Badge (Now using the minimalist style) */}
                  <td className="py-4">
                    <StatusBadge text={r.status} color={getStatusColor(r.status)} />
                  </td>

                  {/* Actions */}
                  <td className="p-4 space-x-3 text-center">
                    <Link
                      href={`/admin/rooms/${r.room_id}/edit`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l4-4m-9 9l4 4m-4-4l4-4m-9 9l4 4" /></svg>
                      Edit
                    </Link>

                    {r.status !== "inactive" ? (
                      <button
                        onClick={() => disableRoom(r.room_id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
                        disabled={!!confirmAction} 
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => enableRoom(r.room_id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors"
                        disabled={!!confirmAction} 
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
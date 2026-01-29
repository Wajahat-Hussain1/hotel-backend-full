


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Sidebar from "../../../components/AdminSidebar";

// export default function DeletePaymentPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [payment, setPayment] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const token =
//     typeof window !== "undefined"
//       ? localStorage.getItem("hotel_token")
//       : null;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const json = await res.json();
//         if (!res.ok) return alert(json.message);

//         setPayment(json.data);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load payment");
//       }
//       setLoading(false);
//     };

//     load();
//   }, [id]);

//   const deletePayment = async () => {
//     if (!confirm("Are you sure you want to delete this payment?")) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const json = await res.json();

//       if (!res.ok) return alert(json.message);

//       alert("Payment deleted successfully!");
//       router.push("/admin/payments");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete payment");
//     }
//   };

//   if (loading) return <p className="p-10 text-xl">Loading...</p>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar active="payments" />

//       <main className="flex-1 p-10">
//         <h1 className="text-3xl font-bold text-red-600 mb-6">
//           Delete Payment #{id}
//         </h1>

//         <div className="bg-white p-6 rounded-xl shadow-md border max-w-lg">
//           <p className="text-lg mb-4">
//             <strong>Amount:</strong> PKR {payment.amount}
//           </p>
//           <p className="text-lg mb-4">
//             <strong>Status:</strong> {payment.payment_status}
//           </p>
//           <p className="text-lg mb-6">
//             <strong>Method:</strong> {payment.payment_method}
//           </p>

//           <button
//             onClick={deletePayment}
//             className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
//           >
//             Confirm Delete
//           </button>

//           <button
//             onClick={() => router.push("/admin/payments")}
//             className="mt-3 px-6 py-3 bg-gray-300 rounded-lg w-full"
//           >
//             Cancel
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../components/AdminSidebar";

export default function DeletePaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("hotel_token")
      : null;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok) return;

        setPayment(json.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    load();
  }, [id, token]);

  const deletePayment = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      router.push("/admin/payments");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-gray-500 animate-pulse text-xl font-medium">Loading Payment Details...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar active="payments" />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-red-50 p-8 text-center border-b border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700">Delete Payment</h1>
            <p className="text-red-500 text-sm mt-1">This action cannot be undone.</p>
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Payment ID</span>
              <span className="font-mono font-bold text-gray-700">#{id}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="text-lg font-bold text-gray-900">PKR {payment?.amount}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                payment?.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {payment?.payment_status}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Method</span>
              <span className="text-gray-700">{payment?.payment_method}</span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-8 pt-0 flex flex-col gap-3">
            <button
              onClick={deletePayment}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200 active:scale-95"
            >
              Confirm Permanent Delete
            </button>
            
            <button
              onClick={() => router.push("/admin/payments")}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-all active:scale-95"
            >
              Cancel & Go Back
            </button>
          </div>
        </div>
        
        <p className="mt-6 text-gray-400 text-sm">
          Secured Admin Panel • Hotel Management System
        </p>
      </main>
    </div>
  );
}
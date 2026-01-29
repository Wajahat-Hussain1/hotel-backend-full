

// "use client";

// import Navbar from "../components/Navbar";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Login() {
//   const router = useRouter();
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [busy, setBusy] = useState(false);

//   // LOGIC: HANDLE SUBMIT (UNCHANGED)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBusy(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },

//         // ⭐ IMPORTANT: backend DEMANDS these exact fields
//         body: JSON.stringify({
//           emailOrUsername: emailOrUsername,
//           password: password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || data.error || "Login failed");
//         setBusy(false);
//         return;
//       }

//       // ⭐ Token extraction (backend sends: { data: { token } })
//       const token =
//         data?.data?.token ||
//         data?.token ||
//         null;

//       if (!token) {
//         alert("No token received from server");
//         setBusy(false);
//         return;
//       }

//       localStorage.setItem("hotel_token", token);

//       // ⭐ Redirect to homepage
//       router.push("/");
//     } catch (err) {
//       console.error(err);
//       alert("Network error");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Navbar />

//       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         {/* Pro Card Container */}
//         <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">
          
//           {/* Header */}
//           <div className="text-center">
//             <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m3-4H4a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2v-7a2 2 0 00-2-2h-2"></path></svg>
//             <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
//               Sign In to Your Account
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Welcome back to The Velvet Door.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            
//             {/* Email/Username Field */}
//             <div>
//               <label htmlFor="user-id" className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
//               <input
//                 id="user-id"
//                 placeholder="Email or Username"
//                 type="text"
//                 className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                 value={emailOrUsername}
//                 onChange={(e) => setEmailOrUsername(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 id="password"
//                 placeholder="••••••••"
//                 type="password"
//                 className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={busy}
//               className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold transition duration-300 ${
//                 busy 
//                 ? "bg-blue-400 text-white cursor-not-allowed" 
//                 : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.005]"
//               }`}
//             >
//               {busy ? (
//                 <div className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//                     Signing In...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           {/* Footer Link */}
//           <div className="text-center mt-6">
//             <p className="text-sm text-gray-600">
//               Don’t have an account?{" "}
//               <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
//                 Register here
//               </a>
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || data.error || "Login failed");
        setBusy(false);
        return;
      }

      // ⭐ Correct token extraction
      const token =
        data?.data?.token ||
        data?.token ||
        null;

      // ⭐ CORRECT ROLE EXTRACTION (matches your backend)
      const role =
        data?.data?.user?.role ||
        data?.user?.role ||
        data?.role ||
        null;

      if (!token) {
        alert("No token received from server");
        setBusy(false);
        return;
      }

      if (!role) {
        alert("User role missing from server response");
        setBusy(false);
        return;
      }

      // ⭐ Store token & role
      localStorage.setItem("hotel_token", token);
      localStorage.setItem("hotel_role", role);

      // ⭐ Redirect by role
      if (role === "admin") {
        router.push("/admin/dashboard");
      }
       else {
        router.push("/");
      }

    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">

          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m3-4H4a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2v-7a2 2 0 00-2-2h-2">
              </path>
            </svg>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              Sign In to Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
              <input
                id="user-id"
                placeholder="Email or Username"
                type="text"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className={`w-full py-3 rounded-lg text-lg font-semibold shadow-md transition ${
                busy
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {busy ? "Signing In..." : "Sign In"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

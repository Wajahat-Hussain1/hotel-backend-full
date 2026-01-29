// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "../components/Navbar";

// export default function RegisterPage() {
//   const router = useRouter();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!firstName || !lastName || !email || !password) {
//       alert("Please fill all fields.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           first_name: firstName,
//           last_name: lastName,
//           email,
//           password,
//         }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         alert(json.message || "Registration failed");
//         setLoading(false);
//         return;
//       }

//       // ⭐ If backend returns token, store it
//       const token = json?.data?.token || null;

//       if (token) {
//         localStorage.setItem("hotel_token", token);
//       }

//       alert("Account created successfully!");

//       // ⭐ Redirect to login or homepage
//       router.push("/login");

//     } catch (error) {
//       console.error("Register error:", error);
//       alert("Something went wrong.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="max-w-md mx-auto mt-16 bg-white shadow p-6 rounded-lg">
//         <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

//         <form onSubmit={handleRegister} className="space-y-4">

//           <div>
//             <label className="block mb-1 font-medium">First Name</label>
//             <input
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               placeholder="Ali"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Last Name</label>
//             <input
//               type="text"
//               className="w-full border px-3 py-2 rounded"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               placeholder="Khan"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Email</label>
//             <input
//               type="email"
//               className="w-full border px-3 py-2 rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="example@gmail.com"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-medium">Password</label>
//             <input
//               type="password"
//               className="w-full border px-3 py-2 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
//           >
//             {loading ? "Creating Account..." : "Register"}
//           </button>
//         </form>

//         <p className="text-center mt-4 text-gray-600">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }








// File: RegisterPage.jsx (Pro Design)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
// Note: Footer import yahan optional hai, agar aap footer har page par use karna chahte hain.

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // LOGIC: HANDLE REGISTRATION (UNCHANGED)
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.message || "Registration failed");
        setLoading(false);
        return;
      }

      // ⭐ If backend returns token, store it
      const token = json?.data?.token || null;

      if (token) {
        localStorage.setItem("hotel_token", token);
      }

      alert("Account created successfully!");

      // ⭐ Redirect to login (as per original logic)
      router.push("/login");

    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Pro Card Container */}
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">
          
          {/* Header */}
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start your luxury stay journey today.
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-6">

            {/* Name Fields Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        id="first-name"
                        type="text"
                        required
                        className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ali"
                    />
                </div>
                <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        id="last-name"
                        type="text"
                        required
                        className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Khan"
                    />
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                    id="email-address"
                    type="email"
                    required
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    id="password"
                    type="password"
                    required
                    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold transition duration-300 ${
                loading 
                ? "bg-blue-400 text-white cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-[1.005]"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating Account...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Sign In
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
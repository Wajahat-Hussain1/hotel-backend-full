// "use client";

// export default function Footer() {
//   return (
//     <footer className="bg-slate-900 text-white border-t border-slate-800">
//       <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
//         {/* TOP SECTION: GRID LAYOUT */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
//           {/* 1. BRAND INFO */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//                 <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3h3v3m-3 0h3"></path></svg>
//                 <h2 className="text-2xl font-extrabold tracking-tight text-white">
//                     THE VELVET DOOR
//                 </h2>
//             </div>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Experience the pinnacle of luxury and comfort. Whether you are traveling for business or leisure, we ensure a memorable stay with world-class amenities.
//             </p>
            
//             {/* Social Icons */}
//             <div className="flex space-x-4 pt-2">
//               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
//               </a>
//               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
//               </a>
//               <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
//               </a>
//             </div>
//           </div>

//           {/* 2. QUICK LINKS */}
//           <div>
//             <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
//             <ul className="space-y-3 text-slate-400">
//               <li><a href="/" className="hover:text-blue-500 transition duration-200">Home</a></li>
//               <li><a href="#rooms" className="hover:text-blue-500 transition duration-200">Our Rooms</a></li>
//               <li><a href="/user/bookings" className="hover:text-blue-500 transition duration-200">My Bookings</a></li>
//               <li><a href="/contact" className="hover:text-blue-500 transition duration-200">Contact Us</a></li>
//               <li><a href="#" className="hover:text-blue-500 transition duration-200">Privacy Policy</a></li>
//             </ul>
//           </div>

//           {/* 3. CONTACT INFO */}
//           <div>
//             <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
//             <ul className="space-y-4 text-slate-400">
//               <li className="flex items-start gap-3">
//                 <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m11.314 0a7 7 0 11-11.314 0m11.314 0H12m0 0v-5m0 5a2 2 0 11-4 0m4 0a2 2 0 10-4 0m0 0H12"></path></svg>
//                 <span>123 Main Street, Central District, Karachi, Pakistan</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1.5 4-4 1.5 4 1.5-1.5 4H5a2 2 0 01-2-2v-3zm0 0l-1 1m0 0l1 1m0 0v-2m0 2l-1 1m0 0l1 1m0 0v-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m0-4a2 2 0 012-2h8a2 2 0 01-2 2v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"></path></svg>
//                 <span>+92 300 1234567</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
//                 <span>contact@velvetdoor.com</span>
//               </li>
//             </ul>
//           </div>

//           {/* 4. NEWSLETTER */}
//           <div>
//             <h3 className="text-lg font-bold text-white mb-6">Newsletter</h3>
//             <p className="text-slate-400 text-sm mb-4">Subscribe to receive exclusive offers and latest news.</p>
//             <form className="flex flex-col gap-3">
//                 <input 
//                     type="email" 
//                     placeholder="Enter your email" 
//                     className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition placeholder-slate-500"
//                 />
//                 <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-300">
//                     Subscribe
//                 </button>
//             </form>
//           </div>

//         </div>

//         {/* BOTTOM SECTION */}
//         <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-slate-500 text-sm text-center md:text-left">
//                 © 2025 The Velvet Door. All rights reserved.
//             </p>
//             <div className="flex gap-6 text-sm text-slate-500">
//                 <a href="#" className="hover:text-white transition">Terms of Service</a>
//                 <a href="#" className="hover:text-white transition">Cookie Policy</a>
//             </div>
//         </div>

//       </div>
//     </footer>
//   );
// }


// File: Footer.jsx (Compact Design & Conditional Visibility)

"use client";

import { usePathname } from 'next/navigation'; // For checking the current path

export default function Footer() {
  const pathname = usePathname();

  // 1. CONDITIONAL RENDERING LOGIC:
  // Agar path '/user/bookings' ya '/admin' se shuru hota hai, toh Footer hide kar dein.
  const isPanelPage = pathname.startsWith('/user/bookings') || pathname.startsWith('/admin');

  if (isPanelPage) {
    return null; // Don't render the footer on panel pages
  }

  return (
    // 2. HEIGHT REDUCTION: py-12 lg:py-16 ko py-8 lg:py-10 mein change kiya
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10"> 
        
        {/* TOP SECTION: GRID LAYOUT (gap-12 ko gap-8 mein change kiya) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* 1. BRAND INFO */}
          <div className="space-y-3"> {/* space-y-4 ko space-y-3 mein change kiya */}
            <div className="flex items-center gap-2">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3h3v3m-3 0h3"></path></svg>
                <h2 className="text-xl font-extrabold tracking-tight text-white"> {/* Text size kam ki */}
                    THE VELVET DOOR
                </h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed"> {/* Text size kam ki */}
              Experience the pinnacle of luxury and comfort. We ensure a memorable stay with world-class amenities.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-3 pt-1">
              {/* Icons p-2 ko p-1.5 kiya */}
              <a href="#" className="p-1.5 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="p-1.5 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="p-1.5 bg-slate-800 rounded-full hover:bg-blue-600 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className="text-md font-bold text-white mb-4">Quick Links</h3> {/* Text size and margin kam kiye */}
            <ul className="space-y-2 text-slate-400 text-sm"> {/* space-y-3 ko space-y-2 kiya, text size kam ki */}
              <li><a href="/" className="hover:text-blue-500 transition duration-200">Home</a></li>
              <li><a href="#rooms" className="hover:text-blue-500 transition duration-200">Our Rooms</a></li>
              {/* Note: /user/bookings link yahan hai, lekin agar user is page par hoga, toh poora footer render nahi hoga. */}
              <li><a href="/user/bookings" className="hover:text-blue-500 transition duration-200">My Bookings</a></li>
              <li><a href="/contact" className="hover:text-blue-500 transition duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition duration-200">Privacy Policy</a></li>
            </ul>
          </div>

          {/* 3. CONTACT INFO */}
          <div>
            <h3 className="text-md font-bold text-white mb-4">Contact Us</h3> {/* Text size and margin kam kiye */}
            <ul className="space-y-3 text-slate-400 text-sm"> {/* space-y-4 ko space-y-3 kiya, text size kam ki */}
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m11.314 0a7 7 0 11-11.314 0m11.314 0H12m0 0v-5m0 5a2 2 0 11-4 0m4 0a2 2 0 10-4 0m0 0H12"></path></svg>
                <span>123 Main Street, Central District, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1.5 4-4 1.5 4 1.5-1.5 4H5a2 2 0 01-2-2v-3zm0 0l-1 1m0 0l1 1m0 0v-2m0 2l-1 1m0 0l1 1m0 0v-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m0-4a2 2 0 012-2h8a2 2 0 01-2 2v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"></path></svg>
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
                <span>contact@velvetdoor.com</span>
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div>
            <h3 className="text-md font-bold text-white mb-4">Newsletter</h3> {/* Text size and margin kam kiye */}
            <p className="text-slate-400 text-sm mb-3">Subscribe to receive exclusive offers.</p> {/* Margin kam ki */}
            <form className="flex flex-col gap-2"> {/* gap kam kiya */}
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition placeholder-slate-500" // Padding aur border radius kam kiya
                />
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300 text-sm"> {/* Padding aur border radius kam kiya */}
                    Subscribe
                </button>
            </form>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        {/* pt-8 ko pt-6 mein badla */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3"> 
            <p className="text-slate-500 text-xs text-center md:text-left"> {/* Text size aur margin kam kiye */}
                © {new Date().getFullYear()} The Velvet Door. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-slate-500"> {/* gap aur text size kam kiye */}
                <a href="#" className="hover:text-white transition">Terms of Service</a>
                <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
        </div>

      </div>
    </footer>
  );
}
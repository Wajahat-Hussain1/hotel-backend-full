import { Suspense } from "react";
import Footer from "../app/components/Footer"; 
import "./globals.css";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "FlashBoy Hotel",
  description: "Online reservation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
          </div>
        }>
          <main className="flex-grow">
            {children}
          </main>
        </Suspense>
        
        <Footer />
      </body>
    </html>
  );
}
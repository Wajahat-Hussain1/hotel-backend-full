
import Footer from "../app/components/Footer"; 
// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "FlashBoy Hotel",
  description: "Online reservation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
      <Footer></Footer>
    </html>
  );
}

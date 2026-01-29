import { Suspense } from "react";
import Footer from "../app/components/Footer"; 
import "./globals.css";

export const metadata = {
  title: "FlashBoy Hotel",
  description: "Online reservation system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        {/* The Suspense boundary here catches all 'useSearchParams' hooks 
          used in any page of your app, preventing the build from failing.
        */}
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
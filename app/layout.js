"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const hideSidebar =
    pathname === "/login" || pathname === "/signup" || pathname === "/";

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <Toaster />
        {!hideSidebar && (
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        <main
          className={`transition-all duration-300 flex-1 ${
            !hideSidebar ? (isSidebarOpen ? "ml-64" : "ml-20") : ""
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

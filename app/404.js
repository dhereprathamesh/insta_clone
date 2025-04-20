// app/404.js
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center items-center h-screen`}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-xl mt-4">Page Not Found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Go Back to Home
          </button>
        </div>
      </body>
    </html>
  );
}

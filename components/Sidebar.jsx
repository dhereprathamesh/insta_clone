"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaPlus,
  FaSearch,
  FaUser,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  const menuItems = [
    { name: "Home", icon: <FaHome />, href: "/home" },
    { name: "Add Post", icon: <FaPlus />, href: "/addpost" },
    { name: "Search", icon: <FaSearch />, href: "/search" },
    { name: "Profile", icon: <FaUser />, href: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[9999] p-3 bg-black text-white rounded-md cursor-pointer"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          isOpen ? "w-64" : "w-20"
        } bg-black text-white p-6 transition-all duration-300 ease-in-out z-40 flex flex-col justify-between`}
      >
        <div>
          <h2
            className={`text-2xl font-bold mb-8 text-center transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Instagram
          </h2>
          <ul className="space-y-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 hover:text-blue-400"
                >
                  <span>{item.icon}</span>
                  <span
                    className={`transition-opacity duration-300 ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Section at the bottom */}
        <div className="space-y-4 mt-auto">
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="flex items-center space-x-3 hover:text-blue-400 w-full"
          >
            <span>
              <FaCog />
            </span>
            <span
              className={`transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Settings
            </span>
          </button>

          {showSettings && (
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-500 hover:text-red-400 w-full"
              >
                <span>
                  <FaSignOutAlt />
                </span>
                <span
                  className={`transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

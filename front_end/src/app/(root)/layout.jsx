"use client";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SiderBar from "./components/SiderBar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <section className="flex h-screen w-full bg-gray-50">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md border border-gray-200 md:hidden hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <HiMenuAlt3 className="w-6 h-6 text-gray-600" />
        </button>

        <SiderBar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="w-full h-full flex flex-col md:ml-0">
          <Header />
          <main className="flex-1 overflow-auto container-responsive py-4 md:py-6">
            {children}
          </main>
          <Footer />
        </div>
      </section>
    </ProtectedRoute>
  );
}

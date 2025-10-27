import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./HeaderLayout.js";
import Sidebar from "./SidebarLayout.js";
import { ToastContainer } from "react-toastify";


export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Sidebar (desktop y móvil) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Contenido */}
      <main className="pt-16 lg:ml-64 p-6">
        <Outlet />
        <ToastContainer
          position="top-right"
          autoClose={5000} 
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
      </main>
    </div>
  );
}

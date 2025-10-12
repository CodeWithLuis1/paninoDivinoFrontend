// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Logo from "@/components/Logo.js";
// import NavMenu from "@/components/NavMenu.js";
// import { Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// // import Sidebar from "@/components/Sidebar.js";

// export default function AppLayout() {
//     const [open, setOpen] = useState(false);
//   return (
//     <>
//     {/* <Sidebar /> */}
//       {/* <header className="bg-gray-800 py-5">
//         <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
//           <div className="w-64">
//             <Link to={"/"}>
//               <Logo />
//             </Link>
//           </div>
//           <NavMenu />
//         </div>
//       </header> */}

//       <header className="bg-gray-800 text-white shadow-md">
//         <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-5 py-4">
//           {/* Logo */}
//           <div className="w-64">
//             <Link to={"/"}>
//               <Logo />
//             </Link>
//           </div>

//           {/* Menú desktop */}
//           <nav className="hidden md:flex gap-6 font-medium">
//             <Link to="/" className="hover:text-yellow-400 transition">
//               Inicio
//             </Link>
//             <Link to="/products" className="hover:text-yellow-400 transition">
//               Productos
//             </Link>
//             <Link to="/services" className="hover:text-yellow-400 transition">
//               Servicios
//             </Link>
//             <Link to="/contact" className="hover:text-yellow-400 transition">
//               Contacto
//             </Link>
//           </nav>

//           {/* Botón menú móvil */}
//           <button
//             onClick={() => setOpen(!open)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition"
//           >
//             {open ? <X size={24} /> : <Menu size={24} />}
//           </button>
//           <NavMenu />
//         </div>

//         {/* Menú móvil desplegable */}
//         {open && (
//           <div className="md:hidden bg-gray-700 px-5 py-3 space-y-3">
//             <Link
//               to="/"
//               className="block hover:text-yellow-400 transition"
//               onClick={() => setOpen(false)}
//             >
//               Inicio
//             </Link>
//             <Link
//               to="/about"
//               className="block hover:text-yellow-400 transition"
//               onClick={() => setOpen(false)}
//             >
//               Nosotros
//             </Link>
//             <Link
//               to="/services"
//               className="block hover:text-yellow-400 transition"
//               onClick={() => setOpen(false)}
//             >
//               Servicios
//             </Link>
//             <Link
//               to="/contact"
//               className="block hover:text-yellow-400 transition"
//               onClick={() => setOpen(false)}
//             >
//               Contacto
//             </Link>
//           </div>
//         )}
//       </header>
      
//       <section className="max-w-screen-2xl mx-out mt-10 p-5">
//         <Outlet />
//       </section>
//       <footer className="py-5">
//         <p className="text-center">
//           Todos los derechos reservados {new Date().getFullYear()}
//         </p>
//       </footer>
//       <ToastContainer
//         position="top-right"
//         pauseOnHover={false}
//         pauseOnFocusLoss={false}
//       />
//     </>
//   );
// }

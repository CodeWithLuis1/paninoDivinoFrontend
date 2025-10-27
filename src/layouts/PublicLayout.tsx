import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Outlet />
        <ToastContainer
        position="top-right"
        autoClose={5000} 
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </div>
  );
}

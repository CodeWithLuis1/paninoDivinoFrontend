
import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "../routes/PublicRoutes.js";
import AdminRoutes from "../routes/AdminRoutes.js"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
}


import { Navigate, Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout.js";
import Login from "@/views/auth/LoginView.js";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" />} index />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </>
  );
}

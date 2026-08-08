import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AdminRoute() {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // return Admin as only condition left is logged in and admin
  return <Outlet />;
}

export default AdminRoute;

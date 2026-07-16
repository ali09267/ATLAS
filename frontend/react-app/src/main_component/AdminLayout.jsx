import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}
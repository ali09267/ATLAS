import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminNavbar.css";


function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="admin-navbar">

      {/* LEFT - LOGO */}
      <div className="admin-left">
        <Link to="/admin/dashboard" className="logo">
          MyAwesomeCart Admin
        </Link>
      </div>

      {/* MOBILE TOGGLE */}
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* CENTER LINKS */}
      <div className={`admin-center ${menuOpen ? "active" : ""}`}>

        <Link to="/admin/customers" onClick={() => setMenuOpen(false)}>
          Customers
        </Link>

        <Link to="/admin/products" onClick={() => setMenuOpen(false)}>
          Products
        </Link>

        <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>
          Orders
        </Link>

        <Link to="/admin/notifications" onClick={() => setMenuOpen(false)}>
          Notifications
        </Link>

        <Link to="/admin/ai" onClick={() => setMenuOpen(false)}>
          AI Assistant
        </Link>

      </div>

      {/* RIGHT SIDE */}
      <div className="admin-right">
        <Link
          to="/"
          className="home-btn"
        >
          Home
        </Link>
      </div>

    </nav>
  );
}

export default AdminNavbar;
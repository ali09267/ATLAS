import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./cart/Cart_Content";
import { useState, useEffect } from "react";
import Navbar from "./main_component/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/Product_Detail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Tracker from "./pages/Tracker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Logout from "./pages/Logout";
import Confirm from "./pages/Confirm";
import Dashboard from "./admin/dashboard";
import UserLayout from "./main_component/UserLayout";
import AdminLayout from "./main_component/AdminLayout";
import Products from "./admin/Products";
import Customers from "./admin/Customers";
import Orders from "./admin/Orders";
import AIAssistant from "./admin/AIAssistant";
import CustomerAssistant from "./pages/CustomerAssistant";
import Notifications from "./pages/Notification";
import NotificationsPermission from "./main_component/NotificationPermission";
function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/shop/api/products/") //api from which our products data will come from
      .then((res) => res.json())
      .then((data) => {
        const categoryMap = {}; // Group products by category
        data.forEach((product) => {
          if (!categoryMap[product.category]) {
            //if curr category doesn't exist, create empty array for it
            categoryMap[product.category] = [];
          }
          categoryMap[product.category].push(product); //if it does exist, push product to that category's array
        });

        // Build allProducts in the format Home.jsx expects
        const formatted = Object.entries(categoryMap).map(
          ([category, products]) => {
            //for each category, create slides of 4 products each
            const slides = [];
            for (let i = 0; i < products.length; i += 4) {
              slides.push(products.slice(i, i + 4));
            }
            const nSlides = slides.length;
            return [
              category,
              slides,
              Array.from({ length: nSlides }, (_, i) => i),
            ];
          },
        );

        setAllProducts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {})
        .catch((error) => {
          console.log("Registration failed:", error);
        });
    }
  }, []);

  return (
    // CartProvider wraps everything so all pages can access cart
    <CartProvider>
      {/* BrowserRouter enables URL-based navigation, tells React to handle routing when URLs change */}
      <AuthProvider>
        <BrowserRouter>
          <NotificationsPermission />
          <Routes>
            {/* USER SIDE */}
            <Route
              element={
                <UserLayout
                  allProducts={allProducts}
                  search={search}
                  setSearch={setSearch}
                />
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/ai" element={<CustomerAssistant />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<Confirm />} />
            </Route>

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ADMIN SIDE */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/orders" element={<Orders />} />

              <Route path="/admin/notifications" element={<Notifications />} />
              <Route path="/admin/ai" element={<AIAssistant />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;

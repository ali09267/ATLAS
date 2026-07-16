import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/Cart_Content";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";
import '../styles/Navbar.css'
function Navbar({ allProducts = [],search,setSearch }) {
  const [showLogout, setShowLogout] = useState(false);//if login then show logout
  const [showPopover, setShowPopover] = useState(false);//if click cart then show popover
  const [showLoginAlert, setShowLoginAlert] = useState(false);//if click checkout w/o login then show alert

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart, cartCount, clearCart } = useCart();
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    console.log("Current user:", user);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    logout();
    setShowLogout(false);
    navigate("/");
  };

  const productMap = {};
  allProducts.forEach(([title, slides]) => {
    slides.forEach((slide) => {
      slide.forEach((product) => {
        productMap[product.product_id] = product.product_name;
      });
    });
  });

  const cartItems = Object.entries(cart).filter(([id, qty]) => qty > 0);

  return (
   <>
   <div className="store-header">

      {/* Hamburger - Mobile Only */}
   <button
    className="navbar-toggler d-lg-none"
    type="button"
    data-bs-toggle="offcanvas"
    data-bs-target="#mobileMenu"
>
    <i className="bi bi-list fs-2 text-white"></i>
</button>
    <span className="store-title">🛍My Awesome Cart</span>
 <div className="store-user d-none d-lg-block">
        {user && <>Hi, {user.first_name} 👋</>}
    </div>

</div>

    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">

      {showLogout && (
        <Logout
          onConfirm={confirmLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}

      {showLoginAlert && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div className="card p-4 text-center" style={{ width: "350px" }}>
            <h5 className="mb-3">⚠️ Please login to checkout</h5>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-success"
                onClick={() => setShowLoginAlert(false)}>Login</Link>
              <button className="btn btn-secondary"
                onClick={() => setShowLoginAlert(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
       

       <div className="collapse navbar-collapse desktop-nav">

          {/* Nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" >Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tracker">Tracker</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
             <li className="nav-item">
              <Link className="nav-link" to="/ai" >AI Assistant</Link>
            </li>
           
          </ul>

          {/* Search bar */}

  <input
    className="form-control search-box"
    type="search"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />


          {/* User + Logout / Login */}
          <div className="d-flex gap-2 align-items-center my-2 my-lg-0 mx-2">
            {user ? (
              <>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link className="btn btn-success" to="/login">Login</Link>
            )}
          </div>

          {/* Cart button + popover */}
          <div className="position-relative my-2 my-lg-0" ref={popoverRef}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowPopover((prev) => !prev)}
            >
              Cart(<span>{cartCount}</span>)
            </button>

            {showPopover && cartItems.length > 0 && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "110%",
                minWidth: "250px",
                zIndex: 9999,
                backgroundColor: "white",
                color: "black",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}>
                <h4>🛒 Your Cart</h4>
                {cartItems.map(([id, qty], index) => (
                  <p key={id}>
                    <b>{index + 1}.</b> {productMap[id] || `Product #${id}`}
                    <span style={{ marginLeft: "auto", float: "right" }}>Qty: {qty}</span>
                  </p>
                ))}
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-primary w-50"
                    onClick={() => { clearCart(); setShowPopover(false); }}>
                    Clear Cart
                  </button>
                  <Link
                    to={user ? "/checkout" : "#"}
                    className="btn btn-primary w-50"
                    onClick={(e) => {
                      if (!user) { e.preventDefault(); setShowLoginAlert(true); }
                      else { setShowPopover(false); }
                    }}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>


    {/*Navbar (below bar) code */}

    <div
    className="offcanvas offcanvas-end text-bg-dark"
    tabIndex="1"
    id="mobileMenu"
>
    <div className="offcanvas-header">
      {user &&
            <div className="store-user">Hi, {user.first_name}👋</div>
        }
        <br/>

        <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
        ></button>
    </div>

    <div className="offcanvas-body">

            <Link
            className="nav-link mb-3 mx-3"
            to="/"
        >
            Home
        </Link>
        <Link
            className="nav-link mb-3 mx-3"
            to="/ai"
        >
            AI Assistant
        </Link>

        <Link
            className="nav-link mb-3 mx-3"
            to="/tracker"
        >
            Order Tracker
        </Link>

        <button
            className="btn btn-secondary w-100 mb-3"
            onClick={() => setShowPopover(false)}
        >
            Cart ({cartCount})
        </button>

        <Link
            className="nav-link mb-3"
            to="/about"
        >
            About Us
        </Link>

        {user ? (
            <button
                className="btn btn-danger w-100"
                onClick={handleLogout}
            >
                Logout
            </button>
        ) : (
            <Link
                className="btn btn-success w-100"
                to="/login"
            >
                Login
            </Link>
        )}

    </div>
</div>
    </>
  );
}

export default Navbar;
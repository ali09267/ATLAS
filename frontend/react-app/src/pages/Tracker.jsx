import { useEffect, useState } from "react";
import "../styles/Tracker.css";
import { Link } from "react-router-dom";

function Tracker() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

  // Fetch latest order when page loads
  useEffect(() => {
    fetchLatestOrder();
  }, []);

  // Debug: see order whenever state changes
  useEffect(() => {
    console.log("Current order:", order);
  }, [order]);

  async function fetchLatestOrder() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/shop/api/orders/latest/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await res.json();

      console.log("API Response:", data);

      setOrder(data);
    } catch (err) {
      console.log("Error fetching latest order:", err);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // LOADING STATE
  // -------------------------

  if (loading) {
    return (
      <div className="tracker-loading">
        <h3>Loading latest order...</h3>
      </div>
    );
  }

  // -------------------------
  // NO ORDER STATE
  // -------------------------

  if (!order) {
    return (
      <div className="tracker-empty">
        <div className="tracker-empty-icon">📦</div>

        <h2>No Orders Yet</h2>

        <p>Looks like you haven't placed any orders yet.</p>

        <Link className="tracker-shop-button" to="/">
          Shop Now
        </Link>
      </div>
    );
  }

  // -------------------------
  // CANCELLED ORDER
  // -------------------------

  if (order.status === "CANCELLED") {
    return (
      <div className="tracker-cancelled">
        <div className="tracker-cancelled-icon">❌</div>

        <h2>Order Cancelled</h2>

        <p>This order has been cancelled.</p>

        <p>Order #{order.id}</p>

        <Link className="tracker-shop-button" to="/">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // -------------------------
  // CURRENT ORDER STATUS
  // -------------------------

  const currentIndex = steps.indexOf(order.status);

  // -------------------------
  // MAIN TRACKER UI
  // -------------------------

  return (
    <div className="tracker-container">
      <h2 className="tracker-title">Latest Order</h2>

      {/* Order information */}
      <div className="tracker-order-card">
        <div className="tracker-order-header">
          <h3 className="tracker-order-id">Order #{order.id}</h3>

          <span className="tracker-order-status">{order.status}</span>
        </div>

        <div className="tracker-order-info">
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>

          <p>
            <strong>Total:</strong> Rs. {order.total_price}
          </p>
        </div>
      </div>

      {/* Order Progress */}
      <div className="tracker-timeline">
        {steps.map((step, index) => (
          <div className="tracker-step" key={step}>
            <div
              className={
                index <= currentIndex
                  ? "tracker-circle tracker-circle-active"
                  : "tracker-circle"
              }
            >
              {index <= currentIndex ? "✓" : ""}
            </div>

            <p className="tracker-step-label">{step}</p>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="tracker-products">
        <h3>Order Items</h3>

        {order.items.map((item) => (
          <div key={item.id} className="tracker-product">
            <img src={item.image} alt={item.product_name} />

            <div className="tracker-product-details">
              <h5>{item.product_name}</h5>

              <p>Quantity: {item.quantity}</p>

              <p>Rs. {item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="tracker-total">Total: Rs. {order.total_price}</div>
    </div>
  );
}

export default Tracker;

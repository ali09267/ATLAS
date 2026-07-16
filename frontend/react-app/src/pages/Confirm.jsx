import { useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../styles/Confirm.css";

function OrderConfirm() {
  const { orderId } = useParams();
  const hasFetched = useRef(false);

  const formattedId = String(orderId).padStart(5, "0");

  const today = new Date();
  const delivery = new Date();
  delivery.setDate(today.getDate() + 5);

  const fmt = (d) => d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  const fmtShort = (d) => d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });

  return (
    <div className="confirm-wrapper">

      <div className="check-circle">
        <span className="check-icon">✓</span>
      </div>

      <h2 className="confirm-title">Order confirmed!</h2>
      <p className="confirm-sub">Thank you. Your order has been placed successfully.</p>

      <div className="confirm-card">
        <p className="card-label">Order details</p>

        <div className="card-row">
          <span>Order ID</span>
          <span className="mono">#ORD-{formattedId}</span>
        </div>

        <div className="card-row">
          <span>Status</span>
          <span className="badge-pending">Pending</span>
        </div>

        <div className="card-row">
          <span>Date</span>
          <span>{fmt(today)}</span>
        </div>

        <hr className="divider" />

        <div className="card-row">
          <span>Total</span>
          <strong>Rs {sessionStorage.getItem("last_order_total") || "—"}</strong>
        </div>
      </div>

      <div className="delivery-box">
        <span className="delivery-icon">🚚</span>
        <div>
          <p className="delivery-title">Estimated delivery</p>
          <p className="delivery-sub">3–5 business days (by {fmtShort(delivery)})</p>
        </div>
      </div>

      <div className="confirm-actions">
        <Link to="/" className="btn btn-secondary">← Back to home</Link>
      </div>
    </div>
  );
}

export default OrderConfirm;
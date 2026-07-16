import { useState } from "react";
import { useCart } from "../cart/Cart_Content";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/CheckOut.css";
function Checkout({ allProducts = [] }) {
  const navigate = useNavigate();//hook
  const { cart } = useCart();
  const productMap = {};
  allProducts.forEach(([title, slides]) => {
    slides.forEach((slide) => {
      slide.forEach((product) => {
        productMap[product.product_id] = {
          name: product.product_name,
          price: product.price,
        };
      });
    });
  });

  const handleConfirm = async () => {
     const authCheck = await fetch("http://localhost:8000/shop/api/check-auth/", {
    credentials: "include",
  });
  const authData = await authCheck.json();
  console.log("Django sees user as:", authData);
  const token = localStorage.getItem('token') 
    const response = await fetch(
      "http://localhost:8000/shop/api/create-order/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        credentials: "include",
        
        body: JSON.stringify({
          cart,
          totalPrice,
        }),
        
      },
    );

    // const data = await response.json();

    // if (data.success) {
    //   navigate(`/order-success/${data.order_id}`);
    // }
    const data = await response.json();

    if (data.success) {
      navigate(`/order-success/${data.order_id}`); // navigate AFTER success
    } else {
      alert(data.error || "Order failed");
    }
  };

  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = productMap[id];
    return sum + (product ? product.price * qty : 0);
  }, 0);

  return (
    <>
      <div className="checkout-container">
        <div className="items-check">
          <h4 className="mb-3">🛒 Order Summary</h4>

          <ul className="list-group">
            {Object.entries(cart).map(([id, qty]) => (
              <li
                key={id}
                className="list-group-item d-flex justify-content-between align-items-center mb-4 items-list"
              >
                {productMap[id]?.name || `Product #${id}`}
                <span className="qty-chip">Qty: {qty}</span>
              </li>
            ))}
          </ul>

          <li className="list-group-item d-flex justify-content-between align-items-center mt-2 fw-bold">
            Total Items
            <span className="item-chip">
              {Object.values(cart).reduce((sum, qty) => sum + qty, 0)}
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center mt-2 fw-bold">
            Total Price
            <span className="badge bg-danger ">Rs {totalPrice}</span>
          </li>
          <div className="btn-div">
            <Link to="/" className="btn btn-secondary">
              ← Back
            </Link>
            <button className="btn btn-success" onClick={handleConfirm}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Checkout;

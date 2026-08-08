import { useEffect, useState } from "react";
import "../styles/Tracker.css";
import { Link } from "react-router-dom";
function Tracker() {
  const [order, setOrder] = useState(null); //display all orders of that particular user
  const [loading, setLoading] = useState(true); //loader/spinner to show while fetching data from the backend
  const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"]; //array of order statuses

  //0 if pending, 1 if confirmed, 2 if shipped, 3 if delivered, as we are displaying progress bar based on the order status
  useEffect(() => {
    console.log("Current order:", order);

    fetchLatestOrder(); //latest order always on top
  }, []);

  async function fetchLatestOrder() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/shop/api/orders/latest/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log("API Response:", res.data);

      setOrder(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h3>Loading...</h3>;
  }
  if (!order) {
    return (
      <div className="tracker-empty">
        <div className="empty-icon">📦</div>

        <h2>No Orders Yet</h2>

        <p>Looks like you haven't placed any orders yet.</p>

        <Link className="btn btn-primary" to="/">
          Shop Now
        </Link>
      </div>
    );
  }
  if (order.status === "CANCELLED") {
    return (
      <div className="tracker-cancelled">
        <h2>❌ Order Cancelled</h2>
        <p>This order has been cancelled.</p>
      </div>
    );
  }
  const currentIndex = steps.indexOf(order.status);

  return (
    <div>
      {steps.map((step, index) => (
        <div key={step}>
          {/*color those circles which are covered (means index<=currentIndex) and left those which are still to be reached */}
          <div className={index <= currentIndex ? "circle active" : "circle"} />

          <p>{step}</p>
          <h2>Latest Order</h2>

          <h3>Order #{order.id}</h3>

          <p>Status :{order.status}</p>

          <p>Date :{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      ))}

      <h2>Latest Order</h2>

      <h3>Order #{order.id}</h3>

      <p>Status :{order.status}</p>

      <p>Date :{new Date(order.created_at).toLocaleDateString()}</p>

      {/* Displaying the products in the order, there img, name, quantity, and price */}
      {order.items.map((item) => (
        <div key={item.id} className="tracker-product">
          <img src={item.image} />

          <div>
            <h5>{item.product_name}</h5>

            <p>Qty :{item.quantity}</p>

            <p>
              Rs.
              {item.price}
            </p>
          </div>
        </div>
      ))}
      {order.items.map((item) => (
        <div key={item.id} className="tracker-product">
          <img src={item.image} />

          <div>
            <h5>{item.product_name}</h5>

            <p>Qty :{item.quantity}</p>

            <p>
              Rs.
              {item.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tracker;

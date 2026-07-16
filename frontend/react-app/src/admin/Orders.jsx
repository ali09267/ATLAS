import { useEffect, useState } from "react";
import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        console.log("orders: ", data);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleStatusChange = (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    );
  };

  const handleSave = async (id) => {
    console.log("patch is called");
    const order = orders.find((o) => o.id === id);
    await fetch(
      `http://127.0.0.1:8000/shop/api/orders/${id}/status/`,

      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: order.status,
        }),
      },
    );

    alert("Saved Successfully");
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h2>Orders Management</h2>
          <p>Monitor and manage customer orders.</p>
        </div>

        <div className="orders-count">{orders.length} Orders</div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Items</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">#{order.id}</span>
                  </td>

                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.user_name?.charAt(0).toUpperCase()}
                      </div>

                      <span>{order.user_name}</span>
                    </div>
                  </td>

                  <td>
                    <div className="products-dropdown">
                      <button className="products-btn">
                        {order.items.length} Products ▼
                      </button>

                      <div className="products-menu">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.product_name}`}
                            className="product-row"
                          >
                            <div className="product-name">
                              {item.product_name}
                            </div>

                            <div className="product-details">
                              Qty : {item.quantity}
                              {item.price && (
                                <>
                                  <br />
                                  Rs. {item.price}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="items-badge">{order.items.length}</span>
                  </td>

                  <td>
                    <select
                      className={`status-select ${order.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">
                        Rider Out For Delivery
                      </option>
                      <option value="CONFIRMED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="save-btn"
                      onClick={() => handleSave(order.id)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-orders">
                  No Orders Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;

import { useEffect, useState } from "react";
import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page = 1, searchValue = "") => {
    try {
      const params = new URLSearchParams({
        page: page,
      });

      if (searchValue.trim()) {
        params.append("search", searchValue.trim());
      }

      const response = await fetch(
        `http://127.0.0.1:8000/shop/api/orders/?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      console.log("Fetched order data:", data);

      setOrders(data.results || []);

      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, search);
  }, [currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleStatusChange = (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    );
  };

  const handleSave = async (id) => {
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

    alert("Notification Sent Successfully");
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
                  {/* Order ID */}
                  <td>
                    <span className="order-id">#{order.id}</span>
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.customer_name?.charAt(0).toUpperCase()}
                      </div>

                      <span>{order.customer_name}</span>
                    </div>
                  </td>

                  {/* Ordered Products */}
                  <td>
                    <div className="products-dropdown">
                      <button className="products-btn">
                        {order.items?.length || 0} Products ▼
                      </button>

                      <div className="products-menu">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="product-row"
                          >
                            <div className="product-name">
                              {item.product_name}
                            </div>

                            <div className="product-details">
                              Qty: {item.quantity}
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

                  {/* Number of Items */}
                  <td>
                    <span className="items-badge">
                      {order.items?.length || 0}
                    </span>
                  </td>

                  {/* Status */}
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

                      <option value="SHIPPED">Rider Out For Delivery</option>

                      <option value="DELIVERED">Delivered</option>

                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  {/* Save */}
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
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button
            className="btn btn-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((previousPage) => previousPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;

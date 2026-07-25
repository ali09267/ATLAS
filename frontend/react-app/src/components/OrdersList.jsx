import "../styles/OrdersList.css"

function OrdersList({ orders }) {

    if (!orders || orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <div className="orders-list">
             {orders.map((order)=>(//loop through every order
                <div key={order.id} className="order-card">
                    {/*design of each order card */}
                     <h5>
        📦 Order #{order.id}
    </h5>

    <p>
        <strong>Status:</strong> {order.status}
    </p>

    <p>
        <strong>Date:</strong>{" "}
        {new Date(order.created_at).toLocaleDateString()}
    </p>

    <h6>Products</h6>

    <ul>

        {order.items.map((item,index)=>(

            <li key={index}>

                {item.product_name}

                ×

                {item.quantity}

            </li>

        ))}

    </ul>


                </div>
             ))}
        </div>
    );
}

export default OrdersList;

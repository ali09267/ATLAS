import { Link } from "react-router-dom";
import { useCart } from "../cart/Cart_Content";
import '../styles/ProductCard.css';
function ProductCard({ product, className = "" }){
    const {cart, addToCart, increaseQty, decreaseQty} = useCart();
    const qty = cart[product.product_id] || 0;

    return(
        <div className={`${className} mb-4`}>
      <div className="card product-card h-100 text-center bg-dark text-white">
        <img
          src={product.image}
          className="card-img-top product-img"
          alt={product.product_name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="product-title">{product.product_name}</h5>

          <p className="product-description">{product.desc?.slice(0, 45)}...</p>


          <div className="mt-auto d-flex gap-2 w-100 button-area">
            {qty === 0 ? (
              <button
                className="add-cart-btn"
                onClick={() => addToCart(product.product_id)}
              >
                Add To Cart
              </button>
            ) : (
              <div className="qty-container">
                <button
                  className="qty-btn"
                  onClick={() => decreaseQty(product.product_id)}
                >
                  -
                </button>

                <span>{qty}</span>

                <button
                  className="qty-btn"
                  onClick={() => increaseQty(product.product_id)}
                >
                  +
                </button>
              </div>
            )}

            <Link
              to={`products/${product.product_id}`}
              className="quick-view-btn"
            >
              Quick View
            </Link>
          </div>
        </div>
      </div>
    </div>
    )
}

export default ProductCard
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../cart/Cart_Content'

function ProductDetail() {
  const { id } = useParams()  // gets product id from URL
  const { cart, addToCart, increaseQty, decreaseQty } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/shop/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching product:", err)
        setLoading(false)
      })
  }, [id])

  useEffect(()=>{
      if(product){//if user click a valid quick view product

        fetch(
            "http://127.0.0.1:8000/shop/api/track-view/",//call this view function from django 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${localStorage.getItem("token")}`//is this user allow to do it
                },
                body: JSON.stringify({
                    product_id: product.product_id
                })
            }
        );

    }
  },[product])

  if (loading) return <p className="text-center mt-5">Loading...</p>
  console.log("Product ",product);
  if (!product) return <p className="text-center mt-5">Product not found</p>

  const qty = cart[product.product_id] || 0

  return (
    
    <div className="container my-4">
      <div className="row">

        {/* Left: image + buttons */}
        <div className="col-md-4">
          <div className="row">
            <img
              src={product.image}
              alt={product.product_name}
              style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>

          {/* Add to cart / qty controls */}
          <div className="mt-3">
            {qty === 0 ? (
              <button
                className="btn btn-primary me-2"
                onClick={() => addToCart(product.product_id)}
              >
                Add To Cart
              </button>
            ) : (
              <div className="d-inline-flex align-items-center gap-2 me-2">
                <button className="btn btn-outline-secondary" onClick={() => decreaseQty(product.product_id)}>-</button>
                <span>{qty}</span>
                <button className="btn btn-outline-secondary" onClick={() => increaseQty(product.product_id)}>+</button>
              </div>
            )}

            <Link to="/" className="btn btn-secondary">
              ← Back
            </Link>
          </div>
        </div>

        {/* Right: product info */}
        <div className="col-md-8">
          <h3>{product.product_name}</h3>
          <p><b>Price:</b> Rs. {product.price}</p>
          <p><b>Category:</b> {product.category}</p>
          <p>{product.desc}</p>
        </div>

      </div>
    </div>
  )
}

export default ProductDetail
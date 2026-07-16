import ProductCard from "./ProductCard";

function ProductGrid({products}){

    if (!products || products.length === 0) {
    return (
      <div className="mt-3">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* Bootstrap Grid */}
      <div className="row">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            className="col-md-3 mb-4"
          />
        ))}
      </div>
    </div>
  )
}
export default ProductGrid;
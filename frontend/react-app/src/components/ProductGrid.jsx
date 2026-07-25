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
      <div className="row g-3">

    {products.map(product=>(

       <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.product_id}>
    <ProductCard product={product} />
</div>

    ))}

</div>
    </div>
  )
}
export default ProductGrid;
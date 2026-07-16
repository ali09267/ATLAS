import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useOutletContext } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductGrid from "../components/ProductGrid";
import ProductCarousel from "../components/ProductCarousel";
function Home() {
  const { allProducts, search } = useOutletContext();

  const [recommended, setRecommended] = useState([]);
  const [results, setResults] = useState([]);
  
  // ---------------------------
  // Recommended products API
  // ---------------------------
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/api/recommendations/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRecommended(data));
  }, []);

  // ---------------------------
  // Live Search API (debounced)
  // ---------------------------
  useEffect(() => {
    if (!search || search.trim() === "") {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      fetch(`http://127.0.0.1:8000/shop/api/search/?q=${search}`)
        .then((res) => res.json())
        .then((data) => setResults(data));
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

        const recommendationSlides = [];

for (let i = 0; i < recommended.length; i += 4) {
  recommendationSlides.push(recommended.slice(i, i + 4));
}

  return (
    <div className="container my-4">

<ProductCarousel
    id="recommendedCarousel"
    title="Recommended for you"
    products={recommended}
/>
 

      {/* ---------------- Search Results ---------------- */}

      {search && search.trim() !== "" ? (
        <>
          <h3 className="my-3">Search Results</h3>

          <div className="row">
            {results.length > 0 ? (
              results.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  className="col-md-3 mb-3"
                />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>
        </>
      ) : (
        /* ---------------- Product Carousel ---------------- */

        allProducts.map((category, index) => {
    const [title, slides] = category;

    // Flatten slides back into one array
    const products = slides.flat();

    return (
        <ProductCarousel
            key={index}
            id={`carousel${index}`}
            title={title}
            products={products}
        />
    );
})
      )}
    </div>
  );
}

export default Home;
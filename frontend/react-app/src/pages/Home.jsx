import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useOutletContext } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";

function Home() {
  const { allProducts, search } = useOutletContext();

  const [recommended, setRecommended] = useState([]);

  const [results, setResults] = useState([]);

  // --------------------------------
  // Recommended products API
  // --------------------------------

  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/api/recommendations/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())

      .then((data) => setRecommended(data))

      .catch((error) => {
        console.error("Recommendation error:", error);
      });
  }, []);

  // --------------------------------
  // Live Search API
  // --------------------------------

  useEffect(() => {
    if (!search || search.trim() === "") {
      setResults([]);

      return;
    }

    const delay = setTimeout(() => {
      fetch(`http://127.0.0.1:8000/shop/api/search/?q=${search}`)
        .then((res) => res.json())

        .then((data) => setResults(data))

        .catch((error) => {
          console.error("Search error:", error);
        });
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <main className="atlas-home">
      {/* Background glowing effects */}

      {/* Main products */}

      <div className="container my-4 home-content">
        <ProductCarousel
          id="recommendedCarousel"
          title="Recommended for you"
          products={recommended}
        />

        {/* Search Results */}

        {search && search.trim() !== "" ? (
          <section className="home-search-section">
            <div className="home-section-heading">
              <div>
                <span>SEARCH</span>

                <h3>Search Results</h3>
              </div>
            </div>

            <div className="row">
              {results.length > 0 ? (
                results.map((product) => (
                  <ProductCard
                    key={product.product_id}
                    product={product}
                    className="
                            col-md-3
                            mb-4
                          "
                  />
                ))
              ) : (
                <div className="home-empty-result">
                  <div>⌕</div>

                  <h4>No products found</h4>

                  <p>Try searching with another product name.</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          allProducts.map((category, index) => {
            const [title, slides] = category;

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
    </main>
  );
}

export default Home;

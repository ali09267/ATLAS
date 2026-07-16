import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function ProductCarousel({ id, title, products }) {

  const [productsPerSlide, setProductsPerSlide] = useState(4);

  useEffect(() => {

    function handleResize() {

      if (window.innerWidth < 768) {
        setProductsPerSlide(2);
      }
      else if (window.innerWidth < 1070) {
        setProductsPerSlide(3);
      }
      else {
        setProductsPerSlide(4);
      }

    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  const slides = [];

  for (let i = 0; i < products.length; i += productsPerSlide) {
    slides.push(products.slice(i, i + productsPerSlide));
  }

  return (
    <div className="mb-5">

      <h3 className="my-4">{title}</h3>

      <div
        id={id}
        className="carousel slide"
        data-bs-ride="carousel"
      >

        <div className="carousel-indicators">

          {slides.map((_, index) => (

            <button
              key={index}
              type="button"
              data-bs-target={`#${id}`}
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
            />

          ))}

        </div>

        <div className="carousel-inner">

          {slides.map((slide, slideIndex) => (

            <div
              key={slideIndex}
              className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}
            >

              <div className="row justify-content-center">

                {slide.map((product) => (

                  <ProductCard
                    key={product.product_id}
                    product={product}
                    className={
                      productsPerSlide === 4
                        ? "col-lg-3"
                        : productsPerSlide === 3
                        ? "col-md-4"
                        : "col-6"
                    }
                  />

                ))}

              </div>

            </div>

          ))}

        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#${id}`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#${id}`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>

    </div>
  );
}

export default ProductCarousel;
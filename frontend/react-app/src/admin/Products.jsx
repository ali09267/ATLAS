import { useEffect, useState, useRef } from "react";
import "../styles/Products.css";
import SnackBar from "../main_component/SnackBar";
function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletedProduct, setDeletedProduct] = useState(null);

  const [deletedProductIndex, setDeletedProductIndex] = useState(null); //since idx of deleted product is needed to restore it back to the same position in the products array when undoing deletion

  const [isSnackbarClosing, setIsSnackbarClosing] = useState(false); //for controlling the closing animation of the snackbar when user clicks undo or when the timer runs out

  const deleteTimerRef = useRef(null); //

  const snackbarCloseTimerRef = useRef(null);

  const fetchProducts = async (page = 1) => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/products/?page=${page}`,
    ); //fetch products with page number (if page number 4 then fetch 15-20 products)

    const data = await res.json();
    setProducts(data.results); //set those products in state var
    setTotalPages(data.total_pages); //if 20 products then 4 pages, or if 22 products then 22/5=4.4 ~ 5 pages
  };

  useEffect(() => {
    fetchProducts(currentPage); //call this function everytime the page changes (new page, new products)
  }, [currentPage]);

  //to delete a product permanently from the backend after 5 seconds of deletion, if user doesn't click undo
  const permanentlyDeleteProduct = async (id) => {
    try {
      //call the Django API to delete the product permanently from the backend
      const response = await fetch(
        `http://127.0.0.1:8000/shop/api/edit_products/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Product could not be deleted.");
      }

      /*
      Remove snackbar data after Django confirms
      that the product was deleted.
    */
      setDeletedProduct(null);

      setDeletedProductIndex(null);

      setIsSnackbarClosing(false);
    } catch (error) {
      console.error("Permanent product deletion failed:", error);

      /*
      If Django deletion fails, restore the product
      to the current table.
    */
      setProducts((currentProducts) => {
        const restoredProducts = [...currentProducts]; //spread operator to create a copy of the current products array

        const safeIndex = Math.min(
          deletedProductIndex ?? restoredProducts.length,
          restoredProducts.length,
        );

        restoredProducts.splice(safeIndex, 0, deletedProduct);

        return restoredProducts;
      });

      setDeletedProduct(null);

      setDeletedProductIndex(null);

      setIsSnackbarClosing(false);
    }
  };

  const deleteProduct = async (productId) => {
    /*
    Find the complete product object.

    We need the complete object because Undo should restore
    the product without requesting it again from Django.
  */
    const productToDelete = products.find(
      (product) => product.product_id === productId,
    );
    //original position of the product in the products array before deletion, so that we can restore it back to the same position when undoing deletion
    const productIndex = products.findIndex(
      (product) => product.product_id === productId,
    );

    //what if product doesn't exist(safety check)
    if (!productToDelete || productIndex === -1) {
      return;
    }

    if (deletedProduct) {
      permanentlyDeleteProduct(deletedProduct.product_id);
    }

    /*
    Clear any previous timers.
  */
    clearTimeout(deleteTimerRef.current);

    clearTimeout(snackbarCloseTimerRef.current);

    /*
    Save the product and its original position.
  */
    setDeletedProduct(productToDelete);

    setDeletedProductIndex(productIndex);

    setIsSnackbarClosing(false);
    /*
    Remove the product immediately from the UI.

    Notice that Django is NOT called here.
  */
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.product_id !== productId),
    );

    /*
    Start the blur/fade animation shortly before
    the full five seconds finish.
  */
    snackbarCloseTimerRef.current = setTimeout(() => {
      setIsSnackbarClosing(true);
    }, 3500);

    /*
    After five seconds, permanently delete
    the product from Django.
  */
    deleteTimerRef.current = setTimeout(() => {
      permanentlyDeleteProduct(productId);
    }, 5000);
  };

  const undoDelete = () => {
    /*
    If there is no pending deleted product,
    there is nothing to restore.
  */
    if (!deletedProduct) {
      return;
    }

    /*
    Stop the permanent deletion timer.
  */
    clearTimeout(deleteTimerRef.current);

    /*
    Stop the snackbar closing animation.
  */
    clearTimeout(snackbarCloseTimerRef.current);

    /*
    Put the product back at its original position.
  */
    setProducts((currentProducts) => {
      const restoredProducts = [...currentProducts];

      const safeIndex = Math.min(deletedProductIndex, restoredProducts.length);

      restoredProducts.splice(safeIndex, 0, deletedProduct);

      return restoredProducts;
    });

    /*
    Remove the snackbar.
  */
    setDeletedProduct(null);

    setDeletedProductIndex(null);

    setIsSnackbarClosing(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(deleteTimerRef.current);

      clearTimeout(snackbarCloseTimerRef.current);
    };
  }, []);

  const handleUpdate = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/edit_products/${editProduct.product_id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (res.ok) {
      const updated = await res.json();

      setProducts(
        products.map((p) =>
          p.product_id === updated.product_id ? updated : p,
        ),
      );
      setEditProduct(null);
    }
  };

  const filtered = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase()),
  );

  console.log("editProduct =", editProduct);

  return (
    <div className="products-page">
      {/* ================= PAGE HEADER ================= */}

      <div className="products-header">
        <div>
          <h2>Products Management</h2>

          <p>View, search, edit, and manage store products.</p>
        </div>

        {/* Product count card */}
        <div className="products-count-card">
          <span>{filtered.length}</span>
          <small>Products</small>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="products-toolbar">
        <div className="product-search-wrapper">
          <span className="product-search-icon">⌕</span>

          <input
            className="product-search"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= PRODUCTS TABLE ================= */}

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th className="products-actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => {
                /*
              Take the first letter of the product name.

              Example:
              "Nike Running Shoes" -> N
            */
                const productLetter =
                  p.product_name?.charAt(0).toUpperCase() || "P";

                return (
                  <tr key={p.product_id}>
                    {/* PRODUCT ID */}
                    <td>
                      <span className="product-id-badge">#{p.product_id}</span>
                    </td>

                    {/* PRODUCT NAME */}
                    <td>
                      <div className="product-info">
                        {/* Product image if available */}
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.product_name}
                            className="product-table-image"
                          />
                        ) : (
                          /*
                        If the product has no image,
                        show the first letter instead.
                      */
                          <div className="product-avatar">{productLetter}</div>
                        )}

                        <span className="product-name">{p.product_name}</span>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td>
                      <span className="product-category">{p.category}</span>
                    </td>

                    {/* PRICE */}
                    <td>
                      <span className="product-price">Rs. {p.price}</span>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="product-actions">
                        {/* EDIT */}
                        <button
                          className="product-action-btn edit-product-btn"
                          onClick={() => {
                            console.log("Edit button clicked");

                            setEditProduct(p);

                            setFormData({
                              product_name: p.product_name || "",

                              price: p.price || "",
                            });
                          }}
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          className="product-action-btn delete-product-btn"
                          onClick={() => deleteProduct(p.product_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* EMPTY STATE */
              <tr>
                <td colSpan="5">
                  <div className="products-empty-state">
                    <h3>No products found</h3>

                    <p>Try another product name or category.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="products-pagination">
        <button
          className="products-pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((previousPage) => previousPage - 1)}
        >
          ← Previous
        </button>

        <div className="products-page-indicator">
          <span>Page</span>

          <strong>{currentPage}</strong>

          <span>of {totalPages}</span>
        </div>

        <button
          className="products-pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
        >
          Next →
        </button>
      </div>

      {/* ================= EDIT MODAL ================= */}

      {editProduct && (
        <div className="modal-backdrop-custom">
          <div className="modal-box product-modal">
            {/* Modal heading */}
            <div className="product-modal-header">
              <div>
                <h4>Edit Product</h4>

                <p>Update the product information.</p>
              </div>

              {/* Close button */}
              <button
                className="product-modal-close"
                onClick={() => setEditProduct(null)}
              >
                ×
              </button>
            </div>

            {/* Product form */}
            <div className="product-modal-form">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="Enter product name"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    product_name: e.target.value,
                  })
                }
              />

              <label>Price</label>

              <input
                type="number"
                placeholder="Enter product price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />
            </div>

            {/* Modal buttons */}
            <div className="product-modal-actions">
              <button
                className="product-modal-cancel"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>

              <button className="product-modal-save" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SNACKBAR ================= */}

      {deletedProduct && (
        <SnackBar message={deletedProduct.product_name} onUndo={undoDelete} />
      )}
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import '../styles/Products.css';
function Products() {
   console.log("Rendering Products Component");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editProduct,setEditProduct]=useState(null);
  const [formData,setFormData]=useState({
    product_name: "",
    price: "",
  });
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`http://127.0.0.1:8000/shop/api/products/${id}/`, {
      method: "DELETE",
    });

    setProducts(products.filter(p => p.product_id !== id));
  };

    const handleUpdate = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/edit_products/${editProduct.product_id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
    );

    if (res.ok) {
      const updated = await res.json();

      setProducts(products.map(p =>
    p.product_id === updated.product_id ? updated : p
));
      setEditProduct(null);
    }
  };

  const filtered = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  console.log("editProduct =", editProduct);

  return (
    <div className="container mt-4">

      <h2>Products</h2>

      <input
        className="form-control my-3"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_name}</td>
              <td>{p.price}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    console.log("edit btn clicked")
                    setEditProduct(p);
                   setFormData({
  product_name: p.product_name,
  price: p.price,
});
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.product_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

         {/* ---------------- EDIT MODAL ---------------- */}
      {editProduct && (
        <div className="modal-backdrop-custom">
          <div className="modal-box">

            <h4>Edit Product</h4>

            <input
              className="form-control mb-2"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />

            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setEditProduct(null)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>

   
  );
}

export default Products;
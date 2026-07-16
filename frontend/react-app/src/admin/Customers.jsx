import { useEffect, useState } from "react";

function Customers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/api/customers/")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        setUsers(data)
    
  });
  }, []);

  const filtered = users.filter(u =>
    u.first_name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- UPDATE USER ----------------
  const handleUpdate = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/customers/${editUser.id}/`,
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

      setUsers(users.map(u =>
        u.id === updated.id ? updated : u
      ));

      setEditUser(null);
    }
  };

  // ---------------- DELETE USER ----------------
  const handleDelete = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/customers/${deleteUser.id}/`,
      {
        method: "DELETE"
      }
    );

    if (res.ok) {
      setUsers(users.filter(u => u.id !== deleteUser.id));
      setDeleteUser(null);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-3">Customers</h2>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name} </td>
              <td>{user.email}</td>

              <td>
                {/* EDIT BUTTON */}
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditUser(user);
                    setFormData({
                      first_name: user.first_name || "",
                      last_name: user.last_name || "",
                      email: user.email
                    });
                  }}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteUser(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- EDIT MODAL ---------------- */}
      {editUser && (
        <div className="modal-backdrop-custom">
          <div className="modal-box">

            <h4>Edit Customer</h4>

            <input
              className="form-control mb-2"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Save
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* ---------------- DELETE MODAL ---------------- */}
      {deleteUser && (
        <div className="modal-backdrop-custom">
          <div className="modal-box text-center">

            <h4>Delete Customer?</h4>
            <p>Are you sure you want to delete <b>{deleteUser.username}</b>?</p>

            <button
              className="btn btn-danger me-2"
              onClick={handleDelete}
            >
              Yes, Delete
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setDeleteUser(null)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* ---------------- CSS ---------------- */}
      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal-box {
          background: #1e1e1e;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          color: white;
        }
      `}</style>

    </div>
  );
}

export default Customers;
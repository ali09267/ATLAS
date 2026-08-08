import { useEffect, useState } from "react";
import "../styles/Customers.css";
import { useRef } from "react";
import SnackBar from "../main_component/SnackBar";
function Customers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const deleteTimerRef = useRef(null);

  const fetchCustomers = async (page = 1, searchValue = "") => {
    try {
      const params = new URLSearchParams({
        page: page,
      });

      if (searchValue.trim()) {
        params.append("search", searchValue.trim());
      }

      const response = await fetch(
        `http://127.0.0.1:8000/shop/api/customers/?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      console.log("Fetched customers:", data.results);
      setUsers(data.results || []);

      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, search);
  }, [currentPage, search]);

  users.filter((u) =>
    u.first_name.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------------- UPDATE USER ----------------
  const handleUpdate = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/shop/api/customers/${editUser.id}/`,
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

      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));

      setEditUser(null);
    }
  };

  // ---------------- DELETE USER ----------------
  const handleDelete = (user) => {
    // If another customer is waiting for Undo,
    // permanently delete that customer first.
    if (pendingDeleteUser) {
      clearTimeout(deleteTimerRef.current);

      fetch(
        `http://127.0.0.1:8000/shop/api/customers/${pendingDeleteUser.id}/`,
        {
          method: "DELETE",
        },
      );
    }

    // Save the selected customer in a local variable
    const userToDelete = user;

    console.log("Deleting user:", userToDelete);

    // Remove customer from the UI immediately
    setUsers((currentUsers) =>
      currentUsers.filter((currentUser) => currentUser.id !== userToDelete.id),
    );

    // Save customer temporarily for Undo
    setPendingDeleteUser(userToDelete);

    // Show snackbar
    setShowSnackBar(true);

    // Close the confirmation modal
    setDeleteUser(null);

    // Save the timer ID in the ref
    deleteTimerRef.current = setTimeout(async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/shop/api/customers/${userToDelete.id}/`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        // Restore customer if backend deletion fails
        setUsers((currentUsers) => [...currentUsers, userToDelete]);
      }

      // Hide snackbar
      setShowSnackBar(false);

      // Clear pending customer
      setPendingDeleteUser(null);

      // Clear timer reference
      deleteTimerRef.current = null;
    }, 5000);
  };

  const undoDelete = () => {
    // Stop the 5-second timer
    clearTimeout(deleteTimerRef.current); //clear the timer to prevent permanent deletion

    // Restore the deleted customer in the UI
    setUsers((currentUsers) => [
      pendingDeleteUser, //all the customers that were there before deletion
      ...currentUsers, //spread operator to add the rest of the customers after the deleted one
    ]);

    // Hide the snackbar
    setShowSnackBar(false);

    // Clear the temporarily deleted customer
    setPendingDeleteUser(null);

    // Clear the timer reference
    deleteTimerRef.current = null;
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h2>Customers Management</h2>

          <p>View, search, and manage registered customers.</p>
        </div>

        {/* Total customers card */}
        <div className="customers-count-card">
          <span>{users.length}</span>
          <small>Customers</small>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="customers-toolbar">
        <div className="customer-search-wrapper">
          <span className="search-icon">⌕</span>

          <input
            className="customer-search"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= CUSTOMERS TABLE ================= */}

      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer</th>
              <th>Email Address</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                /*
              Create a full name.

              If first_name and last_name exist:
              Ali Ahmed

              If both are empty:
              use username

              If username is also unavailable:
              show "Unnamed Customer"
            */
                const customerName =
                  `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                  user.username ||
                  "Unnamed Customer";

                /*
              Get the first letter for the circular avatar.

              Example:
              Ali Ahmed -> A
            */
                const avatarLetter = customerName.charAt(0).toUpperCase();

                return (
                  <tr key={user.id}>
                    {/* CUSTOMER ID */}
                    <td>
                      <span className="customer-id-badge">#{user.id}</span>
                    </td>

                    {/* CUSTOMER AVATAR + NAME */}
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">{avatarLetter}</div>

                        <span className="customer-name">{customerName}</span>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td>
                      <span className="customer-email">{user.email}</span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td>
                      <div className="customer-actions">
                        {/* EDIT */}
                        <button
                          className="customer-action-btn edit-customer-btn"
                          onClick={() => {
                            setEditUser(user);

                            setFormData({
                              first_name: user.first_name || "",
                              last_name: user.last_name || "",
                              email: user.email || "",
                            });
                          }}
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          className="customer-action-btn delete-customer-btn"
                          onClick={() => {
                            handleDelete(user);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /*
            This is the empty state.

            It appears when:
            - there are no customers
            - the search finds no matching customer
          */
              <tr>
                <td colSpan="4">
                  <div className="customers-empty-state">
                    <h3>No customers found</h3>

                    <p>Try changing your search or check again later.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}

      {editUser && (
        <div className="modal-backdrop-custom">
          <div className="modal-box customer-modal">
            <div className="modal-header">
              <div>
                <h4>Edit Customer</h4>

                <p>Update the customer's account information.</p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setEditUser(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-form">
              <label>First Name</label>

              <input
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.target.value,
                  })
                }
              />

              <label>Last Name</label>

              <input
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_name: e.target.value,
                  })
                }
              />

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>

              <button className="modal-save-btn" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showSnackBar && pendingDeleteUser && (
        <SnackBar
          message={`${pendingDeleteUser.first_name} ${pendingDeleteUser.last_name}`}
          onUndo={undoDelete}
        />
      )}

      {/* ================= PAGINATION ================= */}

      <div className="customers-pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((previousPage) => previousPage - 1)}
        >
          ← Previous
        </button>

        <div className="page-indicator">
          <span>Page</span>

          <strong>{currentPage}</strong>

          <span>of {totalPages}</span>
        </div>

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Customers;

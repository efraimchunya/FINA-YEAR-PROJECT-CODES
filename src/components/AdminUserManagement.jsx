import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateBookingStatus } from "../api";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch users");
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    deleteUser(id)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => {
        setError("Failed to delete user");
        console.error(err);
      });
  };

  // Example: Update booking status (adjust to your user status if needed)
  const handleUpdateStatus = (id, newStatus) => {
    updateBookingStatus(id, newStatus)
      .then(() => {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, status: newStatus } : user
          )
        );
      })
      .catch((err) => {
        setError("Failed to update status");
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Admin User Management</h2>
      <button onClick={fetchUsers}>Refresh Users</button>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ id, fullName, email, role }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{fullName}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>
                  <button onClick={() => handleDelete(id)}>Delete</button>
                  {/* Add other actions like status update buttons here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserManagement;

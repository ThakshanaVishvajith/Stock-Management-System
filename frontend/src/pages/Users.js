import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import '../styles/Management.css';
import AdminLayout from "../layout/AdminLayout";
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const UsersPage = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_rep",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/auth/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
    setForm({ name: "", email: "", password: "", role: "sales_rep" });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setForm({ name: "", email: "", password: "", role: "sales_rep" });
      fetchUsers();
    } catch (err) {
      alert("Failed to add user");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/${id}`,
        {
          name: form.name,
          role: form.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ name: "", email: "", password: "", role: "sales_rep" });
      fetchUsers();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  return (
    <AdminLayout>
      <div className="users-page">
        <h2>Users Management</h2>

        <form className="add-user-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="sales_rep">Sales Representative</option>
            <option value="stock_manager">Stock Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  {u._id === form._id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td>{u.email}</td>
                <td>
                  {u._id === form._id ? (
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    >
                      <option value="sales_rep">Sales Representative</option>
                      <option value="stock_manager">Stock Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td>
                  {u._id === form._id ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(u._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setForm({})}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => setForm(u)}>
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(u._id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;

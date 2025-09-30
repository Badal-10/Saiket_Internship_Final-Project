/* eslint-disable no-unused-vars */
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Utils/Api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "asc" });
  const adminName = localStorage.getItem("adminName") || "Admin";

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.warning("Name and email required");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form);
        toast.info("User updated Successfully");
      } else {
        await api.post("/users", form);
        toast.success("User created Successfully");
      }
      setForm({ name: "", email: "", age: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name || "", email: user.email || "", age: user.age ?? "" });
    setEditingId(user.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm({ name: "", email: "", age: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.error("User deleted Successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (key === "age") {
        return direction === "asc" ? a.age - b.age : b.age - a.age;
      } else if (key === "createdAt") {
        return direction === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
    setFilteredUsers(sortedUsers);
  };

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("-");
    handleSort(key, direction);
  };

  return (
    <div className="flex-1 px-6 py-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">👋 Welcome, {adminName}!</h1>
            <p className="text-sm text-white/80">Manage your users below.</p>
          </div>
          <div className="bg-white/20 px-4 py-2 rounded-md text-black">
            Total users: <strong>{filteredUsers.length}</strong>
          </div>
        </div>

        {/* form card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit user" : "Add user"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange}
              className="p-3 rounded bg-transparent border border-white/30" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
              className="p-3 rounded bg-transparent border border-white/30" />
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange}
              className="p-3 rounded bg-transparent border border-white/30" />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded bg-gray-200 text-black">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 w-full">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 p-3 rounded bg-transparent border border-white/30"
            />
            <div className="relative">
              <select
                onChange={handleSortChange}
                className="p-3 rounded bg-transparent border border-white/30"
              >
                <option value="createdAt-asc">Sort by Created At (Ascending)</option>
                <option value="createdAt-desc">Sort by Created At (Descending)</option>
                <option value="name-asc">Sort by Name (A-Z)</option>
                <option value="name-desc">Sort by Name (Z-A)</option>
                <option value="age-asc">Sort by Age (Ascending)</option>
                <option value="age-desc">Sort by Age (Descending)</option>
              </select>
            </div>
          </div>
        </div>

        {/* table card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-white/80">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Updated At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} className="border-b last:border-b-0 hover:bg-white/5">
                      <td className="p-3 align-top">{i + 1}</td>
                      <td className="p-3 align-top">{u.name}</td>
                      <td className="p-3 align-top">{u.email}</td>
                      <td className="p-3 align-top">{u.age ?? "-"}</td>
                      <td className="p-3 align-top">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                      <td className="p-3 align-top">{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "-"}</td>
                      <td className="p-3 align-top flex gap-2">
                        <button onClick={() => handleEdit(u)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                        <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

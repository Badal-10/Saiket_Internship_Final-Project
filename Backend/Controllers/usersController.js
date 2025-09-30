const db = require("../db");

// A simple helper function to validate email format
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};


// ➕ Create User (linked to logged-in admin)
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const adminId = req.adminId; // ✅ comes from JWT middleware

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    const [result] = await db.query(
      "INSERT INTO users (adminId, name, email, age) VALUES (?, ?, ?, ?)",
      [adminId, name, email, age]
    );

    res.status(201).json({ message: "User created", userId: result.insertId });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📋 Get All Users (for logged-in admin only)
const getAllUsers = async (req, res) => {
  try {
    const adminId = req.adminId; // ✅ filter by admin
    const [rows] = await db.query("SELECT * FROM users WHERE adminId = ?", [adminId]);
    res.json(rows);
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔎 Get Single User (only if belongs to logged-in admin)
const getUser = async (req, res) => {
  try {
    const adminId = req.adminId;
    const [rows] = await db.query("SELECT * FROM users WHERE id = ? AND adminId = ?", [
      req.params.id,
      adminId,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found or not yours" });
    res.json(rows[0]);
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✏️ Update User (only if belongs to logged-in admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const adminId = req.adminId;

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    const [result] = await db.query(
      "UPDATE users SET name=?, email=?, age=? WHERE id=? AND adminId=?",
      [name, email, age, req.params.id, adminId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found or not yours" });

    res.json({ message: "User updated successfully" });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ❌ Delete User (only if belongs to logged-in admin)
const deleteUser = async (req, res) => {
  try {
    const adminId = req.adminId;
    const [result] = await db.query("DELETE FROM users WHERE id=? AND adminId=?", [
      req.params.id,
      adminId,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found or not yours" });

    res.json({ message: "User deleted successfully" });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export all functions
module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser };

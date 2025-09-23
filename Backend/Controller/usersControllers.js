const db = require("../db");

// A simple helper function to validate email format
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email); 
};

// ➕ Create User
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

      // Now we use our validation function
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    const [result] = await db.query(
      "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );

    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get All Users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔎 Get User by ID
const getUser = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  }
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }
    
    const [result] = await db.query(
      "UPDATE users SET name=?, email=?, age=? WHERE id=?",
      [name, email, age, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully" });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete User
const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export all functions as one object
module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser};

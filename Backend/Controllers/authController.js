const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

    // check existing
    const [existing] = await db.query("SELECT id FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "Admin registered successfully", adminId: result.insertId });
  }
  catch (err) {
    return res.status(500).json({ error: "Signup failed", details: err.message });
  }
};


// Admin Login 
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "Invalid email or password" });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // create token
    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // IMPORTANT: include adminName in response so frontend can show welcome immediately
    return res.json({ message: "Login successful", token, adminName: admin.name });
  }
  catch (err) {
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
};

// GET /auths/me -> return admin profile based on token (requires authMiddleware)
const me = async (req, res) => {
  try {
    const adminId = req.adminId;
    if (!adminId) return res.status(401).json({ error: "Unauthorized" });

    const [rows] = await db.query("SELECT id, name, email, createdAt FROM admins WHERE id = ?", [adminId]);
    if (rows.length === 0) return res.status(404).json({ error: "Admin not found" });

    return res.json(rows[0]);
  } 
  catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile", details: err.message });
  }
};

module.exports = { signup, login, me };


let users = []; // in-memory array for Task 4

// Create a user
const createUser = (req, res) => {

  try {
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      age: age ? Number(age) : null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    res.status(201).json(newUser);
  }
  
  catch (err) {
    console.error("❌ Error in createUser:", err.message);
    res.status(500).json({ error: "Server error while creating user" });
  }

};


// Get all users
const getAllUsers = (req, res) => {

  try {
    res.json(users);
  } 
  
  catch (err) {
    console.error("❌ Error in getUsers:", err.message);
    res.status(500).json({ error: "Server error while fetching users" });
  }

};


// Get a single user
const getUser = (req, res) => {

  try {
    const { id } = req.params;
    const user = users.find((u) => u.id === id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  }
  
  catch (err) {
    console.error("❌ Error in getUser:", err.message);
    res.status(500).json({ error: "Server error while fetching user" });
  }
};

// Update a user
const updateUser = (req, res) => {

  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (email && email !== user.email) {
      const exists = users.find((u) => u.email === email && u.id !== id);
      if (exists) return res.status(409).json({ error: "Email already in use" });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.age = age !== undefined ? Number(age) : user.age;

    res.json(user);
  } 
  
  catch (err) {
    console.error("❌ Error in updateUser:", err.message);
    res.status(500).json({ error: "Server error while updating user" });
  }

};

// Delete a user
const deleteUser = (req, res) => {

  try {
    const { id } = req.params;
    const initialLen = users.length;
    users = users.filter((u) => u.id !== id);

    if (users.length === initialLen) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } 
  
  catch (err) {
    console.error("❌ Error in deleteUser:", err.message);
    res.status(500).json({ error: "Server error while deleting user" });
  }
  
};

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser };

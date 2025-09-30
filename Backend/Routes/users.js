const express = require("express");
const
  {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
  } = require("../Controllers/usersController");
  const authMiddleware = require("../Middleware/authMiddleware");


const router = express.Router();

router.post("/", authMiddleware, createUser);                // POST /users
router.get("/", authMiddleware,getAllUsers);                 // GET  /users
router.get("/:id",authMiddleware, getUser);                  // GET  /users/:id
router.put("/:id",authMiddleware, updateUser);               // PUT  /users/:id
router.delete("/:id",authMiddleware, deleteUser);            // DELETE /users/:id

module.exports = router;

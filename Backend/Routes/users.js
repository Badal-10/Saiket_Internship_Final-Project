const express = require("express");
const
  {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
  } = require("../Controller/usersControllers");

const router = express.Router();

router.post("/", createUser); // POST /users
router.get("/", getAllUsers); // GET  /users
router.get("/:id", getUser); // GET  /users/:id
router.put("/:id", updateUser); // PUT  /users/:id
router.delete("/:id", deleteUser); // DELETE /users/:id

module.exports = router;

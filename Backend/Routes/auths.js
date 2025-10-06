const express = require("express");
const { signup, login, me } = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, me);       // protected: returns admin profile

module.exports = router;

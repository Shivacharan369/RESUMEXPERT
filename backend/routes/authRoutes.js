const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);
router.get("/profile", authController.getProfile);
module.exports = router;
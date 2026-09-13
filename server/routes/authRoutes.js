const express = require("express");

const {
    registerStudent,
    login
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student registration
router.post("/register", registerStudent);

// Login
router.post("/login", login);

// Temporary protected route for testing JWT
router.get("/protected-test", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route successfully!",
        user: req.user
    });
});



module.exports = router;
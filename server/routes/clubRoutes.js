const express = require("express");

const { createClub } = require("../controllers/clubController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Only Super Admin can create a club
router.post(
    "/",
    protect,
    authorizeRoles("SUPER_ADMIN"),
    createClub
);

module.exports = router;
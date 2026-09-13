const express = require("express");

const { createClubAdmin } = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Only Super Admin can create Club Admins
router.post(
    "/club-admin",
    protect,
    authorizeRoles("SUPER_ADMIN"),
    createClubAdmin
);

module.exports = router;
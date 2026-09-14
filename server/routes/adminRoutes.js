const express = require("express");

const { createClubAdmin } = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const clubOwnership = require("../middleware/clubOwnershipMiddleware");

const router = express.Router();

// Only Super Admin can create Club Admins
router.post(
    "/club-admin",
    protect,
    authorizeRoles("SUPER_ADMIN"),
    createClubAdmin
);

// Temporary club ownership test
router.post(
    "/club-ownership-test",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    clubOwnership,
    (req, res) => {
        res.json({
            message: "Club ownership verified successfully!"
        });
    }
);

module.exports = router;
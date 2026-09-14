const express = require("express");

const { createEvent } = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const clubOwnership = require("../middleware/clubOwnershipMiddleware");

const router = express.Router();

// Create Event
// Club Admin → only their own club
// Super Admin → any club
router.post(
    "/",
    protect,
    authorizeRoles("CLUB_ADMIN", "SUPER_ADMIN"),
    clubOwnership,
    createEvent
);

module.exports = router;